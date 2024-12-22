import ClipboardJS from 'clipboard';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { CheckNicknameDuplicate } from '../../api/CheckEnterableRoom.ts';
import MessageModal from '../../components/modal/MessageModal.tsx';
import useMessages from '../../hooks/useMessage.ts';
import { gameReadyState } from '../../recoil/atoms/gameReadyState';
import { gameState } from '../../recoil/atoms/gameState.ts';
import { userState } from '../../recoil/atoms/userState.ts';
import WebSocketManager from '../../services/WebSocketManager.ts';
import { GameStateDataProps } from '../../types/GameStateData.type.ts';
import { RoomClientProps } from '../../types/RoomClient.type.ts';
import { RoomDataProps } from '../../types/RoomData.type.ts';

export default function GameReady() {
  const webSocketManager = WebSocketManager.getInstance();
  const { roomId: urlRoomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useRecoilState<RoomClientProps>(userState);
  const [game, setGame] = useRecoilState<RoomDataProps | null>(gameState);
  const [gameReady, setGameReady] = useRecoilState<GameStateDataProps>(gameReadyState);

  const [nicknameInput, setNicknameInput] = useState<string>(''); // 닉네임 입력 상태
  const [isConnected, setIsConnected] = useState<boolean>(false); // WebSocket 연결 상태
  const [isGameButtonVisible, setIsGameButtonVisible] = useState<boolean>(false); // 게임 시작 버튼 상태
  const [roomChiefModal, setRoomChiefModal] = useState<boolean>(false);

  const clipboardRef = useRef<ClipboardJS | null>(null);

  const { messages, showMessage } = useMessages();

  useEffect(() => {
    if (roomChiefModal) {
      const timer = setTimeout(() => {
        navigate('/'); // 원하는 경로로 이동
      }, 3000);

      return () => clearTimeout(timer); // 타이머 클리어
    }
  }, [roomChiefModal, navigate]);

  useEffect(() => {
    setUser((prev: RoomClientProps)  => ({
      ...prev,
      roomId: urlRoomId, // urlRoomId 값을 user 상태의 roomId에 갱신
    }));

    if (!user.nickname || !user.roomId) {
      console.log('nickname이나 roomId가 없습니다.');
      return;
    }

    const playerRoomEnter = async () => {
      try {
        webSocketManager.init(
          {
            roomId: user.roomId!,
            nickname : user.nickname!,
            updateGameState : setGame,
            updateGameReadyState : setGameReady,
            navigate : navigate,
            showMessage : showMessage,
            showRoomChiefLeaveMessage : setRoomChiefModal
          }
        )
        await webSocketManager.connect();

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
      const isTeamsHaveUsers = game.teams.every((team) => team.users.length > 0);

      // 각 팀의 사용자가 한명 이상 이고, 방장인 경우에만 게임 시작 버튼을 보여줌
      if (isTeamsHaveUsers && user.nickname === game.roomChief) {
        setIsGameButtonVisible(true);
      } else {
        setIsGameButtonVisible(false);
      }
    }
  }, [game]);

  useEffect(() => {
    // ClipboardJS 객체 초기화 (한 번만 실행)
    clipboardRef.current = new ClipboardJS('.copy-button');

    clipboardRef.current.on('success', (e) => {
      if (e.trigger.getAttribute('data-clipboard-text') === window.location.href) {
        showMessage('방 링크가 복사되었습니다.');
      } else {
        showMessage('방 코드가 복사되었습니다.');
      }
    });

    clipboardRef.current.on('error', () => {
      showMessage('복사에 실패했습니다.');
    });

    return () => clipboardRef.current?.destroy(); // 객체 제거
  }, []);

  const handleNicknameSubmit = async () => {
    if (!user.roomId) {
      console.error('Room ID is undefined');
      return;
    }

    if (!nicknameInput || !nicknameInput.trim()) {
      showMessage('닉네임을 입력해주세요.');
      return;
    }

    try {
      const enterable = await CheckNicknameDuplicate(user.roomId, nicknameInput);
      if (enterable) {
        showMessage('이미 사용 중인 닉네임입니다.');
        return;
      }

      setUser((prev) => ({ ...prev, nickname: nicknameInput }));
      setIsConnected(true);
    } catch (error: any) {
      showMessage('방 입장에 실패했습니다.');
      console.error(error.message);
    }
  };

  const handleTeamChange = (targetTeamName: string) => {
    console.log(`팀 이동: ${targetTeamName}`);

    let currentTeam = game?.teams.find((team) =>
      team.users.some((u) => u.nickname === user.nickname)
    );
    let currentTeamName = currentTeam?.teamName || null;

    webSocketManager.moveTeamRequest(targetTeamName, currentTeamName || '');
  };

  const handleGameStart = () => {
    console.log('게임 시작 요청을 보냅니다.');
    webSocketManager.startGameRequest();
  };

  return (
    <>
      <MessageModal messages={messages} />
      {roomChiefModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">방장이 방을 나갔습니다.</h1>
            <p className="text-gray-700">잠시 후 메인 페이지로 이동합니다...</p>
            <div className="loader m-auto"></div>
          </div>
        </div>
      )}
      <div className="flex z-10 flex-col justify-center items-center mt-10 md-10 bg-slate-50 bg-opacity-0 text-white p-6">
        <div className="bg-gray-700 rounded-xl max-w-100 w-2/5 min-w-80 h-5/6 pt-4 pb-4 pl-2 pr-2 shadow-floating">
          <div className="mt-4 flex justify-center">
            <h1 className="text-3xl font-bold mb-4">🎲 Game </h1>
          </div>
          {isConnected ? (
            <div className="flex flex-row">
              <button
                className="basic-button copy-button"
                data-clipboard-text={window.location.href}
              >
                🔗 방 링크 복사하기
              </button>
              <button className="basic-button copy-button" data-clipboard-text={user?.roomId || ''}>
                0️⃣ 방 코드 복사하기
              </button>
            </div>
          ) : (
            <></>
          )}
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
                <div className="flex justify-center">
                  <p className="text-2xl mb-4">
                    🙋 총 참가자 수:{' '}
                    {game?.teams.reduce((total, team) => total + team.users.length, 0) || 0}
                  </p>
                </div>
                <div className="text-center flex flex-row justify-around">
                  {game?.teams.map((team, index) => (
                    <div
                      key={index}
                      className={`mb-6 m-2 container w-1/${game?.teams.length} rounded-lg shadow-md ${
                        team.teamName === 'BLUE'
                          ? 'bg-blue-700'
                          : team.teamName === 'RED'
                            ? 'bg-red-700'
                            : 'bg-gray-800'
                      }`}
                    >
                      <div className="text-2xl font-semibold">{team.teamName}</div>
                      <div className="text-sm text-gray-500 mb-2">닉네임</div>
                      <div className="list-inside">
                        {team.users.map((u, userIndex) => (
                          <div
                            key={userIndex}
                            className={`text-white flex rounded-lg border-2 ${user.nickname === u.nickname ? 'border-orange-500' : 'border-white'}`}
                          >
                            <div className="absolute self-center ml-2 text-xs">
                              {game.roomChief === u.nickname ? '👑' : '👋'}
                            </div>
                            <div className="flex-1 text-center">{u.nickname}</div>
                          </div>
                        ))}
                        {/* 팀 이동 버튼 표시 */}
                        {!game?.teams.some(
                          (t) =>
                            t.users.some((u) => u.nickname === user.nickname) &&
                            t.teamName === team.teamName
                        ) &&
                          team.users.length < team.maxUserCount && (
                            <div
                              className="text-white flex rounded-lg border-2 border-dashed border-gray-500 cursor-pointer hover:border-orange-500 hover:bg-gray-800 transition duration-200"
                              onClick={() => handleTeamChange(team.teamName)}
                            >
                              <div className="absolute self-center ml-2 text-xs">🔄</div>
                              <div className="flex-1 text-center">팀 이동</div>
                            </div>
                          )}
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
