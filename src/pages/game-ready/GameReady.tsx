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

export default function GameReady() {
  const { roomId: urlRoomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useRecoilState<UserState>(userState);
  const [game, setGame] = useRecoilState<GameState | null>(gameState);
  const [gameReady, setGameReady] = useRecoilState<GameReadyState>(gameReadyState);

  const [nicknameInput, setNicknameInput] = useState<string>(''); // 닉네임 입력 상태
  const [isConnected, setIsConnected] = useState<boolean>(false); // WebSocket 연결 상태
  // TODO: gameReady 에서 startFlag 사용하기
  const [isGameButtonVisible, setIsGameButtonVisible] = useState<boolean>(false); // 게임 시작 버튼 상태
  const [countdown, setCountdown] = useState<number | null>(null); // 카운트다운 상태

  const { messages, showMessage } = useMessages();

  // recoil 유저 상태의 roomId, nickname이 변경되면 실행
  useEffect(() => {
    setUser((prev) => ({
      ...prev,
      roomId: urlRoomId, // urlRoomId 값을 user 상태의 roomId에 갱신
    }));

    // nickname이 null이면 동작하지 않음
    if (!user.nickname || !user.roomId) {
      console.log('nickname이나 roomId가 없습니다.');
      return;
    }

    console.log('nickname:', user.nickname);

    const playerRoomEnter = async () => {
      try {
        // WebSocket에 roomId와 nickname 설정
        oneVsOneWebSocket.setRoomData(user.roomId!, user.nickname!);

        // 연결 시도
        await oneVsOneWebSocket.connect();

        // 연결 후, 업데이트에 사용될 set 함수 넘겨주기
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

  // 게임 시작 버튼 표시 로직
  useEffect(() => {
    if (game) {
      const totalUsers = game.teams.reduce((total, team) => total + team.users.length, 0);
      const totalMaxUserCount = game.teams.reduce((total, team) => total + team.maxUserCount, 0);

      console.log('방장 닉네임:' + game.roomChief);

      if (totalUsers === totalMaxUserCount && user.nickname === game.roomChief) {
        // 요청을 보내는 코드 (예: 게임 시작 요청)
        console.log('참가자 수와 팀 최대 사용자 수가 일치합니다.');
        setIsGameButtonVisible(true);
      } else {
        setIsGameButtonVisible(false);
      }
    }
  }, [game]);

  // 닉네임 입력
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
      // 닉네임 중복 검사
      const isDuplicateNickname = await CheckNicknameDuplicate(user.roomId, nicknameInput);
      if (isDuplicateNickname) {
        alert('이미 사용 중인 닉네임입니다.');
        return;
      }

      // Recoil 유저 상태 업데이트
      setUser((prev) => ({ ...prev, nickname: nicknameInput })); // Recoil 상태 업데이트

      setIsConnected(true);
    } catch (error: any) {
      alert('방 입장에 실패했습니다.');
      console.error(error.message);
    }
  };

  // 게임 시작 버튼 클릭 이벤트
  const handleGameStart = () => {
    console.log('게임 시작 요청을 보냅니다.');

    // setCountdown(3);

    // 방장 게임 시작 요청
    oneVsOneWebSocket.startGameRequest();
  };

  // 카운트다운 로직
  // useEffect(() => {
  //   if (countdown === null) return;

  //   if (countdown > 0) {
  //     const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
  //     return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
  //   }

  //   if (countdown === 0) {
  //     console.log('카운트다운 완료! 게임을 시작합니다.');
  //     setCountdown(null); // 카운트다운 종료 후 UI 숨기기

  //     // 게임 시작 로직
  //     oneVsOneWebSocket.playerReadyRequest();
  //   }
  // }, [countdown]);

  return (
    <>
      <Modal messages={messages} />
      <div className="flex z-10 flex-col justify-center items-center mt-10 md-10 bg-slate-50 bg-opacity-0 text-white p-6">
        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <h1 className="text-9xl font-bold text-red-500 animate-pulse">{countdown}</h1>
          </div>
        )}
        <div className="bg-gray-700 rounded-xl max-w-100 w-1/5 min-w-80 h-5/6 p-4 shadow-floating">
          <div className="mt-4 flex justify-center">
            <h1 className="text-3xl font-bold mb-4">🎲 Game </h1>
          </div>
          <div className="flex flex-col items-center justify-center pt-24 pb-24 pl-6 pr-6 text-white">
            {!isConnected ? (
              <div className="bg-gray-900 pb-6 pl-6 pr-6 pt-3 rounded-lg shadow-floating">
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
              <div className="text-center">
                <p className="text-lg mb-4">참가팀 수: {game?.teams.length || 0}</p>
                {game?.teams.map((team, index) => (
                  <div key={index} className="mb-6 bg-gray-800 p-4 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-2">{team.teamName}</h2>
                    <p className="text-lg">참가자 수: {team.users.length}</p>
                    <ul className="list-disc list-inside">
                      {team.users.map((user, userIndex) => (
                        <li key={userIndex} className="text-gray-300">
                          {user.nickname}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                {isGameButtonVisible && (
                  <div className="mt-6">
                    <button
                      onClick={handleGameStart}
                      className="w-full py-2 bg-green-600 text-white rounded-md shadow-floating hover:bg-green-500 transition duration-300"
                    >
                      게임 시작
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>

  );
}
