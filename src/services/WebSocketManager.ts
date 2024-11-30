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
  connect(): void {
    this.client = new Client({
      webSocketFactory: () => new SockJS(import.meta.env.VITE_API_URL + '/connect'), // /connect 엔드포인트로 연결
      debug: (str) => console.log(`[STOMP Debug] ${str}`), // 후에 삭제
      reconnectDelay: 5000,
      onConnect: this.onConnect.bind(this),
      onStompError: this.onError.bind(this),
      onDisconnect: this.onDisconnect.bind(this),
    });

    this.client.activate();
  }

  abstract onConnect(frame: IFrame): void;
  abstract onDisconnect(): void;
  abstract onError(frame: IFrame): void;

  // 웹 소켓 연결 종료
  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }
  }

  // stomp 프로토콜 구독
  subscribe(destination: string, callback: (message: any) => void): void {
    if (!this.client || !this.client.connected) {
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
}
