import { ChatRequest, ChatResponse, ChatMessage } from '../types/chat.types.js';
import { llmService } from './llm.service.js';
import { config } from '../config/env.js';
import { sentinelService } from '../integrations/sentinel/sentinel.service.js';
import type { SentinelCredentials } from '../integrations/sentinel/sentinel.service.js';
import crypto from 'crypto';

interface InMemoryConversation {
  conversationId: string;
  messages: ChatMessage[];
  updatedAt: Date;
}

class ChatService {
  private conversations = new Map<string, InMemoryConversation>();

  async handleChat(request: ChatRequest, sentinelCredentials: SentinelCredentials): Promise<ChatResponse> {
    const { messages: incomingMessages, conversationId: existingId } = request;
    
    // Generate a conversation ID if one is not provided
    const conversationId = existingId || crypto.randomUUID();

    if (!incomingMessages || incomingMessages.length === 0) {
      throw { statusCode: 400, message: 'Messages array cannot be empty' };
    }

    // Call the isolated LLM service directly with incoming messages
    const aiResponseText = await llmService.generateResponse(incomingMessages);
    
    const aiMessage: ChatMessage = {
      role: 'assistant',
      content: aiResponseText,
    };

    // We assume the last message in the array is the new user message
    const lastUserMessage = incomingMessages[incomingMessages.length - 1];

    // Store in memory
    let conversation = this.conversations.get(conversationId);
    if (!conversation) {
      conversation = { conversationId, messages: [], updatedAt: new Date() };
      this.conversations.set(conversationId, conversation);
    }
    
    conversation.messages.push({
      role: lastUserMessage.role,
      content: lastUserMessage.content,
    });
    conversation.messages.push({
      role: aiMessage.role,
      content: aiMessage.content,
    });
    conversation.updatedAt = new Date();


    // Fire-and-forget Sentinel ingestion for observability & evaluation
    // Uses credentials provided by the client in request headers
    sentinelService.ingestInteraction({
      conversationId,
      conversationTitle: lastUserMessage.content.substring(0, 50),
      userMessage: lastUserMessage.content,
      assistantMessage: aiResponseText,
      metadata: {
        type: 'CHAT',
        model: config.llm.model,
        provider: config.llm.provider,
        environment: config.nodeEnv,
      }
    }, sentinelCredentials);

    return {
      conversationId,
      message: aiMessage,
      model: config.llm.model,
      provider: config.llm.provider,
    };
  }

  async getAllConversations() {
    return Array.from(this.conversations.values())
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .map(conv => ({
        conversationId: conv.conversationId,
        messages: conv.messages.slice(0, 1),
        updatedAt: conv.updatedAt,
      }));
  }

  async getConversationById(conversationId: string) {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) {
      throw { statusCode: 404, message: 'Conversation not found' };
    }
    return conversation;
  }
}

export const chatService = new ChatService();
