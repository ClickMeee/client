import Button, { ButtonType } from '../../components/button/Button';
import * as styled from './Home.style';

export default function Home() {
  const roomId = '1234';

  type ButtonProps = {
    text: string;
    type: ButtonType;
    link: string;
    onClick: () => void;
  };

  const buttonProps: ButtonProps = {
    text: 'Game Start',
    type: 'start',
    link: `/game/${roomId}`,
    onClick: () => console.log('Navigating to Game'),
  };

  return (
    <styled.HomeWrapper>
      <h1>Home</h1>
      <Button {...buttonProps} />
    </styled.HomeWrapper>
  );
}
