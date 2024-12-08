import { useNavigate } from 'react-router-dom';
import * as styled from './Button.style';

export type ButtonType = 'common' | 'start' | 'click';

type ButtonProps = {
  text: string;
  type: ButtonType;
  link?: string; // 링크 이동을 위한 속성 (선택적)
  onClick?: () => void; // 버튼 클릭 시 실행할 동작 (선택적)
};

export default function Button({ text, type, link, onClick }: ButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(); // 추가 동작 수행
    }
    if (link) {
      navigate(link); // 링크로 이동
    }
  };

  return (
    <styled.ButtonWrapper buttonType={type} onClick={handleClick}>
      {text}
    </styled.ButtonWrapper>
  );
}
