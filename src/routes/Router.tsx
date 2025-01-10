import { Navigate, Route, Routes } from 'react-router-dom';
import GameReady from '../pages/game-ready/GameReady.tsx';
import GameSetting from '../pages/game-setting/GameSetting.tsx';
import Game from '../pages/game/Game.tsx';
import Main from '../pages/main/Main.tsx';
import EnterRoomByCode from '../pages/enter/EnterRoomByCode.tsx';
import RoomList from '../pages/room-list/RoomList.tsx';
import Help from '../pages/help/Help.tsx';
import GameResult from '../pages/game-result/GameResult.tsx';

export default function Router() {
  return (
    <Routes>
      {/* 진입 지점 */}
      <Route path="/" element={<Main />} />

      {/* 방 생성 */}
      <Route path="/game-setting" element={<GameSetting />} />

      {/* 게임 준비 화면 */}
      <Route path="/game-ready/:roomId" element={<GameReady />} />

      {/* 게임 화면 */}
      <Route path="/game/:roomId" element={<Game />} />

      {/* 게임 결과 화면 */}
      <Route path="/game-result" element={<GameResult />} />

      {/* 방 코드 입력 화면*/}
      <Route path="/enter" element={<EnterRoomByCode />} />

      {/* 방 목록 화면면 */}
      <Route path="/room-list" element={<RoomList />} />

      <Route path="/help" element={<Help />} />
      {/* default 경로 설정 */}
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}
