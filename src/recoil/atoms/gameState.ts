import {atom} from 'recoil';

type User = {
  name: string;
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
  teams: Team[];
  gameTime: number;
  gameType : "ONE_TO_ONE"
  roomChief : {
    nickname : string;
  }
}

export const oneVsOneGameState = atom<GameState>({
  key : 'oneVsOneGameState',
  default: {
    teams: [],
    gameTime: 0,
    gameType: "ONE_TO_ONE",
    roomChief: {
      nickname: "",
    },
  },
});