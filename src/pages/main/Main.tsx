import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useResetRecoilState } from 'recoil';
import { gameState } from '../../recoil/atoms/gameState.ts';
import { userState } from '../../recoil/atoms/userState.ts';
import { gameReadyState } from '../../recoil/atoms/gameReadyState.ts';
import WebSocketManager from '../../services/WebSocketManager.ts';
import CurrentUserCount from '../../components/user-count/CurrentUserCount.tsx';
import MainButton from './components/MainButton.tsx';

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
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isVisibleTitle, setIsVisibleTitle] = useState<boolean>(false);

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
    resetGameState();
    resetUserState();
    resetGameReadyState();

    const webSocketManager = WebSocketManager.getInstance();
    if (webSocketManager.isConnected()) {
      webSocketManager.disconnect();
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsVisibleTitle(true);
    }, 100)

    setTimeout(() => {
      setIsVisibleTitle(false);
    }, 400)

    setTimeout(() => {
      setIsVisible(true);
    }, 600);

  }, []);

  const handleNavigatePage = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <div
        className={`z-[-1] fixed text-9xl text-orange-500 left-1/2 top-1/2 transition-all transform -translate-x-1/2 -translate-y-1/2 duration-[400ms] ${isVisibleTitle ? 'opacity-100' : 'opacity-0'}`}
      >
        Click Meee
      </div>
      <div className={`transition-all duration-[400ms] ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <CurrentUserCount />
        <div className="flex z-10 flex-col justify-center items-center mt-10 md-10 bg-slate-50 bg-opacity-0 text-white p-6">
          <div className="bg-gray-700 rounded-xl max-w-100 w-2/5 min-w-80 h-5/6 p-10 shadow-floating">
            <div className="text-center whitespace-pre-wrap md:text-4xl mb-10 text-2xl sm:text-3xl xl:text-5xl">
              {title}
            </div>
            <MainButton
              text={'📚 방 목록'}
              onClickFunction={() => handleNavigatePage('/room-list')}
            />
            <MainButton
              text={'🎊 방 생성'}
              onClickFunction={() => handleNavigatePage('/game-setting')}
            />
            <MainButton
              text={'🚪 방 코드 입장'}
              onClickFunction={() => handleNavigatePage('/enter')}
            />
            <MainButton
              text={isFullscreen ? '🌕 전체화면 종료' : '☀️ 전체화면'}
              onClickFunction={toggleFullscreen}
            />
            <MainButton text={'🆘 도움말'} onClickFunction={() => handleNavigatePage('/help')} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
