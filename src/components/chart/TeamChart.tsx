import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { gameState} from "../../recoil/atoms/gameState";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { RoomDataProps } from "../../types/RoomData.type.ts";

// Chart.js 모듈 등록
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TeamChart: React.FC = () => {
  const game = useRecoilValue<RoomDataProps | null>(gameState);
  const [team1Scores, setTeam1Scores] = useState<number[]>([]);
  const [team2Scores, setTeam2Scores] = useState<number[]>([]);
  const [timeLabels, setTimeLabels] = useState<string[]>([]); // X축 레이블 상태

  useEffect(() => {
    if (game?.currentTime !== undefined) {
      // X축 레이블에 현재 시간을 추가
      setTimeLabels((prev) => [...prev, `${game.currentTime}s`]);

      // 1팀과 2팀 점수를 배열에 추가
      setTeam1Scores((prev) => [...prev, game.teams[0].teamScore]);
      setTeam2Scores((prev) => [...prev, game.teams[1].teamScore]);
    }
  }, [game?.currentTime]); // currentTime이 변경될 때마다 실행

  // 차트 데이터 설정
  const chartData = {
    labels: timeLabels, // X축 레이블
    datasets: [
      {
        label: game?.teams[0]?.teamName || "1팀",
        data: team1Scores,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
      {
        label: game?.teams[1]?.teamName || "2팀",
        data: team2Scores,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
      },
    ],
  };

  // 차트 옵션 설정
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Click Score Chart",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time (s)",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Team Click Score",
        },
      },
    },
  };

  return <Line data={chartData} options={chartOptions} />;
};

export default TeamChart;
