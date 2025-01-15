import ClipboardJS from 'clipboard';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { CheckNicknameDuplicate } from '../../api/CheckEnterableRoom.ts';
import MessageModal from '../../components/modal/MessageModal.tsx';
import useMessages from '../../hooks/useMessage.ts';
import { gameReadyState } from '../../recoil/atoms/gameReadyState';
import { gameState } from '../../recoil/atoms/gameState.ts';
import { userState } from '../../recoil/atoms/userState.ts';
import WebSocketManager from '../../services/WebSocketManager.ts';
import { GameStateDataProps } from '../../types/GameStateData.type.ts';
import { RoomClientProps } from '../../types/RoomClient.type.ts';
import { RoomDataProps, Team } from '../../types/RoomData.type.ts';

export default function GameReady() {
  const webSocketManager = WebSocketManager.getInstance();
  const { roomId: urlRoomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useRecoilState<RoomClientProps>(userState);
  const [game, setGame] = useRecoilState<RoomDataProps | null>(gameState);
  const setGameReady = useSetRecoilState<GameStateDataProps>(gameReadyState);

  const [nicknameInput, setNicknameInput] = useState<string>(''); // 닉네임 입력 상태
  const [isConnected, setIsConnected] = useState<boolean>(false); // WebSocket 연결 상태
  const [isGameButtonAble, setIsGameButtonAble] = useState<boolean>(false); // 게임 시작 버튼 상태
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
    if (!user.nickname || !user.roomId) {
      // console.log('nickname이나 roomId가 없습니다.');
      return;
    }

    const playerRoomEnter = async () => {
      try {
        webSocketManager.init({
          roomId: user.roomId!,
          nickname: user.nickname!,
          updateGameState: setGame,
          updateGameReadyState: setGameReady,
          navigate: navigate,
          showMessage: showMessage,
          showRoomChiefLeaveMessage: setRoomChiefModal,
        });
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
      const isReadyAllUser =
        game.teams.reduce((total, team) => total + team.users.length, 0) >= 2 && // 최소 2명 이상
        game.teams.every((team) =>
          team.users.every((user) => (user.nickname === game.roomChief ? true : user.isReady))
        );

      if (isReadyAllUser) {
        setIsGameButtonAble(true);
      } else {
        setIsGameButtonAble(false);
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
      if (!enterable) {
        showMessage('이미 사용 중인 닉네임입니다.');
        return;
      }

      setUser((prev) => ({ ...prev, nickname: nicknameInput }));
      setIsConnected(true);
    } catch {
      showMessage('방 입장에 실패했습니다.');
      // console.error(error.message);
    }
  };

  const handleTeamChange = (targetTeamName: string) => {
    // console.log(`팀 이동: ${targetTeamName}`);

    const currentTeam = getCurrentTeam();
    const currentTeamName = getCurrentTeamName(currentTeam);

    webSocketManager.moveTeamRequest(targetTeamName, currentTeamName || '');
  };

  const getCurrentTeam = (): Team | undefined => {
    return game?.teams.find((team) => team.users.some((u) => u.nickname === user.nickname));
  };

  const getCurrentTeamName = (currentTeam: Team | undefined): string | null => {
    return currentTeam?.teamName || null;
  };

  const handleGameStart = () => {
    if (!isGameButtonAble) {
      showMessage('플레이어가 모두 준비되지 않았습니다.');
      return;
    } else {
      // console.log('게임 시작 요청을 보냅니다.');
      webSocketManager.startGameRequest();
    }
  };

  const handleGameReady = () => {
    webSocketManager.toggleUserReadyState();
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
          <div className="flex flex-col pt-6 pb-6 text-white">
            {!isConnected ? (
              <div className="bg-gray-900 pb-6 pl-2 pr-2 pt-3 ml-10 mr-10 rounded-lg">
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
                    {' / '}
                    {game?.teams.reduce((total, team) => total + team.maxUserCount, 0)}
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
                      <div className="text-sm text-gray-300 mb-2">
                        {' '}
                        {team.users.length} / {team.maxUserCount}
                      </div>
                      <div className="list-inside">
                        {/* 유저 */}
                        {team.users.map((u, userIndex) => (
                          <div
                            key={userIndex}
                            className={`text-white flex p-2 m-1 rounded-lg border-2 ${user.nickname === u.nickname ? 'border-orange-400' : 'border-white'}`}
                          >
                            <div className="flex-1 text-center">
                              {u.isReady ? '🚩' : ''} {/* 준비 상태일 때 이모지 표시 */}
                              {game.roomChief === u.nickname ? '👑' : ''} {u.nickname}
                            </div>
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
                              className="text-white flex rounded-lg p-2 m-1 border-2 border-dashed border-gray-500 cursor-pointer hover:border-orange-500 hover:bg-gray-800 transition duration-200"
                              onClick={() => handleTeamChange(team.teamName)}
                            >
                              <div className="flex-1 text-center"> 🔄 팀 이동</div>
                            </div>
                          )}
                        {/* 빈 공간 표시 */}
                        {team.maxUserCount > team.users.length ? (
                          <>
                            {Array.from(
                              {
                                length:
                                  team.maxUserCount -
                                    team.users.length -
                                    (team.teamName !== (getCurrentTeamName(getCurrentTeam()) || '')
                                      ? 1
                                      : 0) >
                                  5
                                    ? 5
                                    : 0,
                              },
                              (_, index) => (
                                <div>
                                  <div
                                    key={index}
                                    className={`text-white flex p-2 m-1 rounded-lg border-2 border-white`}
                                  >
                                    <div className="flex-1 text-center">Empty</div>
                                  </div>
                                </div>
                              )
                            )}
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex justify-center">
                  {user.nickname === game?.roomChief ? (
                    <button
                      onClick={handleGameStart}
                      className={`w-3/4 mb-2.5 py-2 ${isGameButtonAble ? 'hover:border-opacity-100 hover:-translate-y-1 hover:-translate-x-0.5 hover:shadow-floating hover:transition duration-300' : 'opacity-50'} bg-green-600 border-2 border-opacity-0 border-white  text-white rounded-md active:bg-green-500`}
                    >
                      게임 시작
                    </button>
                  ) : (
                    <button
                      onClick={handleGameReady}
                      className={`w-3/4 mb-2.5 py-2  ${
                        game?.teams.some((team) =>
                          team.users.some(
                            (teamUser) => teamUser.nickname === user.nickname && !teamUser.isReady
                          )
                        )
                          ? 'hover:border-opacity-100 hover:-translate-y-1 hover:-translate-x-0.5 hover:shadow-floating hover:transition duration-300'
                          : 'opacity-50'
                      } bg-green-600 border-2 border-opacity-0 border-white  text-white rounded-md active:bg-green-500`}
                    >
                      {game?.teams.some((team) =>
                        team.users.some(
                          (teamUser) => teamUser.nickname === user.nickname && teamUser.isReady
                        )
                      )
                        ? '게임 준비 해제'
                        : '게임 준비하기'}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
