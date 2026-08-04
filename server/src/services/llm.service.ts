import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env.js';
import { ChatMessage } from '../types/chat.types.js';

class LlmService {
  private genAI: GoogleGenerativeAI;
  
  constructor() {
    this.genAI = new GoogleGenerativeAI(config.llm.apiKey);
  }

  /**
   * Generates a response from the LLM based on the conversation history.
   * Isolates the provider specifics so the rest of the app just passes generic messages.
   */
  async generateResponse(messages: ChatMessage[]): Promise<string> {
    if (!config.llm.apiKey || config.llm.apiKey === 'your_gemini_api_key_here') {
      console.warn('⚠️ No valid API key provided. Returning simulated response.');
      return `[Simulated AI Response] I saw ${messages.length} messages. This is a placeholder since no valid API key was configured.`;
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: config.llm.model });
      
      // Convert standard messages to Gemini specific format
      // Gemini expects: { role: 'user' | 'model', parts: [{ text: string }] }
      const history = messages.slice(0, -1).map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

      const lastMessage = messages[messages.length - 1];

      const chat = model.startChat({ history });
      const result = await chat.sendMessage(lastMessage.content);
      const response = await result.response;
      
      return response.text();
    } catch (error) {
      console.error('[LlmService] Error generating response:', error);
      throw new Error('Failed to generate AI response');
    }
  }
}

export const llmService = new LlmService();
