import axios from 'axios';
import type { ChatRequest, ChatResponse, ApiResponse } from '../types/chat.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface SentinelConfig {
  apiKey: string;
  applicationId: string;
}

/**
 * Returns the Sentinel credentials stored in sessionStorage.
 */
const getSentinelHeaders = (): Record<string, string> => {
  const apiKey = sessionStorage.getItem('sentinel_api_key') || '';
  const applicationId = sessionStorage.getItem('sentinel_application_id') || '';

  const headers: Record<string, string> = {};
  if (apiKey) headers['X-API-Key'] = apiKey;
  if (applicationId) headers['X-Application-Id'] = applicationId;
  return headers;
};

export const chatApi = {
  sendMessage: async (request: ChatRequest): Promise<ChatResponse> => {
    const response = await apiClient.post<ApiResponse<ChatResponse>>('/chat', request, {
      headers: getSentinelHeaders(),
    });
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to send message');
    }
    return response.data.data;
  },
  
  getConversations: async (): Promise<any[]> => {
    const response = await apiClient.get<ApiResponse<any[]>>('/conversations');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch conversations');
    }
    return response.data.data;
  },

  getConversation: async (id: string): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>(`/conversations/${id}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch conversation');
    }
    return response.data.data;
  },

  checkHealth: async (): Promise<boolean> => {
    try {
      const response = await apiClient.get<ApiResponse<any>>('/health');
      return response.data.success;
    } catch {
      return false;
    }
  }
};
