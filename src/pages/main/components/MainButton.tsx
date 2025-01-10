import React from 'react';

type MainButtonProps = {
  text: string;
  onClickFunction: () => void;
};

const MainButton: React.FC<MainButtonProps> = ({ text, onClickFunction }) => {
  return (
    <button onClick={onClickFunction} className="basic-button text-xl text-center mb-5">
      {text}
    </button>
  );
};

export default MainButton;
