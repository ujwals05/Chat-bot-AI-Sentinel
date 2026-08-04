import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env.js';
import { notFoundHandler } from './middleware/not-found.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';

// We will import and use chat routes later
import chatRoutes from './routes/chat.routes.js';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5175',
      'http://localhost:5176',
      config.clientUrl
    ],
    methods: ['GET', 'POST'],
    credentials: true
  })
);

// Body parsing middleware
app.use(express.json());

// Logging middleware
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Routes
app.use('/api/v1', chatRoutes);

// 404 Handler
app.use(notFoundHandler);

// Error Handler
app.use(errorHandler);

export default app;
