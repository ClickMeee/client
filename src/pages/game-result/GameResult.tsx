import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import MessageModal from '../../components/modal/MessageModal.tsx';
import useMessages from '../../hooks/useMessage.ts';
import { gameReadyState } from '../../recoil/atoms/gameReadyState';
import { gameState } from '../../recoil/atoms/gameState.ts';
import { userState } from '../../recoil/atoms/userState.ts';
import WebSocketManager from '../../services/WebSocketManager.ts';
import { GameStateDataProps } from '../../types/GameStateData.type.ts';
import { RoomClientProps } from '../../types/RoomClient.type.ts';
import { RoomDataProps } from '../../types/RoomData.type.ts';
import GameResultChart from '../../components/chart/GameResultChart.tsx';

export default function GameResult() {
  const webSocketManager = WebSocketManager.getInstance();
  const navigate = useNavigate();

  const [user, setUser] = useRecoilState<RoomClientProps>(userState);
  const [game, setGame] = useRecoilState<RoomDataProps | null>(gameState);
  const [gameReady, setGameReady] = useRecoilState<GameStateDataProps>(gameReadyState);

  const { messages, showMessage } = useMessages();

  return (
    <>
      <MessageModal messages={messages} />
      <div className="w-full h-full justify-center flex items-center">
        <div className="bg-white rounded-3xl shadow-2xl w-10/12 h-5/6 flex justify-center overflow-hidden">
          <GameResultChart />
        </div>
      </div>
    </>
  );
}
