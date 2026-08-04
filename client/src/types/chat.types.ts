export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatRequest {
  conversationId?: string;
  messages: ChatMessage[];
}

export interface ChatResponse {
  conversationId: string;
  message: ChatMessage;
  model: string;
  provider: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
