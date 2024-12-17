import Header from '../components/header/Header';
import Router from '../routes/Router';
import HamsterBackground from '../style/background/HamsterBackground';

export default function Layout() {
  return (
    <div className='flex flex-col h-screen'>
      <Header />
      <HamsterBackground></HamsterBackground>
      <main className='flex-1 overflow-auto'>
        <Router />
      </main>
    </div>
  );
}
