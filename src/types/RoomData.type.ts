type Team = {
  teamName: string; // 팀 이름
  maxUserCount: number; // 팀 최대 사용자 수
  clickCountScale: number; // 클릭 스케일링 비율
  users: User[]; // 팀 사용자 목록
  teamScore: number; // 팀 점수
};

type User = {
  nickname: string; // 사용자 닉네임
  clickCount: number; // 클릭 수
};

type GameType = 'ONE_TO_ONE' | 'ONE_TO_MANY' | 'TEAM_VS_TEAM' | 'FREE_FOR_ALL'; // 게임 유형

export interface RoomDataProps {
  gameType: GameType; // 게임 유형
  gameTime: number; // 게임 시간 (초)
  currentTime: number; // 현재 시간 (초)
  startFlag: boolean; // 게임 시작 여부
  teams: Team[]; // 팀 목록

  roomChief: string; // 방장 닉네임
}

