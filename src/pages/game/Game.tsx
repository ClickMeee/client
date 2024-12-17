import { oneVsOneWebSocket } from "../../services/OneVsOneWebSocket";
import TeamChart from "../../components/chart/TeamChart";
import IndividualChart from "../../components/chart/IndividualChart";
import TeamRank from "../../components/teamRank/TeamRank";


const Game = () => {

  const handleButtonClick = () => {
    oneVsOneWebSocket.sendClickEvent();
  };

  return (
    <div className='flex flex-col gap-8 p-8 h-full'>
      <div
        className="flex flex-col items-center justify-center w-full h-2/3 p-4 bg-white rounded-xl shadow-xl box-border">
        {/* 차트 표시 div */}
        <div className="flex gap-4 w-full h-full">
          <div className="flex-[3] h-full">
            <TeamChart />
          </div>
          <div className="flex flex-col flex-[2] gap-4">
            <div className="flex-1 h-1/2">
              <IndividualChart />
            </div>
            <div className="flex-1 h-1/2 p-4">
              <TeamRank />
            </div>
          </div>
        </div>
      </div>
      {/* 클릭 버튼 */}
      <div className="flex-1 flex w-full h-full box-border shadow-xl">
        <button
          className="w-full h-full bg-orange-400 text-xl font-bold rounded-lg hover:bg-orange-500 box-border"
          onClick={handleButtonClick}
        >
          Click Mee!
        </button>
      </div>
    </div>
  );
};

export default Game;
