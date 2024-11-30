import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Button, { ButtonType } from '../../components/button/Button';
import { oneVsOneWebSocket } from '../../services/OneVsOneWebSocket';
import { RoomClientProps } from '../../types/RoomClient.type';
import * as styled from './Game.style';

export default function Game() {
  const { roomId } = useParams<{ roomId: string }>(); // URL에서 roomId를 받아옵니다
  const nickName = window.location.hostname; // 현재 로컬 주소를 nickname으로 사용

  useEffect(() => {
    // WebSocket 연결
    oneVsOneWebSocket.connect();

    if (roomId) {
      const requestBody: RoomClientProps = { roomId, nickName };

      // 방 입장 요청 (연결 후 처리됨)
      oneVsOneWebSocket.enterRoom(requestBody);

      // WebSocket 메시지 구독
      oneVsOneWebSocket.subscribe(`/topic/room/${roomId}`, (message) => {
        console.log('WebSocket Message:', message);
        // 메시지 처리 로직 추가 가능
      });

      // 컴포넌트 언마운트 시 WebSocket 연결 해제
      return () => {
        oneVsOneWebSocket.disconnect();
      };
    } else {
      console.error('Room ID is undefined');
    }
  }, [roomId, nickName]); // roomId와 nickName에 따라 effect 실행

  type ButtonProps = {
    text: string;
    type: ButtonType;
    onClick: () => void;
  };

  const buttonProps: ButtonProps = {
    text: 'Click me',
    type: 'click',
    onClick: () => console.log('Button clicked'),
  };

  return (
    <styled.GameWrapper>
      <h1>Game</h1>

      <Button {...buttonProps} />
    </styled.GameWrapper>
  );
}
