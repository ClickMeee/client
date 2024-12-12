import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

// recoil-persist 설정
const { persistAtom } = recoilPersist({
  key: 'recoil-persist-gameReadyState',
  storage: localStorage,
});

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
  effects_UNSTABLE: [persistAtom], // 상태를 저장/복구하도록 설정
});
