import {atom} from 'recoil';

export type UserState = {
  nickname: string | null,
  roomId : string | null,
}

export const userState= atom<UserState>({
  key : 'userState',
  default: {
    nickname: null,
    roomId: null,
  }
});