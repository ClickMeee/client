import { oneVsOneWebSocket } from '../../services/OneVsOneWebSocket';
import TeamChart from '../../components/chart/TeamChart';
import IndividualChart from '../../components/chart/IndividualChart';
import TeamRank from '../../components/teamRank/TeamRank';
import { useEffect, useState } from 'react';

const Game = () => {
  const [count, setCount] = useState<number>(4);
  const [moveMessage, setMoveMessage] = useState<boolean>(false);


  const startMessage = '🚀 게임 시작 🧑‍🚀'
  const second = 1000;
  const halfSecond = 500;
  useEffect(() => {
    setMoveMessage(true)
    const handleCountdown = () => {
      setCount(prevCount => {
        setMoveMessage(true);
        if(prevCount == 1){
          clearInterval(interval);
        }
        return prevCount - 1;
      });
    };

    const handleMove = () => {
      setMoveMessage(false);
    }

    let interval = setInterval(handleCountdown, second);
    let i = setInterval(handleMove, halfSecond);

    return () => clearInterval(interval);
  }, []);

  const handleButtonClick = () => {
    oneVsOneWebSocket.sendClickEvent();
  };

  return (
    <>
      {count > 0 ? (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gray-500 bg-opacity-50"></div>
            <div className={`transform relative ease-in-out transition-all ${moveMessage ? "-translate-y-20" : ""} duration-1000 text-9xl text-orange-500`}>
              {count > 1 ? count - 1 : startMessage}
            </div>
        </div>
      ) : (
        <></>
      )}
      <div className="flex flex-col gap-8 p-8 h-full">
        <div className="flex flex-col items-center justify-center w-full h-2/3 p-4 bg-white rounded-xl shadow-xl box-border">
          {/* 차트 표시 div */}
          <div className="flex gap-4 w-full h-full">
            <div className="flex-[3] h-full">
              <TeamChart />
            </div>
            <div className="flex flex-col flex-[2] gap-4">
              <div className="flex-1 h-1/2">
                <IndividualChart />
              </div>
              <div className="flex-1 h-1/2 p-4">
                <TeamRank />
              </div>
            </div>
          </div>
        </div>
        {/* 클릭 버튼 */}
        <div className="flex-1 flex w-full h-full box-border shadow-xl">
          <button
            className="w-full h-full bg-orange-400 text-xl font-bold rounded-lg hover:bg-orange-500 box-border"
            onClick={handleButtonClick}
          >
            Click Mee!
          </button>
        </div>
      </div>
    </>
  );
};

export default Game;
