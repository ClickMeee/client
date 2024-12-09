/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        'custom-bottom': '0 4px 6px -1px rgba(0, 0, 0, 0.1)', // 하단 그림자
        'custom-strong-bottom': '0 8px 15px rgba(0, 0, 0, 0.2)', // 더 강한 하단 그림자
        'floating': '0 10px 15px rgba(0, 0, 0, 0.1), 10px 8px 5px rgba(0, 0, 0, 0.5)',
      },

      animation: {
        'move-bg': 'moveBackground 5s linear infinite', // 사용자 정의 애니메이션
      },
      keyframes: {
        moveBackground: {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(-60px, -60px)' },
        },
      },
      
      backgroundSize: {
        'pattern': '60px 60px', // 패턴 크기
      },
      backgroundImage: {
        'background-pattern': "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><text x=\"10\" y=\"50\" font-size=\"50\">🐹</text></svg>')",
      },
      cursor: {
        'snow': "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><text x=\"3\" y=\"12\" font-size=\"10\">❄️</text></svg>') 8 8, auto",
      },
    },
  },
  plugins: [],
}
