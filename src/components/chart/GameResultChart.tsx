import React, { useEffect, useState, useRef } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import confetti from 'canvas-confetti';

// Chart.js 모듈 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function firework() {
  const duration = 5000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 25, spread: 360, ticks: 50, zIndex: 100 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  let interval = setInterval(function () {
    let timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    let particleCount = 50 * (timeLeft / duration);
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
    );
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    );
  }, 250);
}

const GameResultChart: React.FC = () => {
  const [isChartReached, setIsChartReached] = useState<boolean>(false);
  const chartRef = useRef<any>(null);

  // 목표 데이터 (예: 팀 점수)
  const finalScores = {
    TeamA: 50,
    TeamB: 70,
  };

  // 초기 데이터 상태
  const [currentScores, setCurrentScores] = useState<{ [key: string]: number }>({
    TeamA: 0,
    TeamB: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScores((prevScores) => {
        let hasUpdated = false;

        const updatedScores = Object.keys(finalScores).reduce((acc, teamName) => {
          const currentValue = prevScores[teamName];
          const targetValue = finalScores[teamName];

          if (currentValue < targetValue) {
            hasUpdated = true;
            acc[teamName] = Math.min(currentValue + 1, targetValue); // 값 1씩 증가
          } else {
            acc[teamName] = currentValue; // 값 유지
          }

          return acc;
        }, {} as { [key: string]: number });

        if (!hasUpdated) {
          clearInterval(interval); // 모든 값이 목표에 도달하면 타이머 정지
        }

        return updatedScores;
      });
    }, 50); // 업데이트 속도 (50ms)

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
  }, []);

  useEffect(() => {
    // 모든 점수가 목표에 도달했는지 확인
    const allReached = Object.keys(finalScores).every(
      (teamName) => currentScores[teamName] === finalScores[teamName]
    );

    if (allReached && !isChartReached) {
      setIsChartReached(true);
      firework(); // firework 실행
    }
  }, [currentScores, finalScores, isChartReached]);

  const chartData = {
    labels: Object.keys(finalScores), // X축 레이블
    datasets: [
      {
        label: "Team Scores",
        data: Object.values(currentScores), // 현재 값
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        borderColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Animated Bar Chart with Zoom",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Teams",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Scores",
        },
      },
    },
  };

  return (
    <div className="relative w-1/4 h-96">
      {isChartReached && firework()} {/* 상태에 따라 firework 실행 */}
      <Bar ref={chartRef} data={chartData} options={chartOptions} />
      {isChartReached && (
        <div className="fixed inset-0 flex items-center justify-center z-30">
          <div className="absolute inset-0 bg-gray-500 bg-opacity-50"></div>
        </div>
      )}
    </div>
  );
};

export default GameResultChart;
