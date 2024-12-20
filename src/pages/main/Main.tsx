import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ReadCurrentUserCount } from '../../api/ReadCurrentUserCount.ts';
import { useResetRecoilState } from 'recoil';
import { gameState } from '../../recoil/atoms/gameState.ts';
import { userState } from '../../recoil/atoms/userState.ts';
import { gameReadyState } from '../../recoil/atoms/gameReadyState.ts';
import WebSocketManager from "../../services/WebSocketManager.ts";

const Main = () => {
  // 이스터에그
  const easterEgg = `
    _    _        _                               
    | |  | |      | |                              
    | |  | |  ___ | |  ___   ___   _ __ ___    ___ 
    | |/\\| | / _ \\| | / __| / _ \\ | '_ \` _ \\  / _ \\
    \\  /\\  /|  __/| || (__ | (_) || | | | | ||  __/
     \\/  \\/  \\___||_| \\___| \\___/ |_| |_| |_| \\___|
     _____  _  _        _     ___  ___                   _  _  _ 
    /  __ \\| |(_)      | |    |  \\/  |                  | || || |
    | /  \\/| | _   ___ | | __ | .  . |  ___   ___   ___ | || || |
    | |    | || | / __|| |/ / | |\\/| | / _ \\ / _ \\ / _ \\| || || |
    | \\__/\\| || || (__ |   <  | |  | ||  __/|  __/|  __/|_||_||_|
     \\____/|_||_| \\___||_|\\_\\ \\_|  |_/ \\___| \\___| \\___|(_)(_)(_)
`;

  console.log(easterEgg);
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState<number | null>(null);
  const resetGameState = useResetRecoilState(gameState);
  const resetUserState = useResetRecoilState(userState);
  const resetGameReadyState = useResetRecoilState(gameReadyState);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const webSocketManager = WebSocketManager.getInstance();

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      // 전체 화면을 요청합니다.
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      // 전체 화면 종료
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const fetchCurrentUserCount = async () => {
    setUserCount(await ReadCurrentUserCount());
  };

  const title: string = '🐹 Welcome 🐭\n Click Meee!!!';

  useEffect(() => {
    webSocketManager.disconnect();
    resetGameState();
    resetUserState();
    resetGameReadyState();

    fetchCurrentUserCount();
    const polling = setInterval(fetchCurrentUserCount, 5000);

    return () => {
      clearInterval(polling);
    };
  }, []);

  const handleNavigatePage = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <span className="w-1/7 transition-all fixed hidden lg:block">
        <div
          className={`bg-gray-700 m-10 mt-6 text-white p-5 rounded-xl shadow-floating opacity-${userCount !== null ? 100 : 0}`}
        >
          🐥 현재 접속자 수 : {userCount}
        </div>
      </span>

      <div
        className="flex z-10 flex-col justify-center items-center mt-10 md-10 bg-slate-50 bg-opacity-0 text-white p-6">
        <div className="bg-gray-700 rounded-xl max-w-100 w-2/5 min-w-80 h-5/6 p-10 shadow-floating">
          <div className="text-center whitespace-pre-wrap md:text-4xl mb-10 text-2xl sm:text-3xl xl:text-5xl">
            {title}
          </div>
          <button
            onClick={() => handleNavigatePage('/room-list')}
            className="basic-button text-xl text-center mb-5"
          >
            📚 방 목록
          </button>
          <button
            onClick={() => handleNavigatePage('/game-setting')}
            className="basic-button text-xl text-center mb-5"
          >
            🎊 방 생성
          </button>
          <button
            onClick={() => handleNavigatePage('/enter')}
            className="basic-button text-xl text-center mb-5"
          >
            🚪 방 코드 입장
          </button>
          {!/Mobi/i.test(window.navigator.userAgent) ?
            <button onClick={toggleFullscreen} className="basic-button text-xl text-center mb-5">
              {isFullscreen ? '🌕 전체화면 종료' : '☀️ 전체화면'}
            </button> : <></>
          }
          <button
            onClick={() => handleNavigatePage('/help')}
            className="basic-button text-xl text-center mb-5"
          >
            🆘 도움말
          </button>
        </div>
      </div>
    </>
  );
};

export default Main;
