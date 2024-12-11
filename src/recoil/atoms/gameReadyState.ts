import { atom } from 'recoil';

export type GameReadyState = {
  nickname: string | null;
  roomId: string | null;
};

export const gameReadyState = atom<GameReadyState>({
  key: 'userState',
  default: {
    nickname: null,
    roomId: null,
  },
});
