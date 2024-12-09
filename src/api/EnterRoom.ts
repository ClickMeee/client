import { oneVsOneWebSocket } from '../services/OneVsOneWebSocket';
import { CreateRoomProps } from '../types/CreateRoom.type';
import { RoomClientProps } from '../types/RoomClient.type';

export const enterRoom = async (roomId: string, nickname: string): Promise<CreateRoomProps> => {
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
            const parsedData = message;
            console.log('Received Room Enter Data:', parsedData);

            resolve(parsedData.data); // 방 데이터 반환
          } catch (err) {
            reject(new Error('Failed to parse WebSocket message'));
          }
        });

        // 방 입장 메시지 전송
        oneVsOneWebSocket.sendMessage('/app/room/enter', requestBody);
      } catch (err) {
        reject(new Error('Failed to subscribe to WebSocket'));
      }
    });
  } catch (err) {
    throw new Error('Failed to connect to WebSocket');
  }
};
