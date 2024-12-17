import { IFrame } from '@stomp/stompjs';
import { WebSocketManager } from './WebSocketManager';
import { NavigateFunction } from 'react-router-dom';

class OneVsOneWebSocket extends WebSocketManager {
  private roomId: string = '';
  private nickname: string = '';
  private updateGameState: ((state: any) => void) | null = null;
  private updateGameReadyState: ((state: any) => void) | null = null;
  private navigate: NavigateFunction | null = null;
  private showMessage: ((state: any) => void) | null = null;
  private showRoomChiefLeaveMessage: ((state: any) => void) | null = null;

  setNavigate(navigateFunc: NavigateFunction): void {
    this.navigate = navigateFunc;
  }

  setShowMessage(showMessage: (state: any) => void): void {
    this.showMessage = showMessage;
  }

  setGameStateUpdater(
    gameUpdater: (state: any) => void,
    gameReadyUpdater: (state: any) => void
  ): void {
    this.updateGameState = gameUpdater;
    this.updateGameReadyState = gameReadyUpdater;
  }

  setRoomData(roomId: string, nickname: string): void {
    this.roomId = roomId;
    this.nickname = nickname;
  }

  setShowRoomChiefLeaveMessage(showRoomChiefLeaveMessage: (state: any) => void): void{
    this.showRoomChiefLeaveMessage = showRoomChiefLeaveMessage;
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
  processData(message: any): void {
    switch (message.type) {
      case 'ROOM':
        if (this.updateGameState) {
          console.log(`${message.type} 처리`);
          this.updateGameState(message.data);
        }
        break;
      case 'GAME_READY':
        if (this.updateGameReadyState) {
          console.log(`${message.type} 처리`);
          this.updateGameReadyState(message.data);

          // 플레이어 준비 요청
          oneVsOneWebSocket.playerReadyRequest();
        }
        break;
      case 'GAME_START':
        if (this.updateGameReadyState) {
          console.log(`${message.type} 처리`);
          this.updateGameReadyState(message.data);

          // game 사이트로 이동
          if (this.navigate) {
            this.navigate(`/game/${this.roomId}`);
          }
        }
        break;
      case 'GAME_PROGRESS':
        if (this.updateGameState) {
          console.log(`${message.type} 처리`);
          this.updateGameState(message.data);
        }
        break;

      case 'ROOM_LEAVE':
        if (this.updateGameState) {
          console.log(`${message.type} 처리`);
          this.updateGameState(message.data.data);
        }
        if (this.showMessage) {
          this.showMessage(`${message.data.target}님이 나갔습니다.`);
        }
        break;

      case 'GAME_END':
        if (this.updateGameState) {
          console.log(`${message.type} 처리`);
          this.updateGameState(message.data);
        }
        break;

      case 'ROOM_CHIEF_LEAVE':
        if (this.showRoomChiefLeaveMessage) {
          this.showRoomChiefLeaveMessage(true);
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

  // 클릭 이벤트 전송
  sendClickEvent() {
    if (this.roomId) {
      this.sendMessage(`/app/click/${this.roomId}/${this.nickname}`);
    } else {
      console.error('Room ID is not set');
    }
  }
}

export const oneVsOneWebSocket = OneVsOneWebSocket.getInstance(OneVsOneWebSocket);
