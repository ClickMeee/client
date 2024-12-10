import {atom} from 'recoil';

type MyState = {
  nickname: string | null,
  roomId : string | null,
}

export const myState= atom<MyState>({
  key : 'myState',
  default: {
    nickname: null,
    roomId: null,
  }
});