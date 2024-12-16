import { Navigate, Route, Routes } from 'react-router-dom';
import GameReady from '../pages/game-ready/GameReady.tsx';
import Home from '../pages/home/Home';
import Game from "../pages/game/Game.tsx";
import Main from "../pages/main/Main.tsx"

export default function Router() {
  return (
    <Routes>
      {/* 진입 지점 */}
      <Route path="/" element={<Main />} />
      <Route path="/home" element={<Home />} />
      <Route path="/game-ready/:roomId" element={<GameReady />} />
      <Route path="/game/:roomId" element={<Game />} />
      {/* default 경로 설정 */}
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}
