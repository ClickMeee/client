import { oneVsOneWebSocket } from "../../services/OneVsOneWebSocket";
import TeamChart from "../../components/chart/TeamChart";
import IndividualChart from "../../components/chart/IndividualChart";
import TeamRank from "../../components/teamRank/TeamRank";


const Game = () => {

  const handleButtonClick = () => {
    oneVsOneWebSocket.sendClickEvent();
  };

  return (
    <div className="flex flex-col items-center justify-center w-11/12 h-11/12 m-12 p-4 bg-white">
      {/* 차트 표시 div */}
      <div className="w-3/4 h-1/2">
        <TeamChart />
        <IndividualChart />
        <TeamRank />
      </div>

      {/* 클릭 버튼 */}
      <div>
        <button
          className="bg-green-400 w-64 h-16 text-xl font-bold rounded-lg hover:bg-green-500"
          onClick={handleButtonClick}>
          Click Mee!
        </button>
      </div>
    </div>
  );
};

export default Game;
