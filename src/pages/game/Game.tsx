import { useRecoilState } from "recoil";
import { gameState, GameState } from "../../recoil/atoms/gameState.ts";
import { userState } from "../../recoil/atoms/userState.ts";


const Game = () => {
  const [game, setGame] = useRecoilState<GameState | null>(gameState);
  const [user, setUser] = useRecoilState(userState);

  return (
    <div className='flex flex-col items-center justify-center w-full h-full'>
      {/* Chart 표시 div */}
      <div>
        차트
      </div>

      {/* 클릭 버튼 div */}
      <div>
        <button className='bg-green-400 w-full'> Click Mee!</button>
      </div>
    </div>
  );
};

export default Game;
