import { useState, useCallback, } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { ChatMessage } from '../types/chat.types';
import { chatApi } from '../services/chat.api';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string>(() => uuidv4());
  const [pastConversations, setPastConversations] = useState<any[]>([]);

  const fetchConversations = useCallback(async () => {
    try {
      const data = await chatApi.getConversations();
      setPastConversations(data);
    } catch (err) {
      console.error('Failed to fetch conversations', err);
    }
  }, []);

  // Remove automatic fetch on startup as requested
  // useEffect(() => {
  //   fetchConversations();
  // }, [fetchConversations]);

  const loadConversation = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      const data = await chatApi.getConversation(id);
      setConversationId(data.conversationId);
      setMessages(data.messages);
    } catch (err: any) {
      setError(err.message || 'Failed to load conversation');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content };

    // Add user message to state immediately
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Send entire conversation history including the new message
      const currentMessages = [...messages, userMessage];
      const response = await chatApi.sendMessage({
        conversationId,
        messages: currentMessages,
      });

      // Update conversation ID if the backend generated a new one
      if (response.conversationId && response.conversationId !== conversationId) {
        setConversationId(response.conversationId);
      }

      // Add AI response to state
      setMessages((prev) => [...prev, response.message]);
      fetchConversations();
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
      // Optionally remove the user message if it failed, or leave it for retry
    } finally {
      setIsLoading(false);
    }
  }, [messages, conversationId, fetchConversations]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setConversationId(uuidv4());
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    pastConversations,
    loadConversation,
    fetchConversations,
  };
};
