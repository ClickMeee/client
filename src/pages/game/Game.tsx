import { useParams } from 'react-router-dom';
import Button, { ButtonType } from '../../components/button/Button';
import { oneVsOneWebSocket } from '../../services/OneVsOneWebSocket';
import { RoomClientProps } from '../../types/RoomClient.type';
import * as styled from './Game.style';

export default function Game() {
  const { roomId } = useParams<{ roomId: string }>(); // URL에서 roomId를 받아옵니다
  const nickName = 'playerName'; // 예시: 플레이어 닉네임 (실제 앱에서는 로그인 정보 등을 통해 가져옴)

  const requestBody: RoomClientProps = {
    roomId: roomId || '',
    nickName: nickName,
  };

  // WebSocket 연결
  oneVsOneWebSocket.connect();

  // WebSocket 구독 및 방 입장
  if (roomId) {
    oneVsOneWebSocket.enterRoom(requestBody);
  } else {
    console.error('Room ID is undefined');
  }

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
