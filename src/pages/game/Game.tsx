import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { gameState, GameState } from "../../recoil/atoms/gameState";
import { oneVsOneWebSocket } from "../../services/OneVsOneWebSocket";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Chart.js 모듈 등록
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Game = () => {
  const game = useRecoilValue<GameState | null>(gameState);

  // 이전 점수 및 시간 데이터를 관리하는 상태
  const [team1Scores, setTeam1Scores] = useState<number[]>([]);
  const [team2Scores, setTeam2Scores] = useState<number[]>([]);
  const [timeLabels, setTimeLabels] = useState<string[]>([]);

  // 데이터를 주기적으로 업데이트
  useEffect(() => {
    if (game?.currentTime !== undefined) {
      // 현재 초를 X축에 추가
      setTimeLabels((prev) => [...prev, `${game.currentTime}s`]);

      // 팀 점수를 업데이트
      setTeam1Scores((prev) => [...prev, game.teams[0].teamScore]);
      setTeam2Scores((prev) => [...prev, game.teams[1].teamScore]);
    }
  }, [game?.currentTime]); // `currentTime`이 변경될 때마다 실행

  // 차트 데이터 설정
  const chartData = {
    labels: timeLabels, // X축: 시간
    datasets: [
      {
        label: game?.teams[0]?.teamName || "1팀", // 1팀 이름
        data: team1Scores, // 1팀 점수 배열
        borderColor: "rgba(75, 192, 192, 1)", // 청록색 선
        backgroundColor: "rgba(75, 192, 192, 0.2)", // 청록색 배경
        tension: 0.4,
      },
      {
        label: game?.teams[1]?.teamName || "2팀", // 2팀 이름
        data: team2Scores, // 2팀 점수 배열
        borderColor: "rgba(255, 99, 132, 1)", // 빨간색 선
        backgroundColor: "rgba(255, 99, 132, 0.2)", // 빨간색 배경
        tension: 0.4,
      },
    ],
  };

  // 차트 옵션 설정
  const chartOptions = {
    responsive: true, // 반응형 설정
    plugins: {
      legend: {
        position: "top" as const, // 범례 위치
      },
      title: {
        display: true, // 제목 표시 여부
        text: "Real-Time Team Scores", // 제목 텍스트
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time (s)", // X축 제목
        },
      },
      y: {
        beginAtZero: true, // Y축 0부터 시작
        title: {
          display: true,
          text: "Score", // Y축 제목
        },
      },
    },
  };

  const handleButtonClick = () => {
    oneVsOneWebSocket.sendClickEvent(); // WebSocket으로 클릭 이벤트 전송
  };

  return (
    <div className="flex flex-col items-center justify-center w-11/12 h-11/12 m-12 p-4 bg-white">
      {/* 차트 표시 div */}
      <div className="w-3/4 h-1/2">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* 팀 정보 */}
      <div>{game?.teams[0].teamName} : {game?.teams[0].users[0]?.clickCount || 0}</div>
      <div>{game?.teams[1].teamName} : {game?.teams[1].users[0]?.clickCount || 0}</div>

      {/* 클릭 버튼 */}
      <div>
        <button
          className="bg-green-400 w-64 h-16 text-xl font-bold rounded-lg hover:bg-green-500"
          onClick={handleButtonClick}>
          Click Mee!
        </button>
      </div>
    </div>
  );
};

export default Game;
