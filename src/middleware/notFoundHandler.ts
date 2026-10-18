import { type Request, type Response, type NextFunction } from 'express';
import { AppError } from '../utils/appError.js';

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  next(AppError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
};
