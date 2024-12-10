import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { CheckNicknameDuplicate } from '../../api/CheckNickname';
import { oneVsOneWebSocket } from '../../services/OneVsOneWebSocket';
import { useRecoilState } from 'recoil';
import { GameState, oneVsOneGameState } from "../../recoil/atoms/gameState.ts";

export default function Game() {
  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();

  const [nickname, setNickname] = useState<string>(''); // 닉네임 상태

  const [isConnected, setIsConnected] = useState<boolean>(false); // WebSocket 연결 상태
  const [isGameButtonVisible, setIsGameButtonVisible] = useState<boolean>(false); // 게임 시작 버튼 상태

  // recoil 게임 방 상태
  const [gameState, setGameState] = useRecoilState<GameState | null>(oneVsOneGameState);

  // WebSocket 연결 상태 확인(닉네임 입력으로 판단하도록 수정함)
  // WebSocket 연결 상태에 따라 gameState 설정
  useEffect(() => {
    const userNickname = location.state?.nickname ?? '';
    setNickname(userNickname);

    if (userNickname && roomId) {
      const roomChiefEnterRoom = async () => {
        try {
          oneVsOneWebSocket.setRoomData(roomId, userNickname);

          // 연결
          await oneVsOneWebSocket.connect();

          // 연결 후, 업데이트에 사용될 set 함수 넘겨주기
          oneVsOneWebSocket.setGameStateUpdater(setGameState);

          setIsConnected(true);
        } catch (err) {
          console.error('Failed to enter room:', err);
          setIsConnected(false);
        }
      };
      roomChiefEnterRoom();
    } else {
      setIsConnected(false); // 닉네임이나 roomId가 없으면 연결되지 않음
    }
  }, [location.state]);

  // 닉네임 입력 + 방 입장
  const handleNicknameSubmit = async () => {
    if (!roomId) {
      console.error('Room ID is undefined');
      return;
    }

    if (!nickname.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    try {
      // 닉네임 중복 검사
      const isDuplicateNickname = await CheckNicknameDuplicate(roomId, nickname);
      if (isDuplicateNickname) {
        alert('이미 사용 중인 닉네임입니다.');
        return;
      }

      // 방 입장
      oneVsOneWebSocket.setRoomData(roomId, nickname);
      await oneVsOneWebSocket.connect();

      oneVsOneWebSocket.setGameStateUpdater(setGameState);

      setIsConnected(true);
    } catch (error: any) {
      alert('방 입장에 실패했습니다.');
      console.error(error.message);
    }
  };

  // 총 user 수 계산 함수
  const countTotalUsers = (): number => {
    if (!gameState) return 0;
    return gameState.teams.reduce((total, team) => total + team.users.length, 0);
  };

  // 총 maxUserCount 계산 함수
  const countTotalMaxUserCount = (): number => {
    if (!gameState) return 0;
    return gameState.teams.reduce((total, team) => total + team.maxUserCount, 0);
  };

  // 참가자 수와 maxUserCount 비교 후 특정 요청 보내기
  useEffect(() => {
    if (gameState) {
      const totalUsers = countTotalUsers();
      const totalMaxUserCount = countTotalMaxUserCount();

      console.log('방장 닉네임:' + gameState.roomChief);

      if (totalUsers === totalMaxUserCount && nickname === gameState.roomChief) {
        // 요청을 보내는 코드 (예: 게임 시작 요청)
        console.log('참가자 수와 팀 최대 사용자 수가 일치합니다. 특정 요청을 보냅니다.');
        setIsGameButtonVisible(true);
      } else {
        setIsGameButtonVisible(false);
      }
    }
  }, [gameState]);

  const handleGameStart = () => {
    console.log('게임 시작 요청을 보냅니다.');

    // 방장 게임 시작 요청
    oneVsOneWebSocket.startGameRequest();
  };

  return (
    <div className="flex z-10 flex-col justify-center items-center mt-10 md-10 bg-slate-50 bg-opacity-0 text-white p-6">
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
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
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
              <p className="text-lg mb-4">참가팀 수: {gameState?.teams.length || 0}</p>
              {gameState?.teams.map((team, index) => (
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
              <div className="grid grid-cols-1 gap-4">
                {gameState?.teams.map((team, index) => (
                  <button
                    key={index}
                    className="w-full py-2 bg-blue-600 text-white rounded-xl p-2 shadow-floating hover:bg-gray-600 transition duration-300"
                    onClick={() => console.log(`${team.teamName} 버튼 클릭`)}
                  >
                    Button {index + 1} - {team.teamName} (클릭 수:{' '}
                    {team.users.reduce((total, user) => total + user.clickCount, 0)})
                  </button>
                ))}
              </div>
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
  );
}
