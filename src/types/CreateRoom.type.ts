type Team = {
  teamName: string; // 팀 이름
  maxUserCount: number; // 팀 최대 사용자 수
  clickCountScale: number; // 클릭 스케일링 비율
};

type GameType = 'ONE_TO_ONE' | 'ONE_TO_MANY' | 'TEAM_VS_TEAM' | 'FREE_FOR_ALL'; // 게임 유형

type RoomChief = {
  nickname: string;
};

export interface CreateRoomProps {
  teams: Team[]; // 팀 목록
  gameTime: number; // 게임 시간 (초)
  gameType: GameType; // 게임 유형
  roomChief: RoomChief; // 방장 정보
}

export class CreateRoomGenerator {
  static makeRoom(
    teams: Team[],
    gameTime: number,
    gameType: GameType,
    roomChief: RoomChief
  ): CreateRoomProps {
    return {
      teams: teams,
      gameTime: gameTime,
      gameType: gameType,
      roomChief: roomChief,
    };
  }

  static makeTeam(teamName: string, maxUserCount: number, clickCountScale: number): Team {
    return {
      teamName: teamName,
      maxUserCount: maxUserCount,
      clickCountScale: clickCountScale,
    };
  }

  static makeOneManTeam(teamName: string, clickCountScale: number): Team {
    return {
      teamName: teamName,
      maxUserCount: 1,
      clickCountScale: clickCountScale,
    };
  }
}
