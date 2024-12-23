import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useResetRecoilState } from 'recoil';
import { gameState } from '../../recoil/atoms/gameState.ts';
import { userState } from '../../recoil/atoms/userState.ts';
import { gameReadyState } from '../../recoil/atoms/gameReadyState.ts';
import WebSocketManager from "../../services/WebSocketManager.ts";
import CurrentUserCount from "../../components/user-count/CurrentUserCount.tsx";

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

  const resetGameState = useResetRecoilState(gameState);
  const resetUserState = useResetRecoilState(userState);
  const resetGameReadyState = useResetRecoilState(gameReadyState);

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

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

  const title: string = '🐹 Welcome 🐭\n Click Meee!!!';

  useEffect(() => {
    const webSocketManager = WebSocketManager.getInstance();
    if(webSocketManager.isConnected()){
      webSocketManager.disconnect();
      resetGameState();
      resetUserState();
      resetGameReadyState();
    }
  }, []);

  const handleNavigatePage = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <CurrentUserCount/>
      <div className="flex z-10 flex-col justify-center items-center mt-10 md-10 bg-slate-50 bg-opacity-0 text-white p-6">
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

          {/* 모바일에서는 전체화면 버튼을 노출 X  */}
          {!/Mobi/i.test(window.navigator.userAgent) ? (
            <button onClick={toggleFullscreen} className="basic-button text-xl text-center mb-5">
              {isFullscreen ? '🌕 전체화면 종료' : '☀️ 전체화면'}
            </button>) : <></>
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
