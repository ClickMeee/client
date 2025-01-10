import { atom } from 'recoil';
import { RoomClientProps } from '../../types/RoomClient.type.ts';

export const userState = atom<RoomClientProps>({
  key: 'userState',
  default: {
    nickname: null,
    roomId: null,
  },
});
