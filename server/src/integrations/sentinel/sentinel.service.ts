import crypto from 'crypto';
import { config } from '../../config/env.js';
import { sentinelClient } from './sentinel.client.js';
import type { SentinelIngestParams, SentinelIngestionPayload } from './sentinel.types.js';

class SentinelService {
  /**
   * Sends a chat interaction to SISA Sentinel for observability and evaluation.
   * This is a fire-and-forget method — it will never disrupt the main chat flow.
   */
  ingestInteraction(params: SentinelIngestParams): void {
    if (!config.sentinel.enabled) {
      return;
    }

    const idempotencyKey = `event_chat_${crypto.randomUUID()}`;

    const payload: SentinelIngestionPayload = {
      conversation: {
        externalId: params.conversationId,
        ...(params.conversationTitle && { title: params.conversationTitle }),
      },
      messages: [
        {
          role: 'USER',
          content: params.userMessage,
        },
        {
          role: 'ASSISTANT',
          content: params.assistantMessage,
        },
      ],
      ...(params.metadata && { metadata: params.metadata }),
    };

    // Fire and forget
    sentinelClient
      .sendIngestion(payload, idempotencyKey)
      .then((result) => {
        if (result) {
          console.log(
            `[SentinelService] Ingestion successful — status: ${result.status}, ` +
            `conversationId: ${params.conversationId}, idempotencyKey: ${idempotencyKey}`
          );
        }
      })
      .catch((error) => {
        console.error(
          `[SentinelService] Ingestion failed — ` +
          `conversationId: ${params.conversationId}, idempotencyKey: ${idempotencyKey}, ` +
          `error: ${error.message || error}`
        );
      });
  }
}

export const sentinelService = new SentinelService();
