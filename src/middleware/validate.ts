import { type Request, type Response, type NextFunction } from 'express';
import { AppError } from '../utils/appError.js';
import { type ZodType } from 'zod/v4';

export const validate =
  (schema: ZodType, source = 'body') =>
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
