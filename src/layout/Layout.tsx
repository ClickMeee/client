import Header from '../components/header/Header';
import Router from '../routes/Router';
import HamsterBackground from '../style/background/HamsterBackground';
import * as styled from './Layout.style';

export default function Layout() {
  return (
    <div>
      <styled.LayoutWrapper>
        <Header />
        <HamsterBackground></HamsterBackground>
        <styled.ContentWrapper>
          <Router />
        </styled.ContentWrapper>
      </styled.LayoutWrapper>
    </div>
  );
}
