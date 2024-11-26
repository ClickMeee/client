import Button from '../../components/button/Button';
import * as styled from './Home.style';

export default function Home() {
  return (
    <styled.HomeWrapper>
      <h1>Home</h1>
      <Button text="Game Start" />
    </styled.HomeWrapper>
  );
}
