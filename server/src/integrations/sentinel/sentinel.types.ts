/**
 * Type definitions for the SISA Sentinel ingestion API.
 * Matches the contract defined in Sentinel's ingestion.schema.ts.
 */

export type SentinelMessageRole = 'USER' | 'ASSISTANT' | 'SYSTEM' | 'TOOL';

export type SentinelInteractionType = 'CHAT' | 'TEXT' | 'CODE';

export interface SentinelMessage {
  role: SentinelMessageRole;
  content: string;
}

export interface SentinelConversation {
  externalId: string;
  title?: string;
}

export interface SentinelIngestionPayload {
  conversation: SentinelConversation;
  messages: SentinelMessage[];
  metadata?: Record<string, unknown>;
}

export interface SentinelIngestionResult {
  applicationId: string;
  conversationId: string;
  externalConversationId: string;
  eventId: string;
  messageCount: number;
  status: 'INGESTED' | 'DUPLICATE';
}

export interface SentinelIngestParams {
  conversationId: string;
  conversationTitle?: string;
  userMessage: string;
  assistantMessage: string;
  metadata?: {
    type?: SentinelInteractionType;
    model?: string;
    provider?: string;
    environment?: string;
    [key: string]: unknown;
  };
}
