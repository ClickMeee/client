import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from 'recoil';
import { CheckNicknameDuplicate } from '../../api/CheckNickname';
import { GameReadyState, gameReadyState } from '../../recoil/atoms/gameReadyState';
import { GameState, gameState } from '../../recoil/atoms/gameState.ts';
import { UserState, userState } from '../../recoil/atoms/userState.ts';
import { oneVsOneWebSocket } from '../../services/OneVsOneWebSocket';
import useMessages from '../../hooks/useMessage.ts';
import Modal from '../../components/modal/Modal.tsx';
import ClipboardJS from 'clipboard';

export default function GameReady() {
  const { roomId: urlRoomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useRecoilState<UserState>(userState);
  const [game, setGame] = useRecoilState<GameState | null>(gameState);
  const [gameReady, setGameReady] = useRecoilState<GameReadyState>(gameReadyState);

  const [nicknameInput, setNicknameInput] = useState<string>(''); // 닉네임 입력 상태
  const [isConnected, setIsConnected] = useState<boolean>(false); // WebSocket 연결 상태
  const [isGameButtonVisible, setIsGameButtonVisible] = useState<boolean>(false); // 게임 시작 버튼 상태
  const [countdown, setCountdown] = useState<number | null>(null); // 카운트다운 상태

  const { messages, showMessage } = useMessages();

  useEffect(() => {
    setUser((prev) => ({
      ...prev,
      roomId: urlRoomId, // urlRoomId 값을 user 상태의 roomId에 갱신
    }));

    if (!user.nickname || !user.roomId) {
      console.log('nickname이나 roomId가 없습니다.');
      return;
    }

    const playerRoomEnter = async () => {
      try {
        oneVsOneWebSocket.setRoomData(user.roomId!, user.nickname!);
        await oneVsOneWebSocket.connect();
        oneVsOneWebSocket.setGameStateUpdater(setGame, setGameReady);
        oneVsOneWebSocket.setNavigate(navigate);
        oneVsOneWebSocket.setShowMessage(showMessage);
        setIsConnected(true);
      } catch (err) {
        console.error('Failed to enter room:', err);
        setIsConnected(false);
      }
    };

    playerRoomEnter();
  }, [user.nickname, urlRoomId]);

  useEffect(() => {
    if (game) {
      const totalUsers = game.teams.reduce((total, team) => total + team.users.length, 0);
      const totalMaxUserCount = game.teams.reduce((total, team) => total + team.maxUserCount, 0);

      if (totalUsers === totalMaxUserCount && user.nickname === game.roomChief) {
        setIsGameButtonVisible(true);
      } else {
        setIsGameButtonVisible(false);
      }
    }
  }, [game]);

  const handleNicknameSubmit = async () => {
    if (!user.roomId) {
      console.error('Room ID is undefined');
      return;
    }

    if (!nicknameInput || !nicknameInput.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    try {
      const isDuplicateNickname = await CheckNicknameDuplicate(user.roomId, nicknameInput);
      if (isDuplicateNickname) {
        alert('이미 사용 중인 닉네임입니다.');
        return;
      }

      setUser((prev) => ({ ...prev, nickname: nicknameInput }));
      setIsConnected(true);
    } catch (error: any) {
      alert('방 입장에 실패했습니다.');
      console.error(error.message);
    }
  };

  const handleGameStart = () => {
    console.log('게임 시작 요청을 보냅니다.');
    oneVsOneWebSocket.startGameRequest();
  };

  const handleCopyGameRoomUrl = () => {
    var clipboard = new ClipboardJS('button', {
      text: function () {
        return window.location.href;
      }
    });
    clipboard.on('success', function (e) { });
    clipboard.on('error', function (e) { });
  };

  const handleCopyGameRoomCode = () => {
    var clipboard = new ClipboardJS('button', {
      text: function () {
        if (user.roomId) {
          return user.roomId;
        }
        throw new Error;
      }
    });
    clipboard.on('success', function (e) { });
    clipboard.on('error', function (e) { });
  };

  return (
    <>
      <Modal messages={messages} />
      <div className="flex z-10 flex-col justify-center items-center mt-10 md-10 bg-slate-50 bg-opacity-0 text-white p-6">
        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <h1 className="text-9xl font-bold text-red-500 animate-pulse">{countdown}</h1>
          </div>
        )}
        <div className="bg-gray-700 rounded-xl max-w-100 w-2/5 min-w-80 h-5/6 pt-4 pb-4 pl-2 pr-2 shadow-floating">
          <div className="mt-4 flex justify-center">
            <h1 className="text-3xl font-bold mb-4">🎲 Game </h1>
          </div>
          {isConnected ? (
            <div className='flex flex-row'>
              <button onClick={handleCopyGameRoomUrl} className="basic-button">
                🔗 방 링크 복사하기
              </button>
              <button onClick={handleCopyGameRoomCode} className="basic-button">
                0️⃣ 방 코드 복사하기
              </button>
            </div>
          ) : <></>}
          <div className="flex flex-col pt-6 pb-24 text-white">
            {!isConnected ? (
              <div className="bg-gray-900 pb-6 pl-2 pr-2 pt-3 rounded-lg shadow-floating">
                <div className="flex pb-2 justify-center">
                  <label htmlFor="nickname" className="block text-lg font-semibold mb-2">
                    닉네임 설정
                  </label>
                </div>
                <input
                  id="nickname"
                  type="text"
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)} // 입력 필드만 업데이트
                  className="w-full p-2 mb-4 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleNicknameSubmit}
                  className="w-full py-2 bg-blue-600 text-white rounded-md shadow-floating hover:bg-blue-500 transition duration-300"
                >
                  방 입장
                </button>
              </div>
            ) : (
              <>
                <div className='flex justify-center'>
                  <p className="text-2xl mb-4">🙋 총 참가자 수: {game?.teams.length || 0}</p>
                </div>
                <div className="text-center flex flex-row justify-around">
                  {game?.teams.map((team, index) => (
                    <div key={index} className={`mb-6 m-2 container w-1/${game?.teams.length} bg-gray-800 p-4 rounded-lg shadow-md`}>
                      <div className="text-2xl font-semibold">{team.teamName}</div>
                      <div className='text-sm text-gray-500 mb-2'>닉네임</div>
                      <div className="list-inside">
                        {team.users.map((u, userIndex) => (
                          <div key={userIndex} className={`text-white flex rounded-lg border-2 ${user.nickname === u.nickname ? 'border-orange-500' : 'border-white'}`}>
                            {user.nickname === u.nickname ? (
                              <div className="absolute self-center ml-2 text-xs">{game.roomChief === u.nickname ? '👑' : '👋'} me</div>
                            ) : user.nickname !== game.roomChief &&
                            <div className="absolute self-center ml-2 text-xs">👑</div>
                            }
                            <div className="flex-1 text-center">
                              {u.nickname}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          {isGameButtonVisible && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleGameStart}
                className="w-3/4 mb-2.5 py-2 bg-green-600 border-2 border-opacity-0 border-white hover:border-opacity-100 hover:-translate-y-1 hover:-translate-x-0.5 text-white rounded-md hover:shadow-floating hover:transition duration-300"
              >
                게임 시작
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
