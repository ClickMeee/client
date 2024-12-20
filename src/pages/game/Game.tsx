import { useEffect, useState } from 'react';
import IndividualChart from '../../components/chart/IndividualChart';
import TeamChart from '../../components/chart/TeamChart';
import ResultModal from '../../components/modal/ResultModal.tsx';
import TeamRank from '../../components/Rank/TeamRank';
import WebSocketManager from '../../services/WebSocketManager.ts';

const Game = () => {
  const [count, setCount] = useState<number>(4);
  const [moveMessage, setMoveMessage] = useState<boolean>(false); // 움직이는 카운트다운 메시지
  const [resultModal, setResultModal] = useState<boolean>(false); // 결과 모달
  const webSocketManager = WebSocketManager.getInstance();
  const [clickEffect, setClickEffect] = useState<{ id: number; x: number; y: number }[]>([]);

  const startMessage = '🚀 Game Start! 🧑‍🚀';
  const second = 1000;
  const halfSecond = 500;

  useEffect(() => {
    webSocketManager.setShowResultMessage(setResultModal);
    setMoveMessage(true);
    const handleCountdown = () => {
      setCount((prevCount) => {
        setMoveMessage(true);
        if (prevCount === 1) {
          clearInterval(interval);
        }
        return prevCount - 1;
      });
    };

    const handleMove = () => {
      setMoveMessage(false);
    };

    let interval = setInterval(handleCountdown, second);
    let i = setInterval(handleMove, halfSecond);

    return () => {
      clearInterval(interval);
      clearInterval(i);
    };
  }, []);

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    webSocketManager.sendClickEvent();

    handleButtonClickSound();
    handleButtonClickAnimation(e);
  };

  const handleButtonClickSound = () => {
    const sound = new Audio('/click-water.mp3');
    sound.play();
  };

  const handleButtonClickAnimation = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { left, top } = e.currentTarget.getBoundingClientRect();

    // 클릭 효과 추가
    const effect = { id: Date.now(), x: clientX - left, y: clientY - top };

    setClickEffect((prev) => [...prev, effect]);

    setTimeout(() => {
      setClickEffect((prev) => prev.filter((item) => item.id !== effect.id)); // 오래된 효과 제거
    }, 500); // 애니메이션 지속 시간과 일치
  };

  return (
    <>
      {resultModal && <ResultModal setResultModal={setResultModal} />}
      {count > 0 ? (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gray-500 bg-opacity-50"></div>
          <div
            className={`transform relative ease-in-out transition-all ${moveMessage ? '-translate-y-20' : ''} duration-1000 text-9xl text-orange-500`}
          >
            {count > 1 ? count - 1 : startMessage}
          </div>
        </div>
      ) : null}
      <div className="flex flex-col gap-8 p-8 h-full">
        <div className="flex flex-col items-center justify-center w-full h-1/2 md:h-2/3 p-4 bg-white rounded-xl shadow-xl box-border">
          {/* 차트 표시 div */}
          <div className="flex gap-4 w-full h-full">
            <div className="flex-[3] h-full hidden md:block">
              <TeamChart />
            </div>
            <div className="flex flex-col flex-[2] gap-4">
              <div className="flex-1 h-1/4 hidden md:block md:h-1/2">
                <IndividualChart />
              </div>
              <div className="flex-1 h-3/4 p-4 md:h-1/2">
                <TeamRank resultModal={false} />
              </div>
            </div>
          </div>
        </div>
        {/* 클릭 버튼 */}
        <div className="relative flex-1 select-none flex w-full h-full box-border shadow-xl overflow-hidden">
          <button
            className="w-full h-full text-xl font-bold bg-orange-400 rounded-lg box-border hover:bg-orange-500 focus:outline-none"
            onClick={handleButtonClick}
          >
            Click Mee!
            {/* 클릭 애니메이션 효과 */}
            {clickEffect.map((effect) => (
              <span
                key={effect.id}
                className="absolute bg-red-600 opacity-70 rounded-full transform scale-50 animate-ping"
                style={{
                  top: `${effect.y - 175}px`,
                  left: `${effect.x - 175}px`,
                  width: '350px',
                  height: '350px',
                }}
              ></span>
            ))}
          </button>
        </div>
      </div>
    </>
  );
};

export default Game;
