import { IFrame } from '@stomp/stompjs';
import { GameStateDataProps } from '../types/GameStateData.type';
import { RoomDataProps } from '../types/RoomData.type';
import { WebSocketManager } from './WebSocketManager';

class OneVsOneWebSocket extends WebSocketManager {
  private roomId: string = '';
  private nickname: string = '';
  private roomDataCallback: ((roomData: RoomDataProps) => void) | null = null;
  private gameStateDataCallback: ((gameStateData: GameStateDataProps) => void) | null = null;

  setRoomData(roomId: string, nickname: string): void {
    this.roomId = roomId;
    this.nickname = nickname;
  }

  onConnect(frame: IFrame): void {
    console.log('WebSocket connected:', frame);

    // 방 정보 구독
    this.subscribe(`/topic/room/${this.roomId}`, (message) => {
      console.log('Received WebSocket Message:', message);
      if (message.type === 'ROOM') {
        const roomData = message.data;
        console.log('Room Data:', roomData);
        // roomData를 callback을 통해 바로 전달
        if (this.roomDataCallback) {
          this.roomDataCallback(roomData);
        }
      } else if (message.type === 'GAME_READY') {
        const gameStateData = message.data;
        console.log('Game State:', gameStateData);
        // gameStateData를 callback을 통해 바로 전달
        if (this.gameStateDataCallback) {
          this.gameStateDataCallback(gameStateData);
        }
      } else {
        console.warn('Unexpected message type:', message.type);
      }
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

  // 콜백 설정
  setRoomDataCallback(callback: (roomData: RoomDataProps) => void): void {
    this.roomDataCallback = callback;
  }

  setGameStateDataCallback(callback: (gameStateData: GameStateDataProps) => void): void {
    this.gameStateDataCallback = callback;
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
      this.sendMessage(`/app/start/${this.roomId}`);
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
