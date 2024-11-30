import axios from 'axios';
import { CreateRoomProps } from '../types/CreateRoom.type';

interface CreateRoomResponse {
  roomId: string; // 서버에서 반환하는 roomId 타입
}

export const createRoom = async (data: CreateRoomProps): Promise<string> => {
  try {
    const response = await axios.post<CreateRoomResponse>(
      import.meta.env.VITE_API_URL + '/room',
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Room created successfully:', response.data);

    return response.data.roomId; // 서버에서 반환된 roomId를 사용
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Room creation failed';
    console.error('Failed to create room:', errorMessage);

    throw new Error(errorMessage);
  }
};
