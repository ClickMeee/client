import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { CheckNicknameDuplicate } from '../../api/CheckNickname';
import { enterRoom } from '../../api/EnterRoom';
import { RoomDataProps } from '../../types/RoomData.type';

export default function Game() {
  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();

  const [nickname, setNickname] = useState<string>(''); // 닉네임 상태
  const [isConnected, setIsConnected] = useState<boolean>(false); // WebSocket 연결 상태
  const [roomData, setRoomData] = useState<RoomDataProps | null>(null); // 방 정보 상태

  // WebSocket 연결 상태 확인(닉네임 입력으로 판단하도록 수정함)
  // WebSocket 연결 상태에 따라 roomData 설정
  useEffect(() => {
    const userNickname = location.state?.nickname ?? '';

    if (userNickname && roomId) {
      const roomChiefEnterRoom = async () => {
        try {
          console.log('Joining room with nickname:', userNickname);
          const enterRoomData = await enterRoom(roomId, userNickname, receiveMessage);
          setRoomData(enterRoomData);
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
  }, [location.state, roomId]);

  // WebSocket 메시지 수신
  const receiveMessage = (message: any) => {
    if (message.type === 'ROOM') {
      const roomData = message.data;
      setRoomData(roomData);
    }
  };

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
      const enterRoomData = await enterRoom(roomId, nickname, receiveMessage);
      setRoomData(enterRoomData);
      setIsConnected(true);
    } catch (error: any) {
      alert('방 입장에 실패했습니다.');
      console.error(error.message);
    }
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
              <p className="text-lg mb-4">참가팀 수: {roomData?.teams.length || 0}</p>
              {roomData?.teams.map((team, index) => (
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
                {roomData?.teams.map((team, index) => (
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
