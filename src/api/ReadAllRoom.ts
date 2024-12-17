import { GameState } from '../recoil/atoms/gameState';
import axiosInstance from './axiosInstance';

export const ReadAllRoom = async (): Promise<GameState[]> => {
  try {
    const response = await axiosInstance.get(`/api/room`);
    const rooms: GameState[] = response.data;
    return rooms;
  } catch (error) {
    // todo : modal로 변경하여 방이 없다고 말할 것
    return [];
  }
};
