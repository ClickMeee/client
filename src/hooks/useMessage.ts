import { useState } from 'react';

export interface Message {
  id: string;
  text: string;
  show: boolean;
}

const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  // 메시지 표시 함수
  const showMessage = (message: string) => {
    const messageId = new Date().getTime().toString(); // 고유 ID 생성
    setMessages((prevMessages) => [...prevMessages, { id: messageId, text: message, show: true }]);

    // 일정 시간 후 메시지를 숨기고 제거
    setTimeout(() => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === messageId ? { ...msg, show: false } : msg))
      );
      setTimeout(() => {
        setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== messageId));
      }, 1000); // 숨긴 후 1초 뒤 메시지 제거
    }, 3000); // 메시지를 3초간 표시
  };

  return { messages, showMessage };
};

export default useMessages;
