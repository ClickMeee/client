import axiosInstance from './axiosInstance';

export const CheckExistsRoomByRoomId = async (
  roomId: string,
): Promise<boolean> => {
  try {
    const response = await axiosInstance.get(`/api/room/${roomId}`);
    return response.status === 200;
  } catch (error) {
    return false;
  }
};