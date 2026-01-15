import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from "../auth/jwt";

export interface AuthRequest extends Request {
  user?: {
    id: number;
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const token = header.split(' ')[1];
    req.user = verifyAccessToken(token);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
}
