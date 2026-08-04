import React, { useState, useCallback } from 'react';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { SentinelConfig } from './SentinelConfig';
import { Bot, Trash2 } from 'lucide-react';

interface ChatWindowProps {
  chatState: {
    messages: any[];
    isLoading: boolean;
    error: string | null;
    sendMessage: (content: string) => Promise<void>;
    clearChat: () => void;
  };
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ chatState }) => {
  const { messages, isLoading, error, sendMessage, clearChat } = chatState;
  const [isConfigured, setIsConfigured] = useState(false);

  const handleConfigured = useCallback((configured: boolean) => {
    setIsConfigured(configured);
  }, []);

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-300">
            <Bot size={24} />
          </div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">AI Assistant</h1>
        </div>
        <button
          onClick={clearChat}
          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 rounded-full transition-colors"
          title="Clear conversation"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Sentinel Configuration */}
      <SentinelConfig onConfigured={handleConfigured} />

      {/* Error Banner */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 text-sm text-center border-b border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      {/* Messages */}
      <MessageList messages={messages} isLoading={isLoading} />

      {/* Input — disabled until Sentinel credentials are configured */}
      <ChatInput onSend={sendMessage} disabled={isLoading || !isConfigured} />

      {/* Validation message when not configured */}
      {!isConfigured && (
        <div className="px-4 pb-3 -mt-1">
          <p className="text-xs text-amber-600 dark:text-amber-400 text-center">
            Please configure your Sentinel API Key and Application ID above to start chatting.
          </p>
        </div>
      )}
    </div>
  );
};
