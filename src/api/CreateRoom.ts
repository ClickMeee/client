import { CreateRoomProps } from '../types/CreateRoom.type';
import axiosInstance from './axiosInstance.ts';

interface CreateRoomResponse {
  roomId: string; // 서버에서 반환하는 roomId 타입
}

// 유틸 함수: ONE_TO_ONE 타입 요청 데이터 생성
const buildRequestBody = (
  gameType: string,
  nickname: string,
  gameTime: number
): CreateRoomProps => {
  if (gameType === 'ONE_TO_ONE') {
    return {
      teams: [
        {
          teamName: 'Team 1',
          maxUserCount: 1,
          clickCountScale: 1.0,
        },
        {
          teamName: 'Team 2',
          maxUserCount: 1,
          clickCountScale: 1.0,
        },
      ],
      gameTime,
      gameType,
      roomChief: {
        nickname,
      },
    };
  }

  throw new Error(`Unsupported game type: ${gameType}`);
};

// createRoom 함수 리팩토링
export const createRoom = async (
  roomProps: CreateRoomProps
): Promise<string> => {
  try {
    // const requestBody = buildRequestBody(gameType, nickname, gameTime);
    const requestBody = roomProps;
    const response = await axiosInstance.post<CreateRoomResponse>('/room', requestBody);

    console.log('Room created successfully:', response.data);
    return response.data.roomId; // 서버에서 반환된 roomId를 사용
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Room creation failed';
    console.error('Failed to create room:', errorMessage);
    throw new Error(errorMessage);
  }
};
