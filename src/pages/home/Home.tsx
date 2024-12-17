import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { createRoom } from '../../api/CreateRoom';
import Modal from '../../components/modal/Modal';
import { userState } from '../../recoil/atoms/userState';
import { CreateRoomGenerator } from '../../types/CreateRoom.type';
import { RoomDataProps } from '../../types/RoomData.type';

const Home = () => {
  const resetUserState = useResetRecoilState(userState);
  const navigate = useNavigate();
  const [inputNickname, setInputNickname] = useState<string>('');
  const [gameTime, setGameTime] = useState<number>(10);
  const [messages, setMessages] = useState<{ id: string; text: string; show: boolean }[]>([]);
  const [gameType, setGameType] = useState<
    'ONE_TO_ONE' | 'ONE_TO_MANY' | 'TEAM_VS_TEAM' | 'FREE_FOR_ALL'
  >('ONE_TO_ONE');
  const [teamCount, setTeamCount] = useState<number>(2);

  // 개인전 팀 수 선택
  const [freeForAllCount, setFreeForAllCount] = useState<number>(2);

  // Recoil 상태: nickname 및 roomId 관리
  const [user, setUser] = useRecoilState(userState);

  // 개인전 팀수 선택 (.map())
  const freeForAllValue = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];


  // Home 컴포넌트 진입 시 recoil 유저 상태 초기화
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
    if (!inputNickname || !inputNickname.trim()) {
      showMessage('닉네임을 작성해 주세요');
      return; // 닉네임이 없으면 방 생성 요청 중단
    }

    try {
      const roomData: RoomDataProps = CreateRoomGenerator.makeRoom(

      )
      const createdRoomId = await createRoom(gameType, inputNickname, gameTime);
      console.log('Room created with ID:', createdRoomId);

      // Recoil(userState) 상태에 roomId 업데이트
      setUser((prev) => ({ ...prev, nickname: inputNickname, roomId: createdRoomId }));
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

          {/* 팀 스케일 설정 */}
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">팀별 클릭 배율</label>

            {
              Array.from(Array(teamCount), (value, index) => {
                const teamId = index + 1;
                return <>
                  <label className="p-0 mb-0 block text-sm font-semibold">{teamId}팀</label>
                  <input
                    id=""
                    value={inputNickname}
                    onChange={(e) => setInputNickname(e.target.value)}
                    placeholder={`${teamId}팀의 클릭 배율을 입력하세요`}
                    className="w-full p-2 mb-2 bg-gray-900 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </>
              })
            }

          </div>



          {/* 일대일 게임 선택시, 옵션 */}
          {
            gameType === 'ONE_TO_ONE' ?
              <div>

              </div> : <></>
          }


          {/* 일대 다 게임시, 옵션 */}
          {gameType === 'ONE_TO_MANY' ?
            <div className=''>
              일대다
            </div> : <></>
          }
          {/* 다대 다 게임시, 옵션 */}
          {gameType === 'TEAM_VS_TEAM' ?
            <div className=''>
              다대다
            </div> : <></>
          }

          {/* 개인전 선택시, 옵션 */}
          {gameType === 'FREE_FOR_ALL' ?
            <div className='mb-10'>
              <div className='text-center mb-3 text-xl'>개인전 옵션</div>
              <div className='text-lg mb-2'>최대 인원 수</div>
              <select
                value={freeForAllCount}
                onChange={(c) => { setFreeForAllCount(Number(c.target.value)) }}
                className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {
                  freeForAllValue.map((value, index) => {
                    return <option value={value}>{value}팀</option>
                  })
                }
              </select>



            </div> : <></>
          }

          {/* 방 생성 버튼 */}
          <button
            onClick={handleCreateRoom}
            className="w-full py-3 m-2 bg-orange-500 border-white hover:border-opacity-100 border-2 border-opacity-0 text-white rounded-md duration-300 hover:shadow-floating hover:-translate-y-1 hover:-translate-x-0.5 transition-all hover:bg-orange-500"
          >
            방 생성
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
