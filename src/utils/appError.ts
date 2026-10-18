export class AppError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;

    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static badRequest(message = 'Bad request', details?: unknown): AppError {
    return new AppError(400, message, details);
  }

  static unauthorized(message = 'Unauthorized', details?: unknown): AppError {
    return new AppError(401, message, details);
  }

  static forbidden(message = 'Forbidden', details?: unknown): AppError {
    return new AppError(403, message, details);
  }

  static notFound(message = 'Not found', details?: unknown): AppError {
    return new AppError(404, message, details);
  }

  static conflict(message = 'Conflict', details?: unknown): AppError {
    return new AppError(409, message, details);
  }

  static tooMany(message = 'Too many requests', details?: unknown): AppError {
    return new AppError(429, message, details);
  }

  static internal(
    message = 'Internal server error',
    details?: unknown
  ): AppError {
    return new AppError(500, message, details);
  }
}
