import { Navigate, Route, Routes } from 'react-router-dom';
import Game from '../pages/game/Game';
import Home from '../pages/home/Home';
import RoomList from '../pages/roomList/RoomList';

export default function Router() {
  return (
    <Routes>
      {/* 진입 지점 */}
      <Route path="/" element={<Home />} />
      <Route path="/game/:roomId" element={<Game />} />
      <Route path="/list" element={<RoomList />}/> 
      {/* default 경로 설정 */}
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}
