import React, { useEffect, useState, useRef } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import useFirework from "../../hooks/useFirework.ts";
import { useRecoilValue } from "recoil";
import { RoomDataProps } from "../../types/RoomData.type.ts";
import { gameState } from "../../recoil/atoms/gameState.ts";

// Chart.js 모듈 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GameResultChart: React.FC = () => {
  const game = useRecoilValue<RoomDataProps | null>(gameState);
  const chartRef = useRef<any>(null);
  const [isChartReached, setIsChartReached] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [scaleValue, setScaleValue] = useState<number>(1);

  useEffect(() => {
    // 1초마다 값 변경
    const intervalId = setInterval(() => {
      setScaleValue((prevValue: number) => {
        if(prevValue > 2){
          clearInterval(intervalId);
        }
        return prevValue + 0.01;
      }); // 값 증가
    }, 10); // 1000ms = 1초

    // 컴포넌트가 언마운트될 때 interval을 정리
    return () => clearInterval(intervalId);
  }, []);

  // 초기 데이터 상태
  const [currentScores, setCurrentScores] = useState<{ [key: string]: number }>(() => {
    if (!game) return {};
    const initialScores: { [key: string]: number } = {};
    if (game.gameType === 'FREE_FOR_ALL') {
      game.teams[0].users.forEach((user) => {
        initialScores[user.nickname] = 0; // 초기값은 0
      });
    } else {
      game.teams.forEach((team) => {
        initialScores[team.teamName] = 0; // 초기값은 0
      });
    }
    return initialScores;
  });

  useEffect(() => {
    if (!game) return;

    const finalScores = (() => {
      if (game.gameType === 'FREE_FOR_ALL') {
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

    const interval = setInterval(() => {
      setCurrentScores((prevScores) => {
        let hasUpdated = false;

        const updatedScores = Object.keys(finalScores).reduce((acc, key) => {
          const currentValue = prevScores[key] || 0;
          const targetValue = finalScores[key];

          if (currentValue < targetValue) {
            hasUpdated = true;
            acc[key] = Math.min(currentValue + 1, targetValue); // 값 1씩 증가
          } else {
            acc[key] = currentValue; // 값 유지
          }

          return acc;
        }, {} as { [key: string]: number });

        if (!hasUpdated) {
          clearInterval(interval); // 모든 값이 목표에 도달하면 타이머 정지
        }

        return updatedScores;
      });
    }, 50); // 업데이트 속도 (50ms)

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
  }, [game]);

  useEffect(() => {
    if (!game) return;

    const finalScores = (() => {
      if (game.gameType === 'FREE_FOR_ALL') {
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

    const allReached = Object.keys(finalScores).every(
      (key) => currentScores[key] === finalScores[key]
    );

    if (allReached && !isChartReached) {
      setIsChartReached(true);
      setModalVisible(true);
      useFirework();
      setTimeout(() => setModalVisible(false), 3000); // 3초 뒤에 모달 숨김
    }
  }, [currentScores, game, isChartReached]);

  const chartData = {
    labels:
      game?.gameType === 'FREE_FOR_ALL'
        ? game.teams[0].users.map((user) => user.nickname)
        : game?.teams.map((team) => team.teamName) || [], // X축 레이블
    datasets: [
      {
        label: "Scores",
        data: Object.values(currentScores), // 현재 값
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        borderColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
        text: "Animated Bar Chart with Game Data",
      },
    },
    scales: {
      x: {
        title: {
          display: false,
          text: game?.gameType === 'FREE_FOR_ALL' ? "Players" : "Teams",
        },
        ticks: {
          display: false // X축의 값 숨기기
        },
        grid: {
          display: false // X축의 그리드 선 숨기기
        },
        border: {
          display: false // X축 선 숨기기
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: false,
          text: "Scores",
        },
        ticks: {
          display: false // Y축의 값 숨기기
        },
        grid: {
          display: false // Y축의 그리드 선 숨기기
        },
        border: {
          display: false // Y축 선 숨기기
        }
      },
    },
  };

  const winnerLabel = (() => {
    if (!game) return "";
    if (game.gameType === 'FREE_FOR_ALL') {
      const topPlayer = game.teams[0].users.reduce((prev, curr) => (curr.clickCount > prev.clickCount ? curr : prev));
      return topPlayer.nickname;
    } else {
      const topTeam = game.teams.reduce((prev, curr) => (curr.teamScore > prev.teamScore ? curr : prev));
      return topTeam.teamName;
    }
  })();

  return (
    <div className="relative w-1/2 h-3/4">
      <div className={`w-1/2 h-1/2 transform`}
           style={{ transform: `scale(${scaleValue}) translateY(${scaleValue * 50}px)` }}>
        <Bar ref={chartRef} data={chartData} options={chartOptions} />
      </div>
      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-30">
          <div className="absolute inset-0 bg-gray-500 bg-opacity-50"></div>
          <div className="bg-white p-4 rounded-lg shadow-lg text-center z-40">
            <h1 className="text-2xl font-bold">우승 : {winnerLabel}</h1>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameResultChart;
