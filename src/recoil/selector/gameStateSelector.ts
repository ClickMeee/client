import { selector } from "recoil";
import { oneVsOneGameState } from "../atoms/gameState.ts";

export const gameStateSelector = selector({
  key: 'gameStateSelector',
  get : ({get}) =>{
    return get(oneVsOneGameState);
  },
  set: ({ set}, newValue ) => {
    set(oneVsOneGameState, newValue);
  },
})