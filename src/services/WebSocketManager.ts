import { Client, IFrame, IMessage } from '@stomp/stompjs';
import { NavigateFunction } from 'react-router-dom';
import SockJS from 'sockjs-client';

class WebSocketManager {
  private static instance: WebSocketManager | null = null;
  private client: Client | null = null;
  private roomId: string = '';
  private nickname: string = '';

  private updateGameState: ((state: any) => void) | null = null;
  private updateGameReadyState: ((state: any) => void) | null = null;
  private navigate: NavigateFunction | null = null;
  private showMessage: ((state: any) => void) | null = null;
  private showRoomChiefLeaveMessage: ((state: any) => void) | null = null;
  private showResultMessage: ((state: any) => void) | null = null;

  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  // 웹 소켓 연결
  connect(): Promise<void> {
    if (this.client && this.client.connected) {
      console.log('WebSocket is already connected.');
      return Promise.resolve(); // 이미 연결되어 있으면 바로 성공 처리
    }

    return new Promise((resolve, reject) => {
      this.client = new Client({
        webSocketFactory: () => new SockJS(import.meta.env.VITE_API_URL + '/api/ws/connect'),
        debug: (str: string) => console.log(`[STOMP Debug] ${str}`),
        reconnectDelay: 5000,
        onConnect: (frame: IFrame) => {
          console.log('WebSocket connected:', frame);

          // 방 정보 구독
          this.subscribe(`/topic/room/${this.roomId}`, (message) => {
            this.processData(message);
          });

          // 방 입장 요청
          this.roomEnterRequest();
          resolve(); // 연결 성공 시 프라미스 해결
        },
        onStompError: (error: any) => {
          console.error('WebSocket STOMP Error:', error);
          reject(new Error('WebSocket STOMP Error')); // 에러 발생 시 프라미스 거부
        },
        onDisconnect: () => {
          console.log('WebSocket disconnected.');
        },
      });

      this.client.activate();
      console.log('WebSocket Client activated.');
    });
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
          this.playerReadyRequest();
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

      case 'ROOM_ENTER':
        if (this.showMessage) {
          this.showMessage(`${message.data.target}님이 입장하였습니다.`);
        }
        break;

      case 'GAME_END':
        if (this.updateGameState) {
          console.log(`${message.type} 처리`);
          this.updateGameState(message.data);
        }
        if (this.showResultMessage) {
          this.showResultMessage(true);
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

  setShowRoomChiefLeaveMessage(showRoomChiefLeaveMessage: (state: any) => void): void {
    this.showRoomChiefLeaveMessage = showRoomChiefLeaveMessage;
  }

  setShowResultMessage(showResultMessage: (state: any) => void): void {
    this.showResultMessage = showResultMessage;
  }

  // 메시지 전송 메소드
  sendMessage(destination: string, body: Object = ''): void {
    if (!this.client || !this.client.connected) {
      console.error('Cannot send message: WebSocket is not connected.');
      return;
    }

    try {
      this.client.publish({
        destination,
        body: typeof body === 'string' ? body : JSON.stringify(body),
      });
      console.log(`Message sent to ${destination}:`, body);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }

  // stomp 프로토콜 구독
  subscribe(destination: string, callback: (message: any) => void): void {
    if (!this.client || !this.client.connected) {
      console.error(`Cannot subscribe to ${destination}: WebSocket is not connected`);
      return;
    }

    this.client.subscribe(destination, (message: IMessage) => {
      const parsedBody = JSON.parse(message.body);
      callback(parsedBody);
    });

    console.log(`Subscribed to ${destination}`); // 후에 삭제
  }

  // Optional getter for `client` (if needed)
  getClient(): Client | null {
    return this.client;
  }

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

  // 웹 소켓 연결 종료
  disconnect(): void {
    if (this.client) {
      if (this.client.connected) {
        console.log('Disconnecting WebSocket...');
      }
      this.client.deactivate();
      this.client = null;
      console.log('WebSocket disconnected.');
    } else {
      console.warn('WebSocket is already disconnected.');
    }
  }
}

export default WebSocketManager;
