import { IFrame } from '@stomp/stompjs';
import { RoomClientProps } from '../types/RoomClient.type';
import { WebSocketManager } from './WebSocketManager';

class OneVsOneWebSocket extends WebSocketManager {
  onConnect(frame: IFrame): void {
    // 닉네임 보내기
    console.log('WebSocket connected:', frame);

    // stompClient.send(import.meta.env.VITE_API_URL + '/room/enter', {}, JSON.stringify({ roomId: roomId, nickName: nickName }));

    // 대기 중인 방 입장 요청 처리
    if (this.roomRequest) {
      this.enterRoom(this.roomRequest);
      this.roomRequest = null;
    }
  }

  onDisconnect(): void {
    // 브라우저 측 상태 삭제
    console.log('WebSocket disconnected');
  }

  onError(frame: IFrame): void {
    // 에러 메세지 띄우기
    console.error('WebSocket error:', frame);
  }

  // 구독
  subscribe(destination: string, callback: (message: any) => void): void {
    super.subscribe(destination, callback);
  }

  private roomRequest: RoomClientProps | null = null;

  enterRoom(requestBody: RoomClientProps): void {
    if (this.getClient()?.connected) {
      this.getClient()?.publish({
        destination: import.meta.env.VITE_API_URL + '/room/enter',
        body: JSON.stringify(requestBody),
      });
      console.log(`Entered room: ${requestBody.roomId} as ${requestBody.nickName}`);
    } else {
      console.error('WebSocket is not connected. Saving request for later.');
      this.roomRequest = requestBody; // 연결 후 처리
    }
  }
}

export const oneVsOneWebSocket = OneVsOneWebSocket.getInstance(OneVsOneWebSocket);
