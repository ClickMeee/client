import axiosInstance from './axiosInstance';

export const CheckNicknameDuplicate = async (
  roomId: string,
  nickname: string
): Promise<boolean> => {
  try {
    const response = await axiosInstance.get(`/api/room/${roomId}/${nickname}`);
    const { enterable } = response.data;
    return enterable;
  } catch (error) {
    console.error('Error checking nickname:', error);
    throw new Error('닉네임 중복 검사에 실패했습니다.');
  }
};
