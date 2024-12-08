import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckNicknameDuplicate } from '../../api/CheckNickname';
import Button from '../../components/button/Button';
import { oneVsOneWebSocket } from '../../services/OneVsOneWebSocket';
import { CreateRoomProps } from '../../types/CreateRoom.type';
import { RoomClientProps } from '../../types/RoomClient.type';
import * as styled from './Game.style';

export default function Game() {
  const { roomId } = useParams<{ roomId: string }>();
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
      await enterRoom();
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

    try {
      // WebSocket 연결
      await oneVsOneWebSocket.connect();

      // 메시지 구독
      oneVsOneWebSocket.subscribe(`/topic/room/${roomId}`, (message) => {
        const parsedData = JSON.parse(message.body);
        setRoomData(parsedData);
        console.log('Parsed Room Data:', parsedData);
      });

      // 방 입장 메시지 전송
      oneVsOneWebSocket.sendMessage('/app/room/enter', requestBody);

      // 연결 상태 업데이트
      setIsConnected(true);
    } catch (error) {
      console.error('Error entering room:', error);
      alert('방 입장 중 문제가 발생했습니다.');
    }
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
