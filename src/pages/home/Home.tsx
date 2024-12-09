import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom } from '../../api/CreateRoom';
import { oneVsOneWebSocket } from '../../services/OneVsOneWebSocket';
import { CreateRoomProps } from '../../types/CreateRoom.type';
import { RoomClientProps } from '../../types/RoomClient.type';
import HamsterBackground from '../../style/background/HamsterBackground';

const Home = () => {
  const navigate = useNavigate();

  // 상태: 게임 설정 및 닉네임
  const [gameType, setGameType] = useState<
    'ONE_TO_ONE' | 'ONE_TO_MANY' | 'TEAM_VS_TEAM' | 'FREE_FOR_ALL'
  >('ONE_TO_ONE');
  const [gameTime, setGameTime] = useState<number>(10); // 게임 시간
  const [teamSettings, setTeamSettings] = useState({
    teams: [
      { teamName: 'Team 1', maxUserCount: 1, clickCountScale: 1.0 },
      { teamName: 'Team 2', maxUserCount: 1, clickCountScale: 1.0 },
    ],
    totalPlayers: 2,
    teamCount: 2, // 팀 대 팀 설정 시 팀 수
    playerPerTeam: 1, // 팀당 플레이어 수
  });

  const [nickname, setNickname] = useState<string>('');
  const [roomId, setRoomId] = useState<number | null>(null); // 방 ID

  useEffect(() => {
    if (!roomId) return;
    console.log('Room ID:', roomId);

    // 메시지 구독
    oneVsOneWebSocket.subscribe(`/topic/room/${roomId}`, (message: any) => {
      console.log('WebSocket Message:', message);
      // 메시지 처리 로직 추가 가능
      // JSON 데이터를 처리
      try {
        const roomData = JSON.parse(message.body);
        console.log('Parsed Room Data:', roomData);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    const RoomClientRequestBody: RoomClientProps = {
      roomId: roomId,
      nickname: nickname,
    };

    oneVsOneWebSocket.sendMessage('/app/room/enter', RoomClientRequestBody);

    // 방 페이지로 이동
    navigate(`/game/${roomId}`);
  }, [roomId, nickname, navigate]);

  // 방 생성 함수
  const handleCreateRoom = async () => {
    if (!nickname.trim()) {
      alert('닉네임을 설정해주세요.');
      return; // 닉네임이 없으면 방 생성 요청 중단
    }

    const createRoomRequestBody: CreateRoomProps = {
      teams: [
        {
          teamName: 'Team 1',
          maxUserCount: 1,
          clickCountScale: 1.0,
        },
      ],
      gameTime,
      gameType,
      roomChief: {
        nickname,
      },
    };

    try {
      // WebSocket 연결
      await oneVsOneWebSocket.connect();

      const createdRoomId = await createRoom(createRoomRequestBody);
      console.log('Room created with ID:', createdRoomId);
      setRoomId(createdRoomId);
    } catch (error: any) {
      console.error('Error creating room:', error.message);
      alert('방 생성에 실패했습니다.');
    }
  };

  // 게임 유형 변경
  const handleGameTypeChange = (
    type: 'ONE_TO_ONE' | 'ONE_TO_MANY' | 'TEAM_VS_TEAM' | 'FREE_FOR_ALL'
  ) => {
    setGameType(type);

    // 유형에 따라 팀 설정 변경
    if (type === 'TEAM_VS_TEAM') {
      setTeamSettings({
        ...teamSettings,
        teamCount: 2,
        playerPerTeam: 5,
        totalPlayers: 10,
      });
    } else if (type === 'ONE_TO_MANY') {
      setTeamSettings({
        ...teamSettings,
        totalPlayers: 5,
      });
    } else if (type === 'FREE_FOR_ALL') {
      setTeamSettings({
        ...teamSettings,
        totalPlayers: 8,
      });
    } else {
      // ONE_TO_ONE
      setTeamSettings({
        ...teamSettings,
        totalPlayers: 2,
      });
    }
  };

  // 팀 수, 플레이어 수 변경 핸들러
  const handlePlayerCountChange = (
    key: 'teamCount' | 'playerPerTeam' | 'totalPlayers',
    value: number
  ) => {
    setTeamSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
      <>
      <div className="flex z-10 flex-col justify-center items-center mt-10 md-10 bg-slate-50 bg-opacity-0 text-white p-6">
        <div className="bg-gray-700 rounded-xl max-w-100 w-2/5 min-w-80 h-5/6 p-10 shadow-floating">
        <div className='flex justify-center'>
          <span className="text-2xl text-white font-bold mb-6">⚙️ 게임 설정</span>
        </div>
        {/* 닉네임 설정 */}
        <div className="mb-4">
          <label htmlFor="nickname" className="block text-lg font-semibold mb-2">닉네임</label>
          <input
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력하세요"
            className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 게임 유형 선택 */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">게임 유형</h3>
          {['ONE_TO_ONE', 'ONE_TO_MANY', 'TEAM_VS_TEAM', 'FREE_FOR_ALL'].map((type) => (
            <div key={type} className="flex items-center mb-3">
              <input
                type="radio"
                id={type}
                value={type}
                checked={gameType === type}
                onChange={() => handleGameTypeChange(type as any)}
                className="mr-2"
              />
              <label htmlFor={type} className="text-lg">
                {type === 'ONE_TO_ONE'
                  ? '1대1'
                  : type === 'ONE_TO_MANY'
                    ? '일대다'
                    : type === 'TEAM_VS_TEAM'
                      ? '팀 대 팀'
                      : '개인전'}
              </label>
            </div>
          ))}
        </div>

        {/* 조건별 추가 설정 */}
        {gameType === 'TEAM_VS_TEAM' && (
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">팀 수</label>
            <input
              type="number"
              value={teamSettings.teamCount}
              onChange={(e) => handlePlayerCountChange('teamCount', Number(e.target.value))}
              min={2}
              className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <label className="block text-lg font-semibold mb-2">팀당 플레이어 수</label>
            <input
              type="number"
              value={teamSettings.playerPerTeam}
              onChange={(e) => handlePlayerCountChange('playerPerTeam', Number(e.target.value))}
              min={1}
              className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {(gameType === 'ONE_TO_MANY' || gameType === 'FREE_FOR_ALL') && (
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">총 플레이어 수</label>
            <input
              type="number"
              value={teamSettings.totalPlayers}
              onChange={(e) => handlePlayerCountChange('totalPlayers', Number(e.target.value))}
              min={2}
              className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* 게임 시간 선택 */}
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">게임 시간</label>
          <select
            value={gameTime}
            onChange={(e) => setGameTime(Number(e.target.value))}
            className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={10}>10초</option>
            <option value={30}>30초</option>
            <option value={60}>60초</option>
          </select>
        </div>

        {/* 방 생성 버튼 */}
        <button
          onClick={handleCreateRoom}
          className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition duration-300"
        >
          방 생성
        </button>
      </div>
    </div>
    </>
  );
};

export default Home;
