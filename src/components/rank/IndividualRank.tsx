import { useRecoilValue } from "recoil";
import { gameState } from "../../recoil/atoms/gameState";
import { userState } from "../../recoil/atoms/userState";
import { RoomDataProps } from "../../types/RoomData.type.ts";
import { RoomClientProps } from "../../types/RoomClient.type.ts";

export default function IndividualRank() {
  const game = useRecoilValue<RoomDataProps | null>(gameState); // 게임 상태
  const user = useRecoilValue<RoomClientProps>(userState); // 사용자 상태

  // 모든 팀의 유저를 단일 배열로 변환 및 클릭 수 기준 내림차순 정렬
  const rankedUsers = game?.teams
    .flatMap((team) =>
      team.users.map((teamUser) => ({
        nickname: teamUser.nickname,
        clickCount: teamUser.clickCount,
        isCurrentUser: teamUser.nickname === user.nickname,
      }))
    )
    .sort((a, b) => b.clickCount - a.clickCount)
    .slice(0, 3); // 상위 3명만 선택

  return (
    <div className="w-full flex flex-col rounded-lg p-4 border-2 border-orange-300">
      <h2 className="text-xl font-semibold text-orange-500 mb-4 text-center">
        🏆 개인 랭킹
      </h2>

      <ul className="space-y-3">
        {rankedUsers?.map((user, index) => (
          <li
            key={index}
            className={`flex justify-between items-center px-4 py-2 rounded-lg
              ${
              user.isCurrentUser
                ? " text-black font-bold border-2 border-orange-500 shadow-lg bg-orange-500"
                : " text-gray-600 border-2 border-gray-300 shadow-sm"
            }`}
          >
            <span className="text-lg">
              {index === 0 && '🥇 '}
              {index === 1 && '🥈 '}
              {index === 2 && '🥉 '}
              {user.nickname}</span>
            <span className="text-lg">{user.clickCount} clicks</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
