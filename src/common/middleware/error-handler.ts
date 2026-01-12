import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (
  err: any,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation error',
      errors: err.issues,
    });
  }

  return res.status(500).json({
    message: err.message ?? 'Internal server error',
  });
};
