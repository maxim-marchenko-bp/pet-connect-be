import { ZodObject } from "zod";
import { NextFunction, Request, Response } from "express";

export const validate =
  (schema: ZodObject) =>
    (req: Request, _: Response, next: NextFunction) => {
      try {
        req.body = schema.parse(req.body);
        next();
      } catch (error) {
        return next(error);
      }
    };
