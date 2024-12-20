import React from "react";
import TeamRank from "../Rank/TeamRank.tsx";
import IndividualRank from "../Rank/IndividualRank.tsx";
import { useNavigate } from "react-router-dom";

interface ResultModalProps {
  setResultModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ResultModal: React.FC<ResultModalProps> = ({setResultModal}) => {
  const navigate = useNavigate();

  const handleButtonClick = () =>{
    setResultModal(false);
    navigate('/');
  }

  return (
    <>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="flex flex-col gap-4 bg-white rounded-lg p-8 shadow-lg relative w-full max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">게임 결과</h2>
          <TeamRank resultModal={true} />
          <IndividualRank />
          <button
            className="px-4 py-4 flex items-center justify-center bg-orange-400 text-white rounded hover:bg-orange-500 transition"
            onClick={handleButtonClick}
          >
            홈 페이지로 가기
          </button>
        </div>
      </div>
    </>

  );
};

export default ResultModal;