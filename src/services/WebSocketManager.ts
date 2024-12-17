import { Client, IFrame, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export abstract class WebSocketManager {
  private static instance: WebSocketManager | null = null;
  private client: Client | null = null;

  public static getInstance<T extends WebSocketManager>(type: new () => T): T {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new type();
    }
    return WebSocketManager.instance as T;
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
          console.log('WebSocket connected successfully.');
          this.onConnect(frame); // 추상화된 onConnect 호출
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

  abstract onConnect(frame: IFrame): void;
  abstract onStompError(frame: IFrame): void;
  abstract onDisconnect(): void;

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
