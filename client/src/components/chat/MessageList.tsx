import React, { useEffect, useRef } from 'react';
import type { ChatMessage } from '../../types/chat.types';
import { TypingIndicator } from './TypingIndicator.tsx';
import { MessageBubble } from "./MessageBubble.tsx";

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when messages change or loading state changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50 dark:bg-gray-900/50">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">How can I help you today?</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Send a message to start the conversation.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50 dark:bg-gray-900/50 scroll-smooth">
      {messages.map((message, index) => (
        <MessageBubble key={index} message={message} />
      ))}

      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 dark:border-gray-700 p-4">
            <TypingIndicator />
          </div>
        </div>
      )}
      <div ref={bottomRef} className="h-1" />
    </div>
  );
};
