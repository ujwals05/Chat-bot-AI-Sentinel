import axios, { AxiosInstance } from 'axios';
import { config } from '../../config/env.js';
import type { SentinelIngestionPayload, SentinelIngestionResult } from './sentinel.types.js';

class SentinelClient {
  private client: AxiosInstance | null = null;

  constructor() {
    if (config.sentinel.enabled && config.sentinel.ingestUrl && config.sentinel.apiKey) {
      this.client = axios.create({
        baseURL: config.sentinel.ingestUrl.replace(/\/ingest\/?$/, ''),
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': config.sentinel.apiKey,
        },
        timeout: 5000,
      });
    }
  }

  async sendIngestion(
    payload: SentinelIngestionPayload,
    idempotencyKey: string
  ): Promise<SentinelIngestionResult | null> {
    if (!this.client) {
      console.warn('[SentinelClient] Client is not configured. Check SENTINEL_* env vars.');
      return null;
    }

    const response = await this.client.post<{ data: SentinelIngestionResult }>(
      '/ingest',
      payload,
      {
        headers: {
          'Idempotency-Key': idempotencyKey,
        },
      }
    );

    return response.data.data;
  }
}

export const sentinelClient = new SentinelClient();
