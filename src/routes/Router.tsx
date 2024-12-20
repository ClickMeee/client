import { Navigate, Route, Routes } from 'react-router-dom';
import GameReady from '../pages/game-ready/GameReady.tsx';
import GameSetting from '../pages/game-setting/GameSetting.tsx';
import Game from "../pages/game/Game.tsx";
import Main from "../pages/main/Main.tsx"
import EnterRoomByCode from '../pages/enter/EnterRoomByCode.tsx';
import RoomList from '../pages/room-list/RoomList.tsx';
import Help from "../pages/help/Help.tsx";

export default function Router() {
  return (
    <Routes>
      {/* 진입 지점 */}
      <Route path="/" element={<Main />} />
      <Route path="/game-setting" element={<GameSetting />} />
      <Route path="/game-ready/:roomId" element={<GameReady />} />
      <Route path="/game/:roomId" element={<Game />} />
      <Route path="/enter" element={<EnterRoomByCode />} />
      <Route path="/room-list" element={<RoomList />} />
      <Route path="/help" element={<Help />} />
      {/* default 경로 설정 */}
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}
