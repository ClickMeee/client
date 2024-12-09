import React from 'react';

interface ModalProps {
  messages: { id: string; text: string; show: boolean }[]; // show 상태 추가
}

const Modal: React.FC<ModalProps> = ({ messages }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end space-y-3">
      {messages.map((message, index) => (
        <div
          key={message.id}
          className={`bg-blue-500 text-white px-6 py-3 rounded-xl shadow-floating w-full opacity-0 max-w-xs transform transition-all duration-1000 ease-in-out ${
            message.show
              ? `opacity-100`
              : 'translate-y-[-50px] opacity-0'
          }`}
        >
          <p>{message.text}</p>
        </div>
      ))}
    </div>
  );
};

export default Modal;
