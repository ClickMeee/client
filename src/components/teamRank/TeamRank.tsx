import { useRecoilValue } from "recoil";
import { gameState} from "../../recoil/atoms/gameState";
import { userState } from "../../recoil/atoms/userState";
import { RoomDataProps } from "../../types/RoomData.type.ts";
import { RoomClientProps } from "../../types/RoomClient.type.ts";


export default function TeamRank() {
  const game = useRecoilValue<RoomDataProps | null>(gameState); // 게임 상태
  const user = useRecoilValue<RoomClientProps>(userState); // 사용자 상태

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
    <div className="w-full h-full rounded-lg p-4 border-2 border-orange-500">
      <h2 className="text-xl font-semibold text-orange-500 mb-4 text-center">
        🏆 Team Rankings
      </h2>

      <ul className="space-y-3">
        {rankedTeams?.map((team, index) => (
          <li
            key={index}
            className={`flex justify-between items-center px-4 py-2 rounded-lg shadow-md
              ${
              team.isUserTeam
                ? "bg-orange-500 text-black font-bold"
                : "bg-gray-900 text-gray-300"
            }`}
          >
            <span className="text-lg">{index + 1}. {team.teamName}</span>
            <span className="text-lg">{team.totalClicks} clicks</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
