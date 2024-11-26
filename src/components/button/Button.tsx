import * as styled from './Button.style';

type ButtonProps = {
  text: string;
};

export default function Button({ text }: ButtonProps) {
  return <styled.ButtonWrapper>{text}</styled.ButtonWrapper>;
}
