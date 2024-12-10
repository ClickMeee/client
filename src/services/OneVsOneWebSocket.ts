import { IFrame } from '@stomp/stompjs';
// import { RoomDataProps } from '../types/RoomData.type';
import { WebSocketManager } from './WebSocketManager';

class OneVsOneWebSocket extends WebSocketManager {
  private roomId: string = '';
  private nickname: string = '';
  private updateGameState: ((state: any) => void) | null = null;

  // 상태 업데이트 함수 설정
  setGameStateUpdater(updaterFunc: (state: any) => void): void {
    this.updateGameState = updaterFunc;
  }

  setRoomData(roomId: string, nickname: string): void {
    this.roomId = roomId;
    this.nickname = nickname;
  }

  onConnect(frame: IFrame): void {
    console.log('WebSocket connected:', frame);

    // 방 정보 구독
    this.subscribe(`/topic/room/${this.roomId}`, (message) => {
      this.processData(message);
    });

    // 방 입장 요청
    this.roomEnterRequest();
  }

  onDisconnect(): void {
    console.log('WebSocket disconnected');
  }

  onStompError(error: any): void {
    console.error('WebSocket error:', error);
  }

  // stomp 메세지 데이터 처리 함수
  processData(message) : void {
    switch(message.type){
      case 'ROOM':
        if (this.updateGameState) {
          console.log(`${message.type} 처리`);
          this.updateGameState(message.data);
        }
        break;
      default:
        console.log(`다른 type${message.type} ${message.data.message}`);
    }
  }

  // 방 입장 요청
  roomEnterRequest() {
    if (this.roomId && this.nickname) {
      const requestBody = {
        roomId: this.roomId,
        nickname: this.nickname,
      };

      this.sendMessage('/app/room/enter', requestBody);
    } else {
      console.error('Room ID or Nickname is not set');
    }
  }

  // 방장 게임 시작 요청
  startGameRequest() {
    if (this.roomId) {
      this.sendMessage(`/app/room/${this.roomId}/start`);
    } else {
      console.error('Room ID is not set');
    }
  }

  // 플레이어 준비 요청
  playerReadyRequest() {
    if (this.roomId) {
      this.sendMessage(`/app/start/${this.roomId}/${this.nickname}`);
    } else {
      console.error('Room ID is not set');
    }
  }
}

export const oneVsOneWebSocket = OneVsOneWebSocket.getInstance(OneVsOneWebSocket);
