import { WebSocketManager } from './WebSocketManager';
import { IFrame } from '@stomp/stompjs';

class OneVsOneWebSocket extends WebSocketManager {
  onConnect(frame: IFrame): void {
    // 닉네임 보내기
  }

  onDisconnect(): void {
    // 브라우저 측 상태 삭제
  }

  onError(frame: IFrame): void {
    // 에러 메세지 띄우기
  }
}
