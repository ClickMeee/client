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
  gameType : "ONE_TO_ONE";
  gameTime: number;
  currentTime: number;
  startFlag: boolean;
  teams: Team[];
  roomChief : string
}

// TODO: 모든 게임 상태가 이런 구조면 oneVsOneGameState 이름 변경할 것
export const oneVsOneGameState = atom<GameState | null>({
  key : 'oneVsOneGameState',
  default: null,
});