import { type Request, type Response, type NextFunction } from 'express';
import { AppError } from '../utils/appError.js';
import { type ZodType } from 'zod/v4';

type RequestSource = 'body' | 'query' | 'params';

export const validate =
  (schema: ZodType, source: RequestSource = 'body') =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const requestData = req as unknown as Record<string, unknown>;
    const result = schema.safeParse(requestData[source]);
    if (!result.success) {
      return next(
        AppError.badRequest('Validation failed', result.error.issues)
      );
    }

    if (source === 'query') {
      Object.defineProperty(req, 'query', {
        value: result.data,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    } else {
      requestData[source] = result.data;
    }

    next();
  };
