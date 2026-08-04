import React from 'react';
import { MessageSquare, Plus, RefreshCw } from 'lucide-react';

interface SidebarProps {
  pastConversations: any[];
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onFetchConversations: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  pastConversations, 
  onSelect, 
  onNewChat,
  onFetchConversations 
}) => {
  return (
    <div className="w-64 bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col h-full flex-shrink-0">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">Past Chats</h2>
        <div className="flex items-center space-x-1.5">
          <button
            onClick={onFetchConversations}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-md transition-colors"
            title="Fetch Conversations"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={onNewChat}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-md transition-colors"
            title="New Chat"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {pastConversations.length === 0 ? (
          <div className="text-center mt-6 px-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Chats are not loaded automatically.</p>
            <button
              onClick={onFetchConversations}
              className="text-xs px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium shadow-sm"
            >
              Fetch Previous Chats
            </button>
          </div>
        ) : (
          pastConversations.map((conv) => {
            const firstMsg = conv.messages?.[0]?.content || 'Empty Conversation';
            const snippet = firstMsg.substring(0, 30) + (firstMsg.length > 30 ? '...' : '');
            
            return (
              <button
                key={conv.conversationId}
                onClick={() => onSelect(conv.conversationId)}
                className="w-full text-left p-3 mb-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center space-x-3 group"
              >
                <MessageSquare size={18} className="text-gray-400 group-hover:text-blue-500 flex-shrink-0" />
                <div className="truncate text-sm text-gray-700 dark:text-gray-300">
                  {snippet}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
