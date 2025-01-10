import React, { useEffect, useState } from "react";
import useFirework from "../../hooks/useFirework.ts";
import { useRecoilValue } from "recoil";
import { RoomDataProps } from "../../types/RoomData.type.ts";
import { gameState } from "../../recoil/atoms/gameState.ts";
import DetailRank from "../rank/DetailRank.tsx";

const GameResultChart: React.FC = () => {
  const game = useRecoilValue<RoomDataProps | null>(gameState);

  const [isChartReached, setIsChartReached] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isChartColor, setIsChartColor] = useState<boolean>(true);
  const [scaleValues, setScaleValues] = useState<{ [key: string]: number }>({});
  const [currentHeights, setCurrentHeights] = useState<{ [key: string]: number }>(() => {
    if (!game) return {};
    const initialHeights: { [key: string]: number } = {};
    if (game.gameType === "FREE_FOR_ALL") {
      game.teams[0].users.forEach((user) => {
        initialHeights[user.nickname] = 0;
      });
    } else {
      game.teams.forEach((team) => {
        initialHeights[team.teamName] = 0;
      });
    }
    return initialHeights;
  });

  useEffect(() => {
    if (!game) return;

    const scores = (() => {
      if (game.gameType === "FREE_FOR_ALL") {
        return game.teams[0].users.reduce<{ [key: string]: number }>((acc, user) => {
          acc[user.nickname] = user.clickCount;
          return acc;
        }, {});
      } else {
        return game.teams.reduce<{ [key: string]: number }>((acc, team) => {
          acc[team.teamName] = team.teamScore;
          return acc;
        }, {});
      }
    })();

    const maxScore = Math.max(...Object.values(scores));
    const percentScores = Object.keys(scores).reduce<{ [key: string]: number }>((acc, key) => {
      acc[key] = (scores[key] / maxScore) * 100;
      return acc;
    }, {});

    setScaleValues(
      Object.keys(percentScores).reduce<{ [key: string]: number }>((acc, key) => {
        acc[key] = 1; // 초기 scale 값을 1로 설정
        return acc;
      }, {})
    );

    let remainingKeys = Object.keys(percentScores).sort((a, b) => percentScores[a] - percentScores[b]);
    const intervalTime = 50;
    const maxTime = 3000;
    const totalSteps = maxTime / intervalTime;
    const stepHeight = 100 / totalSteps;

    const interval = setInterval(() => {
      setCurrentHeights((prevHeights) => {
        let hasUpdated = false;
        const updatedHeights = { ...prevHeights };

        remainingKeys.forEach((key) => {
          const currentValue = prevHeights[key] || 0;
          const targetValue = percentScores[key];

          if (currentValue < targetValue) {
            hasUpdated = true;
            updatedHeights[key] = Math.min(currentValue + stepHeight, targetValue);
          }
        });

        remainingKeys = remainingKeys.filter((key) => updatedHeights[key] < percentScores[key]);

        if (!hasUpdated) {
          clearInterval(interval);
          setIsChartReached(true);
          setIsChartColor(false)
          setModalVisible(true);
          useFirework();
          setTimeout(() => {setModalVisible(false);
            setIsChartColor(true)}, 3000);

          let zoomCount = 0;
          const zoomInterval = setInterval(() => {
            setScaleValues((prev) => {
              const updatedScales = { ...prev };
              Object.keys(updatedScales).forEach((key) => {
                if (percentScores[key] === 100) {
                  updatedScales[key] = updatedScales[key] === 1 ? 1.03 : 1;
                }
              });
              return updatedScales;
            });
            zoomCount++;
            if (zoomCount >= 6) clearInterval(zoomInterval);
          }, 450);
        }

        return updatedHeights;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [game]);

  const winnerLabel = (() => {
    if (!game) return "";
    if (game.gameType === "FREE_FOR_ALL") {
      const topPlayer = game.teams[0].users.reduce((prev, curr) => (curr.clickCount > prev.clickCount ? curr : prev));
      return topPlayer.nickname;
    } else {
      const topTeam = game.teams.reduce((prev, curr) => (curr.teamScore > prev.teamScore ? curr : prev));
      return topTeam.teamName;
    }
  })();

  const scores = (() => {
    if (!game) return {};
    if (game.gameType === "FREE_FOR_ALL") {
      return game.teams[0].users.reduce<{ [key: string]: number }>((acc, user) => {
        acc[user.nickname] = user.clickCount;
        return acc;
      }, {});
    } else {
      return game.teams.reduce<{ [key: string]: number }>((acc, team) => {
        acc[team.teamName] = team.teamScore;
        return acc;
      }, {});
    }
  })();

  return (
    <div
      className={`w-full h-full flex flex-col justify-around items-center bg-white`}>
      <div className={`absolute w-full h-full ${modalVisible ? 'top-16 bg-black opacity-70' : 'hidden'} `}>
      </div>
      <div>
        <span className={`text-3xl ${modalVisible ? 'text-white' : 'text-black' }  opacity-90`}>{`${isChartReached ? `우승 : ${winnerLabel}` : ""}`}</span>
      </div>
      <div className="w-3/4 h-96 flex justify-around items-end z-[30]">
        {Object.entries(currentHeights).map(([key, value]) => (
          <div
            key={key}
            className={`w-1/6 text-center bg-blue-300 text-black rounded-t-md z-[30]`}
            style={{
              height: `${value}%`,
              transition: 'height 0.05s ease-in-out, transform 0.3s ease-in-out',
              transform: scaleValues[key] ? `scale(${scaleValues[key]})` : undefined,
            }}
          >
            {key ===
            Object.keys(currentHeights).find(
              (k) => currentHeights[k] === Math.max(...Object.values(currentHeights))
            ) && modalVisible ? (
                <div
                  className="absolute w-[400%] h-[120%] opacity-70 z-[50]"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(255, 255, 255, 1.0) 0%, rgba(255, 255, 255, 0.0) 70%, transparent 100%)',
                    clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)',
                    top: '-20%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    filter: 'blur(10px)',
                  }}
                ></div>)
              : (<div className={`${isChartColor ? '' : 'h-full bg-black opacity-70 rounded-t-md'}`}>
              </div>)
            }
            <span className="absolute top-0 mt-2 text-sm block mb-1 w-full  ">{isChartReached ? `${scores[key]}` : ''}</span>
            <span
              className="absolute bottom-[-28px] text-md text-black block w-full">{key}</span>
          </div>
        ))}
      </div>
      <DetailRank/>
    </div>
  );
};

export default GameResultChart;
