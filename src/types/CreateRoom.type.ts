type Team = {
  teamName: string; // 팀 이름
  maxUserCount: number; // 팀 최대 사용자 수
  clickCountScale: number; // 클릭 스케일링 비율
};

type RoomChief = {
  nickname: string; // 방장의 닉네임
};

type GameType = 'ONE_TO_ONE' | 'ONE_TO_MANY' | 'TEAM_VS_TEAM' | 'FREE_FOR_ALL'; // 게임 유형

export interface CreateRoomProps {
  teams: Team[]; // 팀 목록
  gameTime: number; // 게임 시간 (초)
  gameType: GameType; // 게임 유형
  roomChief: RoomChief; // 방장 정보
}
