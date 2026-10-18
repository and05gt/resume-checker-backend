import {
  type Request,
  type Response,
  type NextFunction,
  type ErrorRequestHandler,
} from 'express';
import { AppError } from '../utils/appError.js';
import { env } from '../config/env.js';

interface MongooseValidationError {
  name: 'ValidationError';
  errors: Record<string, { message: string }>;
}

interface MongooseCastError {
  name: 'CastError';
  path?: string;
  value?: unknown;
}

interface MongoDuplicateKeyError {
  code: number;
  keyValue?: Record<string, unknown>;
}

interface CustomZodError {
  name: 'ZodError';
  issues?: unknown;
}

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let status = 500;
  let message = 'Internal server error';
  let details: unknown = undefined;
  let stack: string | undefined = undefined;

  if (err instanceof Error) {
    stack = err.stack;
    message = err.message;

    if (err instanceof AppError) {
      status = err.statusCode;
      details = err.details;
    }
  }

  if (typeof err === 'object' && err !== null) {
    const errorRecord = err as Record<string, unknown>;

    if (errorRecord.name === 'ValidationError' && 'errors' in errorRecord) {
      const validationErr = err as MongooseValidationError;
      status = 400;
      message = 'Validation failed';
      details = Object.fromEntries(
        Object.entries(validationErr.errors).map(([field, item]) => [
          field,
          item.message,
        ])
      );
    } else if (errorRecord.name === 'CastError') {
      const castErr = err as MongooseCastError;
      status = 400;
      message = `Invalid ${castErr.path ?? 'field'}: ${String(castErr.value)}`;
    } else if (errorRecord.code === 11000) {
      const duplicateErr = err as MongoDuplicateKeyError;
      status = 409;
      message = 'Duplicate key';
      details = duplicateErr.keyValue;
    } else if (errorRecord.name === 'ZodError') {
      const zodErr = err as CustomZodError;
      status = 400;
      message = 'Validation failed';
      details = zodErr.issues;
    }
  }

  if (status >= 500) {
    console.error(`[${req.method} ${req.originalUrl}]`, err);
  }

  res.status(status).json({
    error: {
      message,
      ...(details !== undefined ? { details } : {}),
      ...(env.isProd ? {} : { stack: stack }),
    },
  });
};
