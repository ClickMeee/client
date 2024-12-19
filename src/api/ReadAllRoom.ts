import axiosInstance from './axiosInstance';
import { RoomDataProps } from "../types/RoomData.type.ts";

export const ReadAllRoom = async (): Promise<RoomDataProps[]> => {
  try {
    const response = await axiosInstance.get(`/api/room`);
    const rooms: RoomDataProps[] = response.data;
    return rooms;
  } catch (error) {
    // todo : modal로 변경하여 방이 없다고 말할 것
    return [];
  }
};
