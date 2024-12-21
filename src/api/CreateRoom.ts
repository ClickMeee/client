import { CreateRoomGenerator, CreateRoomProps } from '../types/CreateRoom.type';
import axiosInstance from './axiosInstance.ts';

interface CreateRoomResponse {
  roomId: string; // 서버에서 반환하는 roomId 타입
}

const clickCountScale = 1.0; // 클릭 스케일링 비율

// 유틸 함수: ONE_TO_ONE 타입 요청 데이터 생성
const buildRequestBody = (
  gameType: string,
  nickname: string,
  gameTime: number,
  maxUserCount: number
): CreateRoomProps => {
  if (gameType === 'ONE_TO_ONE') {
    return CreateRoomGenerator.makeRoom(
      [
        CreateRoomGenerator.makeOneManTeam('RED', clickCountScale),
        CreateRoomGenerator.makeOneManTeam('BLUE', clickCountScale),
      ],
      gameTime,
      gameType,
      { nickname }
    );
  } else if (gameType === 'ONE_TO_MANY') {
    return CreateRoomGenerator.makeRoom(
      [
        CreateRoomGenerator.makeOneManTeam('RED', clickCountScale),
        CreateRoomGenerator.makeTeam('BLUE', maxUserCount, clickCountScale),
      ],
      gameTime,
      gameType,
      { nickname }
    );
  } else if (gameType === 'TEAM_VS_TEAM') {
    return CreateRoomGenerator.makeRoom(
      [
        CreateRoomGenerator.makeTeam('RED', maxUserCount, clickCountScale),
        CreateRoomGenerator.makeTeam('BLUE', maxUserCount, clickCountScale),
      ],
      gameTime,
      gameType,
      { nickname }
    );
  } else if (gameType === 'FREE_FOR_ALL') {
    return CreateRoomGenerator.makeRoom(
      [CreateRoomGenerator.makeTeam('개인전', maxUserCount, clickCountScale)],
      gameTime,
      gameType,
      { nickname }
    );
  }

  throw new Error(`Unsupported game type: ${gameType}`);
};

// createRoom 함수 리팩토링
export const createRoom = async (
  gameType: string, // 지원하는 게임 타입
  nickname: string, // 닉네임
  gameTime: number, // 게임 시간
  maxUserCount: number // 최대 사용자 수
): Promise<string> => {
  try {
    const requestBody = buildRequestBody(gameType, nickname, gameTime, maxUserCount);

    const response = await axiosInstance.post<CreateRoomResponse>('/api/room', requestBody);

    console.log('Room created successfully:', response.data);
    return response.data.roomId; // 서버에서 반환된 roomId를 사용
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Room creation failed';
    console.error('Failed to create room:', errorMessage);
    throw new Error(errorMessage);
  }
};
