import React from 'react';
import { Message } from '../../hooks/useMessage';

interface ModalProps {
  messages: Message[];
}

const MessageModal: React.FC<ModalProps> = ({ messages }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end space-y-3">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`bg-orange-500 opacity-95 border-black text-white px-6 py-3 rounded-xl shadow-floating w-full opacity-0 max-w-xs transform transition-all duration-1000 ease-in-out ${
            message.show ? `opacity-100` : 'translate-y-[-100px] opacity-0'
          }`}
        >
          <p>{message.text}</p>
        </div>
      ))}
    </div>
  );
};

export default MessageModal;
