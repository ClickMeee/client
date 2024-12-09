import { oneVsOneWebSocket } from '../services/OneVsOneWebSocket';
import { RoomClientProps } from '../types/RoomClient.type';
import { RoomDataProps } from '../types/RoomData.type';

export const enterRoom = async (
  roomId: string,
  nickname: string,
  callback: (message: any) => void
): Promise<RoomDataProps> => {
  if (!roomId || !nickname) {
    throw new Error('Room ID or Nickname is undefined');
  }

  const requestBody: RoomClientProps = {
    roomId,
    nickname,
  };

  try {
    // WebSocket 연결 대기
    await oneVsOneWebSocket.connect();

    return new Promise((resolve, reject) => {
      try {
        // 메시지 구독
        oneVsOneWebSocket.subscribe(`/topic/room/${roomId}`, (message) => {
          try {
            console.log('Received WebSocket Message:', message);

            const parsedMessage = message; // 메시지 파싱
            if (parsedMessage.type === 'ROOM') {
              const roomData = parsedMessage.data;
              callback(roomData); // Callback 호출
              resolve(roomData); // 방 데이터 반환
            } else {
              console.warn('Unexpected message type:', parsedMessage.type);
            }
          } catch (err) {
            console.error('Failed to parse WebSocket message:', err);
            reject(new Error('Failed to parse WebSocket message'));
          }
        });

        // 방 입장 메시지 전송
        oneVsOneWebSocket.sendMessage('/app/room/enter', requestBody);
      } catch (err) {
        console.error('Failed to subscribe to WebSocket:', err);
        reject(new Error('Failed to subscribe to WebSocket'));
      }
    });
  } catch (err) {
    console.error('Failed to connect to WebSocket:', err);
    throw new Error('Failed to connect to WebSocket');
  }
};
