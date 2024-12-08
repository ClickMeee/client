import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckNicknameDuplicate } from '../../api/CheckNickname';
import Button from '../../components/button/Button';
import { oneVsOneWebSocket } from '../../services/OneVsOneWebSocket';
import { CreateRoomProps } from '../../types/CreateRoom.type';
import { RoomClientProps } from '../../types/RoomClient.type';
import * as styled from './Game.style';

export default function Game() {
  const { roomId } = useParams<{ roomId: string }>(); // URL에서 roomId를 받아옵니다
  const [nickname, setNickname] = useState<string>(''); // 닉네임 상태
  const [isConnected, setIsConnected] = useState<boolean>(false); // WebSocket 연결 상태
  const [isDuplicate, setIsDuplicate] = useState<boolean>(false); // 닉네임 중복 상태
  const [loading, setLoading] = useState<boolean>(false); // 로딩 상태
  const [roomData, setRoomData] = useState<CreateRoomProps | null>(null); // 방 정보 상태

  useEffect(() => {
    const client = oneVsOneWebSocket.getClient();

    if (client?.connected) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [roomId]);

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
      setLoading(true);

      // 닉네임 중복 검사
      const isDuplicateNickname = await CheckNicknameDuplicate(roomId, nickname);
      if (isDuplicateNickname) {
        setIsDuplicate(true);
        setLoading(false);
        return;
      }
      setIsDuplicate(false);

      // 방 입장
      enterRoom();
    } catch (error) {
      console.error(error.message);
      alert('닉네임 중복 검사에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 방 입장 함수
  const enterRoom = async () => {
    if (!roomId) {
      console.error('Room ID is undefined');
      return;
    }

    const requestBody: RoomClientProps = {
      roomId: roomId,
      nickname: nickname,
    };

    // WebSocket 연결
    oneVsOneWebSocket.connect();

    // 연결 상태 확인 및 메시지 전송
    const checkConnection = setInterval(() => {
      if (oneVsOneWebSocket.getClient()?.connected) {
        // 메시지 구독
        oneVsOneWebSocket.subscribe(`/topic/room/${roomId}`, (message) => {
          console.log('WebSocket Message:', message);
          // 메시지 처리 로직 추가 가능
          // JSON 데이터를 처리
          setRoomData(JSON.parse(message.body));
          console.log('Parsed Room Data:', roomData);
        });

        oneVsOneWebSocket.sendMessage('/app/room/enter', requestBody);

        clearInterval(checkConnection); // 연결 완료 후 대기 중단
      } else {
        console.log('Waiting for WebSocket connection...');
      }
    }, 500);
  };

  return (
    <styled.GameWrapper>
      {!isConnected ? (
        <styled.NicknameForm>
          <label htmlFor="nickname">닉네임 입력:</label>
          <input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            disabled={loading} // 로딩 중 입력 비활성화
          />
          <button onClick={handleNicknameSubmit} disabled={loading}>
            {loading ? '확인 중...' : '입장'}
          </button>
          {isDuplicate && <p style={{ color: 'red' }}>중복된 닉네임입니다.</p>}
        </styled.NicknameForm>
      ) : (
        <>
          <h1>Game</h1>
          <p>참가자 수: {roomData?.teams.length || 0}</p>
          <styled.ButtonContainer>
            {roomData?.teams.map((team, index) => (
              <Button
                key={index}
                text={`Button ${index + 1} - ${team.teamName}`}
                type="click"
                onClick={() => console.log(`${team.teamName} 버튼 클릭`)}
              />
            ))}
          </styled.ButtonContainer>
        </>
      )}
    </styled.GameWrapper>
  );
}
