import { IFrame } from '@stomp/stompjs';
import { WebSocketManager } from './WebSocketManager';

class OneVsOneWebSocket extends WebSocketManager {
  onConnect(frame: IFrame): void {
    // 닉네임 보내기
    console.log('WebSocket connected:', frame);
  }

  onDisconnect(): void {
    // 브라우저 측 상태 삭제
    console.log('WebSocket disconnected');
  }

  onStompError(frame: IFrame): void {
    // 에러 메세지 띄우기
    console.error('WebSocket error:', frame);
  }

  // 구독
  subscribe(destination: string, callback: (message: any) => void): void {
    super.subscribe(destination, callback);
  }
}

export const oneVsOneWebSocket = OneVsOneWebSocket.getInstance(OneVsOneWebSocket);
