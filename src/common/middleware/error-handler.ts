import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { NotFound } from "http-errors";

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

  if (err instanceof NotFound) {
    return res.status(404).json({
      message: err.message || 'Resource not found',
    });
  }

  console.log('EEEEE', err)
  return res.status(500).json({
    message: err.message ?? 'Internal server error',
  });
};
