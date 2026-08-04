import React from 'react';
import type { ChatMessage } from '../../types/chat.types';
import { User, Bot } from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`flex max-w-[80%] md:max-w-[70%] space-x-3 ${
          isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'
        }`}
      >
        {/* Avatar */}
        <div className="flex-shrink-0 mt-1">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isUser
                ? 'bg-blue-600 text-white'
                : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400'
            }`}
          >
            {isUser ? <User size={16} /> : <Bot size={16} />}
          </div>
        </div>

        {/* Message Content */}
        <div
          className={`flex flex-col p-4 rounded-2xl shadow-sm whitespace-pre-wrap leading-relaxed ${
            isUser
              ? 'bg-blue-600 text-white rounded-tr-sm'
              : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-tl-sm'
          }`}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
};
