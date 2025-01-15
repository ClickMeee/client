import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckExistsRoomByRoomId } from '../../api/CheckExistsRoomByRoomId';
import { ReadAllRoom } from '../../api/ReadAllRoom';
import MessageModal from '../../components/modal/MessageModal.tsx';
import useMessages from '../../hooks/useMessage.ts';
import { RoomListDataProps } from '../../types/RoomListData.type';

const RoomList = () => {
  const navigate = useNavigate();
  const [roomList, setRoomList] = useState<RoomListDataProps[] | null>(null);
  const { messages, showMessage } = useMessages();

  // 'ONE_TO_ONE' | 'ONE_TO_MANY' | 'TEAM_VS_TEAM' | 'FREE_FOR_ALL'
  const GAME_TYPE = {
    ONE_TO_ONE: '일대일',
    ONE_TO_MANY: '일대다',
    TEAM_VS_TEAM: '팀대팀',
    FREE_FOR_ALL: '개인전',
  };

  const handleNavigatePage = (path: string) => {
    navigate(path);
  };

  const ifRoomExistsNavigateRoom = async (index: number) => {
    if (roomList) {
      if (await CheckExistsRoomByRoomId(roomList[index].roomId)) {
        handleNavigatePage(`/game-ready/${roomList[index].roomId}`);
        return;
      }
    }
    showMessage('잘못된 요청입니다.');
  };

  const calculateRoomCurrentUserCount = (index: number) => {
    let totalUserCount = 0;
    if (roomList) {
      roomList[index].teams.map((val) => {
        totalUserCount += val.users.length;
      });
    }
    return totalUserCount;
  };

  const calculateRoomMaxUserCount = (index: number) => {
    let maxUserCount = 0;
    if (roomList) {
      roomList[index].teams.map((val) => {
        maxUserCount += val.maxUserCount;
      });
    }
    return maxUserCount;
  };

  const fetchRoomList = async () => {
    const rooms = await ReadAllRoom();
    setRoomList(rooms);
  };

  useEffect(() => {
    fetchRoomList();
    let polling = setInterval(fetchRoomList, 5000);

    return () => {
      clearInterval(polling);
    };
  }, []);

  return (
    <>
      <MessageModal messages={messages} />
      <div className="flex flex-col justify-center items-center mt-10 md-10 bg-slate-50 bg-opacity-0 text-white p-6">
        <div className="bg-gray-700 rounded-xl max-w-100 w-3/5 min-w-80 h-5/6 p-10 shadow-floating">
          <div className="text-center text-3xl mb-10">📚 방 목록</div>
          {roomList && roomList?.length !== 0 ? (
            <div className="flex flex-wrap justify-start gap-4">
              {roomList &&
                roomList.map((room, index) => (
                  <div
                    key={index}
                    className="w-full rounded-lg flex justify-center overflow-visible"
                  >
                    <button
                      onClick={() => ifRoomExistsNavigateRoom(index)}
                      className="group flex-col w-full hover:border-green-500 rounded-xl hover:shadow-floating hover:-translate-y-1 hover:-translate-x-0.5 transition-all"
                    >
                      <div className="flex justify-between bg-slate-900 text-white p-2 rounded-t-xl border-l-2 border-r-2 border-t-2 border-white group-hover:border-green-500">
                        <div className="text-xl"> 👑 {room.roomChief}</div>
                        <div>
                          {calculateRoomCurrentUserCount(index)}/{calculateRoomMaxUserCount(index)}
                        </div>
                      </div>
                      <div className="flex justify-between bg-slate-200 text-black border-l-2 border-r-2 border-b-2 border-white p-2 rounded-b-xl group-hover:border-green-500 ">
                        <div className="">🕰️ {room.gameTime}초</div>
                        <div className=""> {GAME_TYPE[room.gameType]}</div>
                      </div>
                    </button>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center text-2xl"> 😮 방이 존재하지 않습니다. 😮</div>
          )}
        </div>
      </div>
    </>
  );
};

export default RoomList;
