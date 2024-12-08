import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom } from '../../api/CreateRoom';
import { oneVsOneWebSocket } from '../../services/OneVsOneWebSocket';
import { CreateRoomProps } from '../../types/CreateRoom.type';
import { RoomClientProps } from '../../types/RoomClient.type';
import * as styled from './Home.style';

export default function Home() {
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
  const [roomId, setRoomId] = useState(null); // 방 ID

  useEffect(() => {
    if (!roomId) return;
    console.log('Room ID:', roomId);

    // 메시지 구독
    oneVsOneWebSocket.subscribe(`/topic/room/${roomId}`, (message) => {
      console.log('WebSocket Message:', message);
      // 메시지 처리 로직 추가 가능
      // JSON 데이터를 처리
      const roomData = JSON.parse(message.body);
      console.log('Parsed Room Data:', roomData);
    });

    const RoomClientRequestBody: RoomClientProps = {
      roomId: roomId,
      nickname: nickname,
    };

    oneVsOneWebSocket.sendMessage('/app/room/enter', RoomClientRequestBody);

    // 방 페이지로 이동
    navigate(`/game/${roomId}`);
  }, [roomId]);

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
        {
          teamName: 'Team 2',
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
    <styled.HomeWrapper>
      <styled.Title>게임 설정</styled.Title>

      {/* 닉네임 설정 */}
      <styled.InputWrapper>
        <label htmlFor="nickname">닉네임</label>
        <styled.Input
          id="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임을 입력하세요"
        />
      </styled.InputWrapper>

      {/* 게임 유형 선택 */}
      <styled.GameTypeWrapper>
        <h3>게임 유형</h3>
        {['ONE_TO_ONE', 'ONE_TO_MANY', 'TEAM_VS_TEAM', 'FREE_FOR_ALL'].map((type) => (
          <styled.RadioButton key={type}>
            <input
              type="radio"
              id={type}
              value={type}
              checked={gameType === type}
              onChange={() => handleGameTypeChange(type as any)}
            />
            <label htmlFor={type}>
              {type === 'ONE_TO_ONE'
                ? '1대1'
                : type === 'ONE_TO_MANY'
                  ? '일대다'
                  : type === 'TEAM_VS_TEAM'
                    ? '팀 대 팀'
                    : '개인전'}
            </label>
          </styled.RadioButton>
        ))}
      </styled.GameTypeWrapper>

      {/* 조건별 추가 설정 */}
      {gameType === 'TEAM_VS_TEAM' && (
        <styled.SettingWrapper>
          <label>팀 수</label>
          <styled.Input
            type="number"
            value={teamSettings.teamCount}
            onChange={(e) => handlePlayerCountChange('teamCount', Number(e.target.value))}
            min={2}
          />
          <label>팀당 플레이어 수</label>
          <styled.Input
            type="number"
            value={teamSettings.playerPerTeam}
            onChange={(e) => handlePlayerCountChange('playerPerTeam', Number(e.target.value))}
            min={1}
          />
        </styled.SettingWrapper>
      )}
      {gameType === 'ONE_TO_MANY' && (
        <styled.SettingWrapper>
          <label>총 플레이어 수</label>
          <styled.Input
            type="number"
            value={teamSettings.totalPlayers}
            onChange={(e) => handlePlayerCountChange('totalPlayers', Number(e.target.value))}
            min={2}
          />
        </styled.SettingWrapper>
      )}
      {gameType === 'FREE_FOR_ALL' && (
        <styled.SettingWrapper>
          <label>총 플레이어 수</label>
          <styled.Input
            type="number"
            value={teamSettings.totalPlayers}
            onChange={(e) => handlePlayerCountChange('totalPlayers', Number(e.target.value))}
            min={2}
          />
        </styled.SettingWrapper>
      )}

      {/* 게임 시간 선택 */}
      <styled.InputWrapper>
        <label>게임 시간</label>
        <select value={gameTime} onChange={(e) => setGameTime(Number(e.target.value))}>
          <option value={10}>10초</option>
          <option value={30}>30초</option>
          <option value={60}>60초</option>
        </select>
      </styled.InputWrapper>

      {/* 방 생성 버튼 */}
      <styled.CreateRoomButton onClick={handleCreateRoom}>방 생성</styled.CreateRoomButton>
    </styled.HomeWrapper>
  );
}
