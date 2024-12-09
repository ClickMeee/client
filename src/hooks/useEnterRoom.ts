// import { useEffect, useState } from 'react';
// import { oneVsOneWebSocket } from '../services/OneVsOneWebSocket';
// import { CreateRoomProps } from '../types/CreateRoom.type';
// import { RoomClientProps } from '../types/RoomClient.type';

// export const useEnterRoom = (roomId: string, nickname: string) => {
//   const [roomData, setRoomData] = useState<CreateRoomProps | null>(null); // 방 데이터 상태

//   useEffect(() => {
//     if (!roomId || !nickname) {
//       console.warn('Skipping enterRoom: roomId or nickname is undefined');
//       return; // roomId 또는 nickname이 없으면 실행 중단
//     }

//     const enterRoom = async () => {
//       const requestBody: RoomClientProps = {
//         roomId: roomId,
//         nickname: nickname,
//       };

//       try {
//         // WebSocket 연결
//         await oneVsOneWebSocket.connect();

//         // 메시지 구독
//         oneVsOneWebSocket.subscribe(`/topic/room/${roomId}`, (message) => {
//           try {
//             const parsedData = JSON.parse(message.body); // 올바르게 JSON 파싱
//             console.log('Received Room Enter Data:', parsedData);

//             setRoomData(parsedData.data);
//           } catch (err) {
//             console.error('Error parsing WebSocket message:', err);
//           }
//         });

//         // 방 입장 메시지 전송
//         oneVsOneWebSocket.sendMessage('/app/room/enter', requestBody);
//       } catch (err) {
//         console.error('Error entering room:', err);
//       }
//     };

//     enterRoom();
//   }, [roomId, nickname]);

//   return roomData;
// };
