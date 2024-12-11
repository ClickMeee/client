import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { createRoom } from '../../api/CreateRoom';
import Modal from '../../components/modal/Modal';
import { userState } from '../../recoil/atoms/userState';

const Home = () => {
  const resetUserState = useResetRecoilState(userState);

  // Home 컴포넌트 진입 시 recoil 유저 상태 초기화
  useEffect(() => {
    resetUserState();
    console.log('Recoil userState 초기화 완료');
  }, []);

  const navigate = useNavigate();

  // Recoil 상태: nickname 및 roomId 관리
  const [user, setUser] = useRecoilState(userState);

  // 로컬 상태: 게임 설정
  const [gameType, setGameType] = useState<
    'ONE_TO_ONE' | 'ONE_TO_MANY' | 'TEAM_VS_TEAM' | 'FREE_FOR_ALL'
  >('ONE_TO_ONE');

  // 게임 시간
  const [gameTime, setGameTime] = useState<number>(10);

  // 모달 메시지 상태
  const [messages, setMessages] = useState<{ id: string; text: string; show: boolean }[]>([]);

  // 모달 띄우기 함수
  const showMessage = (message: string) => {
    const messageId = new Date().getTime().toString();
    setMessages((prevMessages) => [...prevMessages, { id: messageId, text: message, show: true }]);
    setTimeout(() => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === messageId ? { ...msg, show: false } : msg))
      );
      setTimeout(() => {
        setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== messageId));
      }, 1000);
    }, 3000);
  };

  // 방 생성 함수
  const handleCreateRoom = async () => {
    if (!user.nickname || !user.nickname.trim()) {
      showMessage('닉네임을 작성해 주세요');
      return; // 닉네임이 없으면 방 생성 요청 중단
    }

    try {
      const createdRoomId = await createRoom(gameType, user.nickname, gameTime);
      console.log('Room created with ID:', createdRoomId);

      // Recoil(userState) 상태에 roomId 업데이트
      setUser((prev) => ({ ...prev, roomId: createdRoomId }));

      // Game 컴포넌트로 이동
      navigate(`/game/${createdRoomId}`);
    } catch (error: any) {
      console.error('Error creating room:', error.message);
      alert('방 생성에 실패했습니다.');
    }
  };

  return (
    <>
      <Modal messages={messages}></Modal>
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
              value={user.nickname || ''}
              onChange={(e) => setUser((prev) => ({ ...prev, nickname: e.target.value }))}
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
                  className="mr-2 hover:-translate-y-0.5 hover:-translate-x-0.5"
                />
                <label
                  htmlFor={type}
                  className="text-lg hover:-translate-y-0.5 hover:-translate-x-0.5 hover:text-orange-500"
                >
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

          {/* 방 생성 버튼 */}
          <button
            onClick={handleCreateRoom}
            className="w-full py-3 bg-orange-500 text-white rounded-md duration-300 hover:shadow-floating hover:-translate-y-1 hover:-translate-x-0.5 transition-all"
          >
            방 생성
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
