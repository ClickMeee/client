import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import Layout from './layout/Layout';
import { RecoilRoot } from 'recoil';

function App() {
  return (
    <RecoilRoot>
      <Router>
        <Layout />
      </Router>
    </RecoilRoot>
  );
}

export default App;
