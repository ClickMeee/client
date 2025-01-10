import axiosInstance from './axiosInstance';

export const ReadCurrentUserCount = async (): Promise<number> => {
  try {
    const response = await axiosInstance.get(`/api/statistics/user/count`);
    const userCount: number = response.data;
    return userCount;
  } catch {
    return 0;
  }
};
