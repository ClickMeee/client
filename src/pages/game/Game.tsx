import { oneVsOneWebSocket } from '../../services/OneVsOneWebSocket';
import TeamChart from '../../components/chart/TeamChart';
import IndividualChart from '../../components/chart/IndividualChart';
import TeamRank from '../../components/teamRank/TeamRank';
import { useState } from 'react';
import { Particles } from 'react-tsparticles';
import { loadFull } from "tsparticles";

const Game = () => {
  const [showParticles, setShowParticles] = useState<boolean>(false);

  const handleButtonClick = () => {
    setShowParticles(true); // 파티클 활성화
    oneVsOneWebSocket.sendClickEvent();
    setTimeout(() => setShowParticles(false), 1500); // 1.5초 후 비활성화
  };

  const particlesInit = async (engine: any): Promise<void> => {
    // loadFull을 통해 모든 particles 기능을 불러옵니다.
    await loadFull(engine);
  };

  return (
    <>
      <div className="relative h-64 w-full">
        {showParticles && (
          <Particles
            id="tsparticles"
            init={particlesInit}
            options={{
              fullScreen: { enable: true },
              particles: {
                number: { value: 30 },
                size: { value: 3 },
                move: {
                  enable: true, // 파티클 움직임 활성화
                  speed: 2, // 파티클 이동 속도
                  direction: "none", // 파티클 이동 방향
                  random: true, // 랜덤 이동
                  straight: false, // 직선 이동 여부
                  outModes: { default: "out" }, // 화면 밖으로 나가면 다시 등장
                },
                shape: { type: 'circle' },
                opacity: { value: 0.7 },
              },
              interactivity: {
                detectsOn: "window", // 윈도우 전체에서 감지
                events: {
                  onHover: {
                    enable: true,
                    mode: "trail", // 마우스 이동 시 'trail' 모드 활성화
                  },
                },
                modes: {
                  trail: {
                    delay: 0.02, // 파티클 생성 딜레이
                    quantity: 5, // 마우스 이동 시 생성되는 파티클 수
                    particles: {
                      color: { value: "#00aaff" }, // 생성되는 파티클 색상
                      move: { speed: 5 }, // trail 파티클 이동 속도
                      size: { value: 3, random: true }, // 파티클 크기
                    },
                  },
                },
              },
            }}
            className="absolute inset-0 pointer-events-none"
          />
        )}
        </div>

        <div className="flex flex-col gap-8 p-8 h-full">
          <div
            className="flex flex-col items-center justify-center w-full h-2/3 p-4 bg-white rounded-xl shadow-xl box-border">
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
