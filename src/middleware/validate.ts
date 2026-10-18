import { type Request, type Response, type NextFunction } from 'express';
import { AppError } from '../utils/appError.js';
import { ZodSchema } from 'zod/v3';

export const validate =
  (schema: ZodSchema, source = 'body') =>
  (req: Request, _res: Response, next: NextFunction) => {
    const requestData = req as unknown as Record<string, unknown>;
    const result = schema.safeParse(requestData[source]);
    if (!result.success) {
      return next(
        AppError.badRequest('Validation failed', result.error.issues)
      );
    }
    requestData[source] = result.data;
    next();
  };
