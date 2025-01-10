import { useRecoilValue } from 'recoil';
import { gameState } from '../../recoil/atoms/gameState';
import { userState } from '../../recoil/atoms/userState';
import { RoomClientProps } from '../../types/RoomClient.type.ts';
import { RoomDataProps } from '../../types/RoomData.type.ts';

export default function DetailRank() {
  const game = useRecoilValue<RoomDataProps | null>(gameState); // 게임 상태
  const user = useRecoilValue<RoomClientProps>(userState); // 사용자 상태

  // 모든 팀의 유저를 단일 배열로 변환 및 클릭 수 기준 내림차순 정렬
  const rankedUsers = game?.teams
    .flatMap((team) =>
      team.users.map((teamUser) => ({
        nickname: teamUser.nickname,
        clickCount: teamUser.clickCount,
        isCurrentUser: teamUser.nickname === user.nickname,
        teamName: team.teamName,
      }))
    )
    .sort((a, b) => b.clickCount - a.clickCount);

  return (
    <div className="w-full flex flex-col p-4 mt-10">
      <h2 className="text-xl font-semibold text-orange-500 mb-4 text-center">🏆 랭킹</h2>

      <ul className="space-y-3">
        {rankedUsers?.map((user, index) => (
          <li
            key={index}
            className={`flex justify-between items-center px-4 py-2 rounded-lg
              ${
                user.isCurrentUser
                  ? ' text-black font-bold border-4 border-orange-500 shadow-sm'
                  : ' text-white shadow-sm'
              }
               ${
                 game?.gameType === 'FREE_FOR_ALL'
                   ? 'bg-gray-500 bg-opacity-30'
                   : user.teamName === 'RED'
                     ? 'bg-red-500 bg-opacity-85'
                     : 'bg-blue-500 bg-opacity-85'
               }
              `}
          >
            <span className="text-lg">
              {index === 0 && '🥇 '}
              {index === 1 && '🥈 '}
              {index === 2 && '🥉 '}
              {user.nickname}
            </span>
            <span className="text-lg">{user.clickCount} clicks</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
