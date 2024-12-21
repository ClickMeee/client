import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { gameState } from "../../recoil/atoms/gameState";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { RoomDataProps } from "../../types/RoomData.type.ts";

// Chart.js 모듈 등록
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TeamChart: React.FC = () => {
  const game = useRecoilValue<RoomDataProps | null>(gameState);
  const [timeLabels, setTimeLabels] = useState<string[]>([]); // X축 레이블 상태
  const [teamScores, setTeamScores] = useState<{ [key: string]: number[] }>({}); // 팀 점수 저장

  useEffect(() => {
    if (game?.currentTime !== undefined && game?.teams) {
      // X축 레이블에 현재 시간을 추가
      setTimeLabels((prev) => [...prev, `${game.currentTime}s`]);

      // 게임 타입별로 다르게 처리
      if (game?.gameType === 'FREE_FOR_ALL') {
        const updatedScores = { ...teamScores };
        // team.users에서 각 사용자의 클릭 수 합산
        game.teams[0].users.forEach((user) => {
          if (!updatedScores[user.nickname]) {
            updatedScores[user.nickname] = [];
          }
          updatedScores[user.nickname].push(user.clickCount);
        });
        setTeamScores(updatedScores);
      } else{
        // 팀별 클릭 수 합산
        const updatedScores = { ...teamScores };
        game.teams.forEach((team) => {
          const totalClicks = team.teamScore
          if (!updatedScores[team.teamName]) {
            updatedScores[team.teamName] = [];
          }
          updatedScores[team.teamName].push(totalClicks);
        });

        setTeamScores(updatedScores);
      }
    }
  }, [game?.currentTime]); // currentTime

  // 차트 데이터 설정
  const chartData = {
    labels: timeLabels, // X축 레이블
    datasets: Object.keys(teamScores).map((teamName, index) => ({
      label: teamName,
      data: teamScores[teamName],
      borderColor: `hsl(${(index * 360) / game!.teams.length}, 70%, 50%)`, // 동적 색상 설정
      backgroundColor: `hsla(${(index * 360) / game!.teams.length}, 70%, 50%, 0.2)`,
      tension: 0.4,
    })),
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

  return (
    <div className="relative w-full h-full">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default TeamChart;
