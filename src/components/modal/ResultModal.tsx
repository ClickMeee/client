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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">게임 끝!</h2>
        </div>
      </div>
    </>

  );
};

export default ResultModal;