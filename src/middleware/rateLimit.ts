import { rateLimit } from 'express-rate-limit';
import { type Request } from 'express';

export const analyzeLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  keyGenerator: (req: Request): string => {
    return req.user?._id?.toString() || req.ip || 'anonymous';
  },
  message: {
    error: { message: 'Too many analyzes - please wait a minute and retry.' },
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: { message: 'Too many attempts - please wait and retry.' } },
});
