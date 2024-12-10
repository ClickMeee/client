import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  // TODO: 개발 끝나면 StrictMode 다시 활성화하기
  // <StrictMode>
    <App />
  // </StrictMode>
);
