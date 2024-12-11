import { atom } from 'recoil';

export type GameReadyState = {
  startFlag: string | null;
  readyUser: number | null;
  allUser: number | null;
};

export const gameReadyState = atom<GameReadyState>({
  key: 'gameReadyState',
  default: {
    startFlag: null,
    readyUser: null,
    allUser: null,
  },
});
