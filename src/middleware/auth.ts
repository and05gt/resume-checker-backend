import { type Request, type Response, type NextFunction } from 'express';
import { env } from '../config/env.js';
import { verifyToken } from '../utils/token.js';
import { User } from '../models/user.js';
import { AppError } from '../utils/appError.js';

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies?.[env.cookieName]) {
      token = req.cookies[env.cookieName];
    }

    if (!token)
      throw AppError.unauthorized('Authentication required: no token provided');

    const payload = verifyToken(token);

    const currentUser = await User.findById(payload.sub);
    if (!currentUser) {
      throw AppError.unauthorized(
        'User belonging to this token no longer exists'
      );
    }

    req.user = currentUser;

    next();
  } catch (error) {
    next(error);
  }
};
