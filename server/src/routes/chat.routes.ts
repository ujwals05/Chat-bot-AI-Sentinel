import { Router, Request, Response } from 'express';
import { handleChat, getConversations, getConversation } from '../controllers/chat.controller.js';

const router = Router();

// Health Check
router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Server is healthy',
  });
});

// Chat Endpoints
router.post('/chat', handleChat);
router.get('/conversations', getConversations);
router.get('/conversations/:id', getConversation);

export default router;
