import {atom} from 'recoil';
import { RoomDataProps } from "../../types/RoomData.type.ts";

export const gameState = atom<RoomDataProps | null>({
  key : 'gameState',
  default: null,
});