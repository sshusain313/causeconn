import { Request, Response, NextFunction } from 'express';
import ApiPartner, { IApiPartner } from '../models/ApiPartner';

declare global {
  namespace Express {
    interface Request {
      apiPartner?: IApiPartner;
    }
  }
}

export const authenticateApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get API key from header or query parameter
    const apiKey = req.headers['x-api-key'] as string || 
                   req.headers['api-key'] as string ||
                   req.query.apiKey as string;

    if (!apiKey) {
      res.status(401).json({
        error: 'API key required',
        message: 'Please provide an API key in the X-API-Key header or apiKey query parameter'
      });
      return;
    }

    // Find partner by API key
    const partner = await ApiPartner.findOne({ 
      apiKey,
      isActive: true 
    });

    if (!partner) {
      res.status(401).json({
        error: 'Invalid API key',
        message: 'The provided API key is invalid or inactive'
      });
      return;
    }

    // Update last used timestamp
    partner.lastUsedAt = new Date();
    await partner.save();

    // Attach partner to request
    req.apiPartner = partner;
    next();
  } catch (error) {
    console.error('API key authentication error:', error);
    res.status(500).json({
      error: 'Authentication failed',
      message: 'An error occurred during API key validation'
    });
  }
};