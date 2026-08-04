import axios from 'axios';
import { config } from '../../config/env.js';
import type { SentinelIngestionPayload, SentinelIngestionResult } from './sentinel.types.js';

class SentinelClient {
  /**
   * Sends an ingestion payload to Sentinel using dynamically provided credentials.
   * The API key and application ID come from request headers (user-provided),
   * not from environment variables.
   */
  async sendIngestion(
    payload: SentinelIngestionPayload,
    idempotencyKey: string,
    apiKey: string
  ): Promise<SentinelIngestionResult | null> {
    const ingestUrl = config.sentinel.ingestUrl;

    if (!ingestUrl) {
      console.warn('[SentinelClient] No SENTINEL_INGEST_URL configured.');
      return null;
    }

    if (!apiKey) {
      console.warn('[SentinelClient] No API key provided in request. Skipping ingestion.');
      return null;
    }

    const baseURL = ingestUrl.replace(/\/ingest\/?$/, '');

    const response = await axios.post<{ data: SentinelIngestionResult }>(
      `${baseURL}/ingest`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
          'Idempotency-Key': idempotencyKey,
        },
        timeout: 5000,
      }
    );

    return response.data.data;
  }
}

export const sentinelClient = new SentinelClient();
