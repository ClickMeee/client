import { useRecoilValue } from "recoil";
import { gameState, GameState } from "../../recoil/atoms/gameState";
import { UserState, userState } from "../../recoil/atoms/userState";

type Props = {}

export default function TeamRank({ }: Props) {
  const game = useRecoilValue<GameState | null>(gameState); // 게임 상태
  const user = useRecoilValue<UserState>(userState); // 사용자 상태

  const userTeamName = game?.teams.find((team) =>
    team.users.some((teamUser) => teamUser.nickname === user.nickname)
  )?.teamName || "No Team";

  // 모든 팀의 클릭 수 합계 계산 및 내림차순 정렬
  const rankedTeams = game?.teams
    .map((team) => ({
      teamName: team.teamName,
      totalClicks: team.users.reduce((sum, user) => sum + user.clickCount, 0),
      isUserTeam: team.teamName === userTeamName,
    }))
    .sort((a, b) => b.totalClicks - a.totalClicks);

  return (
    <div>
      <h1>Your Team: {userTeamName}</h1>
      <ul>
        {rankedTeams?.map((team, index) => (
          <li key={index} style={{ fontWeight: team.isUserTeam ? "bold" : "normal" }}>
            {team.teamName}: {team.totalClicks} clicks
            {team.isUserTeam && " (Your Team)"}
          </li>
        ))}
      </ul>
    </div>
  );
}
