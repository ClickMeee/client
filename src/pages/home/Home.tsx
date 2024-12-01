import { useNavigate } from 'react-router-dom';
import { createRoom } from '../../api/CreateRoom';
import Button, { ButtonType } from '../../components/button/Button';
import { CreateRoomProps } from '../../types/CreateRoom.type';
import * as styled from './Home.style';

export default function Home() {
  const navigate = useNavigate();

  // 방 생성 함수
  const handleCreateRoom = async () => {
    const requestBody: CreateRoomProps = {
      teams: [
        {
          teamName: 'teamName',
          maxUserCount: 5,
          clickCountScale: 1.0,
        },
      ],
      gameTime: 10,
      gameType: 'ONE_TO_ONE',
      roomChief: {
        nickname: window.location.hostname, // 현재 로컬 주소를 nickname으로 사용
      },
    };

    try {
      // 방 생성 API 호출
      const roomId = await createRoom(requestBody);

      console.log('Room created with ID:', roomId);

      // 방 페이지로 이동
      navigate(`/game/${roomId}`);
    } catch (error: any) {
      console.error('Error creating room:', error.message);
      alert('방 생성에 실패했습니다.');
    }
  };

  type ButtonProps = {
    text: string;
    type: ButtonType;
    link?: string; // 링크 이동을 위한 속성 (선택적)
    onClick?: () => void; // 버튼 클릭 시 실행할 동작 (선택적)
  };

  // 버튼 속성
  const buttonProps: ButtonProps = {
    text: 'Game Start',
    type: 'start',
    onClick: handleCreateRoom,
  };

  return (
    <styled.HomeWrapper>
      <h1>Home</h1>
      <Button {...buttonProps} />
    </styled.HomeWrapper>
  );
}
