import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Conflict, NotFound, Unauthorized } from "http-errors";

export const errorHandler = (
  err: any,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  if (err instanceof ZodError) {
    return res.status(500).json({
      message: 'Validation error',
      errors: err.issues,
    });
  }

  if (err instanceof NotFound) {
    return res.status(404).json({
      message: err.message || 'Resource not found',
    });
  }

  if (err instanceof Unauthorized) {
    return res.status(401).json({
      message: err.message || 'Unauthorized',
    });
  }

  if (err instanceof Conflict) {
    return res.status(409).json({
      message: err.message || 'Conflict error',
    })
  }

  return res.status(500).json({
    message: err.message ?? 'Internal server error',
  });
};
