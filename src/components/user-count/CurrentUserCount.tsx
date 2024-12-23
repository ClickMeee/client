import { useEffect, useState } from "react";
import { ReadCurrentUserCount } from "../../api/ReadCurrentUserCount.ts";

const CurrentUserCount = () =>{
  const [userCount, setUserCount] = useState<number | null>(null);
  const interval = 5000;

  const fetchCurrentUserCount = async () => {
    try {
      setUserCount(await ReadCurrentUserCount());
    } catch (error) {
      console.error("Failed to fetch user count:", error);
    }
  };

  useEffect(() => {
    fetchCurrentUserCount(); // 첫 실행
    const polling = setInterval(fetchCurrentUserCount, interval);

    return () => {
      clearInterval(polling); // 컴포넌트 언마운트 시 polling 중단
    };
  }, [interval]);

  return (
    <div className="w-1/7 transition-all fixed hidden lg:block top-32 left-12">
      <span
        className={`bg-gray-700 left-4 text-white p-5 rounded-xl shadow-floating ${
          userCount !== null ? "opacity-100" : "opacity-0"
        }`}
      >
        🐥 현재 접속자 수 : {userCount}
      </span>
    </div>
  );
}

export default CurrentUserCount;