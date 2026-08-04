import { Request, Response, NextFunction } from 'express';
import { chatService } from '../services/chat.service.js';
import { ChatRequest } from '../types/chat.types.js';

export const handleChat = async (
  req: Request<{}, {}, ChatRequest>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate request body
    if (!req.body.messages || !Array.isArray(req.body.messages)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request format. Expected messages array.',
      });
    }

    const response = await chatService.handleChat(req.body);

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const getConversations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const conversations = await chatService.getAllConversations();
    res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
};

export const getConversation = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const conversation = await chatService.getConversationById(req.params.id);
    res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error: any) {
    if (error.statusCode === 404) {
      return res.status(404).json({ success: false, message: error.message });
    }
    next(error);
  }
};
