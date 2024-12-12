import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

// recoil-persist 설정
const { persistAtom } = recoilPersist({
  key: 'recoil-persist-userState',
  storage: localStorage,
});

export type UserState = {
  nickname: string | null;
  roomId: string | null | undefined;
};

export const userState = atom<UserState>({
  key: 'userState',
  default: {
    nickname: null,
    roomId: null,
  },
  effects_UNSTABLE: [persistAtom],
});
