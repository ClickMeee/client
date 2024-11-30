import { IFrame } from '@stomp/stompjs';
import { RoomClientProps } from '../types/RoomClient.type';
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

  onError(frame: IFrame): void {
    // 에러 메세지 띄우기
    console.error('WebSocket error:', frame);
  }

  // // 구독
  // subscribe(destination: string, callback: (message: any) => void): void {
  //   super.subscribe(destination, callback);
  // }

  // 방에 입장
  enterRoom(requestBody: RoomClientProps): void {
    // 방에 입장하는 로직을 추가합니다.
    console.log(`User ${requestBody.nickName} is entering room ${requestBody.roomId}`);
    this.subscribe(`/topic/room/${requestBody.roomId}`, (message) => {
      console.log('Message received for room:', requestBody.roomId, message);
    });
  }
}

export const oneVsOneWebSocket = OneVsOneWebSocket.getInstance(OneVsOneWebSocket);
