import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Button, { ButtonType } from '../../components/button/Button';
import { oneVsOneWebSocket } from '../../services/OneVsOneWebSocket';
import { RoomClientProps } from '../../types/RoomClient.type';
import * as styled from './Game.style';

export default function Game() {
  const { roomId } = useParams<{ roomId: string }>(); // URL에서 roomId를 받아옵니다
  const nickName = 'player'; // 현재 로컬 주소를 nickname으로 사용

  useEffect(() => {
    if (!roomId) {
      console.error('Room ID is undefined');
      return;
    }

    const requestBody: RoomClientProps = {
      roomId: roomId,
      nickName: nickName,
    };

    // WebSocket 연결
    oneVsOneWebSocket.connect();

    // 연결 상태 확인 및 메시지 전송
    const checkConnection = setInterval(() => {
      if (oneVsOneWebSocket.getClient()?.connected) {
        oneVsOneWebSocket.sendMessage('/room/enter', requestBody);

        // 메시지 구독
        oneVsOneWebSocket.subscribe(`/topic/room/${roomId}`, (message) => {
          console.log('WebSocket Message:', message);
          // 메시지 처리 로직 추가 가능
          // JSON 데이터를 처리
          const roomData = JSON.parse(message.body);
          console.log('Parsed Room Data:', roomData);
        });

        clearInterval(checkConnection); // 연결 완료 후 대기 중단
      } else {
        console.log('Waiting for WebSocket connection...');
      }
    }, 500);

    // 컴포넌트 언마운트 시 WebSocket 연결 해제
    return () => {
      clearInterval(checkConnection);
      oneVsOneWebSocket.disconnect();
    };
  }, [roomId, nickName]);

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
