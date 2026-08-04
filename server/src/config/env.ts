import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  llm: {
    apiKey: process.env.LLM_API_KEY || '',
    model: process.env.LLM_MODEL || 'gemini-1.5-flash',
    provider: process.env.LLM_PROVIDER || 'google',
  },
  monitoring: {
    enabled: process.env.MONITORING_ENABLED === 'true',
    apiUrl: process.env.MONITORING_API_URL || '',
    apiKey: process.env.MONITORING_API_KEY || '',
  },
  sentinel: {
    enabled: process.env.SENTINEL_ENABLED === 'true',
    apiKey: process.env.SENTINEL_API_KEY || '',
    applicationId: process.env.SENTINEL_APPLICATION_ID || '',
    ingestUrl: process.env.SENTINEL_INGEST_URL || '',
  },
  mongoUri: process.env.MONGODB_URI || '',
};
