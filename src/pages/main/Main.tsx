import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ReadCurrentUserCount } from '../../api/ReadCurrentUserCount.ts';

const Main = () => {
  // 이스터에그
  const easterEgg = `
    _    _        _                               
    | |  | |      | |                              
    | |  | |  ___ | |  ___   ___   _ __ ___    ___ 
    | |/\| | / _ \| | / __| / _ \ | '_ \` _ \  / _ \\
    \\  /\\  /|  __/| || (__ | (_) || | | | | ||  __/
    \\/  \\/  \\___||_| \\___| \\___/ |_| |_| |_| \\___|
    _____  _  _        _     ___  ___                   _  _  _ 
    /  __ \\| |(_)      | |    |  \\/  |                  | || || |
    | /  \\/| | _   ___ | | __ | .  . |  ___   ___   ___ | || || |
    | |    | || | / __|| |/ / | |\\/| | / _ \\ / _ \\ / _ \\| || || |
    | \\__/\\| || || (__ |   <  | |  | ||  __/|  __/|  __/|_||_||_|
    \\____/|_||_| \\___||_|\\_\\ \\_|  |_\\/ \\___| \\___| \\___|(_)(_)(_)
`;

  console.log(easterEgg);
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState<number | null>(null);

  const fetchCurrentUserCount = async () => {
    setUserCount(await ReadCurrentUserCount());
  };

  useEffect(() => {
    fetchCurrentUserCount();
    let polling = setInterval(fetchCurrentUserCount, 5000);

    return () => {
      clearInterval(polling);
    }
  }, []);

  const handleNavigatePage = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <span className="w-1/7 transition-all fixed hidden lg:block">
        <div className={`bg-gray-700 m-10 mt-6 text-white p-5 rounded-xl shadow-floating opacity-${userCount !== null ? 100 : 0}`}>
          🐥 현재 접속자 수 : {userCount}
        </div>
      </span>

      <div className="flex z-10 flex-col justify-center items-center mt-10 md-10 bg-slate-50 bg-opacity-0 text-white p-6">
        <div className="bg-gray-700 rounded-xl max-w-100 w-2/5 min-w-80 h-5/6 p-10 shadow-floating">
          <div className="text-center text-3xl mb-10">🐹 Welcome Click Meee!!! 🐭</div>
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
        </div>
      </div>
    </>
  );
};

export default Main;
