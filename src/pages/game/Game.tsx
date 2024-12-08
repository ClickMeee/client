import Button, { ButtonType } from '../../components/button/Button';
import * as styled from './Game.style';

export default function Game() {
  const user = [
    {
      name: 'sang',
    },
    { name: 'sang2' },
    { name: 'sang3' },
    { name: 'sang4' },
  ];

  type ButtonProps = {
    text: string;
    type: ButtonType;
    onClick: () => void;
  };

  const buttonProps: ButtonProps = {
    text: 'Click me',
    type: 'click',
    onClick: () => console.log('Button clicked'),
  };

  return (
    <styled.GameWrapper>
      <h1>Game</h1>

      <Button {...buttonProps} />
    </styled.GameWrapper>
  );
}
