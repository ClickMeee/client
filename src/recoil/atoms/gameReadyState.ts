import { atom } from 'recoil';
import { GameStateDataProps } from "../../types/GameStateData.type.ts";

export const gameReadyState = atom<GameStateDataProps>({
  key: 'gameReadyState',
  default: {
    startFlag: null,
    readyUser: null,
    allUser: null,
  },
});
