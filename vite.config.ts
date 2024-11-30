import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // global 객체에 의존하는 라이브러리 사용시 발생하는 오류 해결
  define: {
    global: {},
  },
});
