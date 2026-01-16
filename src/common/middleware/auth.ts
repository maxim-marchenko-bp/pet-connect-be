import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from "../auth/token.utils";

export interface AuthRequest extends Request {
  user?: {
    id: number;
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    req.user = verifyAccessToken(accessToken);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
}
