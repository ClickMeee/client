import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { gameState } from "../../recoil/atoms/gameState";
import { userState } from "../../recoil/atoms/userState";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { RoomDataProps } from "../../types/RoomData.type.ts";
import { RoomClientProps } from "../../types/RoomClient.type.ts";

// Chart.js 모듈 등록
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const IndividualChart: React.FC = () => {
  const game = useRecoilValue<RoomDataProps | null>(gameState);
  const user = useRecoilValue<RoomClientProps>(userState);
  const [userScores, setUserScores] = useState<number[]>([]);
  const [timeLabels, setTimeLabels] = useState<string[]>([]);

  const nickname = user.nickname;

  useEffect(() => {
    if (game?.currentTime !== undefined) {
      // 사용자가 속한 팀과 사용자 데이터 검색
      const user = game.teams
        .flatMap((team) => team.users)
        .find((user) => user.nickname === nickname);

      if (user) {
        // X축 레이블에 현재 시간을 추가
        setTimeLabels((prev) => [...prev, `${game.currentTime}s`]);

        // 사용자의 점수를 배열에 추가
        setUserScores((prev) => [...prev, user.clickCount]);
      }
    }
  }, [game?.currentTime, nickname]);

  // 차트 데이터 설정
  const chartData = {
    labels: timeLabels,
    datasets: [
      {
        label: `${nickname}'s Clicks`,
        data: userScores,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
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
        text: `Real-Time Performance of ${nickname}`,
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
          text: "Click Count",
        },
      },
    },
  };

  return <Line data={chartData} options={chartOptions} />;
};

export default IndividualChart;
