import {atom} from 'recoil';

type User = {
  nickname: string;
  clickCount: number;
}

type Team ={
  teamName: string;
  maxUserCount: number;
  clickCountScale : number;
  users : User[];
  teamScore : number;
}

export type GameState = {
  roomId : string
  gameType : "ONE_TO_ONE";
  gameTime: number;
  currentTime: number;
  startFlag: boolean;
  teams: Team[];
  roomChief : string
}

export const gameState = atom<GameState | null>({
  key : 'gameState',
  default: null,
});