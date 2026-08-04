import React from 'react';
import { ChatWindow } from './components/chat/ChatWindow';
import { Sidebar } from './components/chat/Sidebar';
import { useChat } from './hooks/useChat';

function App() {
  const chatState = useChat();

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-950 p-4 md:p-8 space-x-4">
      <Sidebar 
        pastConversations={chatState.pastConversations} 
        onSelect={chatState.loadConversation}
        onNewChat={chatState.clearChat}
        onFetchConversations={chatState.fetchConversations}
      />
      <main className="flex-1 h-full min-w-0">
        <ChatWindow chatState={chatState} />
      </main>
    </div>
  );
}

export default App;
