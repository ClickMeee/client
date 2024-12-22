import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { createRoom } from '../../api/CreateRoom';
import MessageModal from '../../components/modal/MessageModal.tsx';
import useMessages from '../../hooks/useMessage';
import { userState } from '../../recoil/atoms/userState';
import messageModal from "../../components/modal/MessageModal.tsx";

const GameSetting = () => {
  const resetUserState = useResetRecoilState(userState);
  const navigate = useNavigate();
  const [inputNickname, setInputNickname] = useState<string>('');
  const [gameTime, setGameTime] = useState<number>(10);
  const [gameType, setGameType] = useState<
    'ONE_TO_ONE' | 'ONE_TO_MANY' | 'TEAM_VS_TEAM' | 'FREE_FOR_ALL'
  >('ONE_TO_ONE');
  const [maxUserCount, setMaxUserCount] = useState<number>(2);
  const [clickCountScale, setClickCountScale] = useState<number>(1);

  const { messages, showMessage } = useMessages();

  const [user, setUser] = useRecoilState(userState);

  useEffect(() => {
    resetUserState();
    console.log('Recoil userState 초기화 완료');
  }, []);

  useEffect(() => {
    const roomId = user.roomId;
    if (roomId !== null) {
      // GameReady 페이지로 이동
      navigate(`/game-ready/${roomId}`);
    }
  }, [user.nickname]);

  useEffect(() => {
    // 게임 유형이 변경될 때, maxUserCount 초기화
    if (gameType === 'TEAM_VS_TEAM') {
      setMaxUserCount(2); // 기본값 2 vs 2
    } else if (gameType === 'ONE_TO_MANY') {
      setMaxUserCount(99); // 기본값 99
    } else if (gameType === 'FREE_FOR_ALL') {
      setMaxUserCount(1); // 기본값 1명 이상
    }
  }, [gameType]);

  // 방 생성 함수
  const handleCreateRoom = async () => {
    if (!inputNickname || !inputNickname.trim()) {
      showMessage('닉네임을 작성해 주세요');
      return;
    }

    if(clickCountScale < 1){
      showMessage('클릭 배율은 1보다 큰 값을 작성해 주세요');
      return;
    }

    try {
      const createdRoomId = await createRoom(gameType, inputNickname, gameTime, maxUserCount, clickCountScale);
      console.log('Room created with ID:', createdRoomId);

      // Recoil(userState) 상태에 roomId 업데이트
      setUser((prev) => ({ ...prev, nickname: inputNickname, roomId: createdRoomId }));
    } catch (error: any) {
      console.error('Error creating room:', error.message);
      showMessage('방 생성에 실패했습니다.');
    }
  };


  return (
    <>
      <MessageModal messages={messages} />
      <div className="flex z-10 flex-col justify-center items-center mt-10 md-10 bg-slate-50 bg-opacity-0 text-white p-6">
        <div className="bg-gray-700 rounded-xl max-w-100 w-2/5 min-w-80 h-5/6 p-10 shadow-floating">
          <div className="flex justify-center">
            <span className="text-2xl text-white font-bold mb-6">⚙️ 게임 설정</span>
          </div>

          {/* 닉네임 설정 */}
          <div className="mb-4">
            <label htmlFor="nickname" className="block text-lg font-semibold mb-2">
              닉네임
            </label>
            <input
              id="nickname"
              value={inputNickname}
              onChange={(e) => setInputNickname(e.target.value)}
              placeholder="닉네임을 입력하세요"
              className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          {/* 게임 유형 선택 */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">게임 유형</h3>
            {['ONE_TO_ONE', 'ONE_TO_MANY', 'TEAM_VS_TEAM', 'FREE_FOR_ALL'].map((type) => (
              <div key={type} className="flex items-center mb-3">
                <input
                  type="radio"
                  id={type}
                  value={type}
                  checked={gameType === type}
                  onChange={() => setGameType(type as any)}
                  className="mr-2 "
                />
                <label htmlFor={type} className="text-lg  hover:text-orange-500">
                  {type === 'ONE_TO_ONE'
                    ? '1대1'
                    : type === 'ONE_TO_MANY'
                      ? '일대다'
                      : type === 'TEAM_VS_TEAM'
                        ? '팀 대 팀'
                        : '개인전'}
                </label>
              </div>
            ))}
          </div>

          {/* 게임 시간 선택 */}
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">게임 시간</label>
            <select
              value={gameTime}
              onChange={(e) => setGameTime(Number(e.target.value))}
              className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value={10}>10초</option>
              <option value={30}>30초</option>
              <option value={60}>60초</option>
            </select>
          </div>

          {/* 최대 사용자 수 설정 */}
          {gameType === 'ONE_TO_MANY' && (
            <div className="mb-6">
              <label className="block text-lg font-semibold mb-2">
                다수 팀의 기본 인원 수 (1 대 N)
              </label>
              <input
                type="number"
                value={99}
                disabled
                className="w-full p-3 bg-gray-800 text-gray-500 border border-gray-700 rounded-md cursor-not-allowed"
              />
              <small className="text-gray-500 block mt-2">
                다수 팀의 기본 인원 수는 99명으로 고정되어 있습니다.
              </small>
              <label className="block text-lg font-semibold mt-4 mb-2">1팀의 클릭 배율</label>
              <input
                value={clickCountScale}
                onChange={(e) => setClickCountScale(Number(e.target.value))}
                className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <small className="text-gray-500 block mt-2">
                클릭 배율은 1보다 작을 수 없습니다.
              </small>
            </div>
          )}

          {gameType === 'FREE_FOR_ALL' && (
            <div className="mb-6">
              <label className="block text-lg font-semibold mb-2">참가자 수</label>
              <input
                min="1"
                value={maxUserCount}
                onChange={(e) => setMaxUserCount(Number(e.target.value))}
                className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="참가자 수를 입력하세요"
              />
              <small className="text-gray-500 block mt-2">
                개인전에 참가할 인원 수를 입력하세요.
              </small>
            </div>
          )}

          {gameType === 'TEAM_VS_TEAM' && (
            <div className="mb-6">
              <label className="block text-lg font-semibold mb-2">
                팀 대 팀 (2 vs 2, 3 vs 3, 4 vs 4)
              </label>
              <select
                value={maxUserCount}
                onChange={(e) => setMaxUserCount(Number(e.target.value))}
                className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value={2}>2 vs 2</option>
                <option value={3}>3 vs 3</option>
                <option value={4}>4 vs 4</option>
              </select>
              <small className="text-gray-500 block mt-2">
                팀 대 팀 형식의 게임에서 팀 당 최대 인원 수를 선택하세요.
              </small>
            </div>
          )}

          {/* 방 생성 버튼 */}
          <button onClick={handleCreateRoom} className="basic-button">
            방 생성
          </button>
        </div>
      </div>
    </>
  );
};

export default GameSetting;
