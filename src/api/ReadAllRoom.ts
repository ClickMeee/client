import { RoomListDataProps } from '../types/RoomListData.type.ts';
import axiosInstance from './axiosInstance';

export const ReadAllRoom = async (): Promise<RoomListDataProps[]> => {
  try {
    const response = await axiosInstance.get(`/api/room`);
    const rooms: RoomListDataProps[] = response.data;
    return rooms;
  } catch (error) {
    // todo : modal로 변경하여 방이 없다고 말할 것
    return [];
  }
};
