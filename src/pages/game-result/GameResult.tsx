import { useNavigate } from 'react-router-dom';
import GameResultChart from '../../components/chart/GameResultChart.tsx';
import MessageModal from '../../components/modal/MessageModal.tsx';
import DetailRank from '../../components/rank/DetailRank.tsx';
import useMessages from '../../hooks/useMessage.ts';

export default function GameResult() {
  const navigate = useNavigate();
  const { messages } = useMessages();

  return (
    <>
      <MessageModal messages={messages} />
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="bg-white rounded-3xl shadow-2xl w-11/12 flex flex-col justify-center overflow-hidden ">
          <GameResultChart />
          <DetailRank />
        </div>
        <div
          className={
            'mt-4 w-11/12 text-white text-center bg-green-600 border-2 border-opacity-0 border-white rounded-2xl shadow-xl hover:bg-green-700 hover:transition duration-300'
          }
        >
          <button className={'p-4'} onClick={() => navigate('/')}>
            메인 페이지로 이동
          </button>
        </div>
      </div>
    </>
  );
}
