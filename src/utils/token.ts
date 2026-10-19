import { type CookieOptions } from 'express';
import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from './appError.js';

export interface TokenPayload {
  sub: string;
  email?: string;
}

const jwtSecret = env.jwtSecret;

export const signToken = (payload: TokenPayload): string => {
  if (!jwtSecret) {
    throw new Error('JWT secret is not configured');
  }

  return jwt.sign(payload, jwtSecret, {
    expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'],
  });
};

export const verifyToken = (token: string): TokenPayload => {
  if (!jwtSecret) {
    throw new Error('JWT secret is not configured');
  }

  try {
    return jwt.verify(token, jwtSecret) as TokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw AppError.unauthorized('Token expired, please log in again');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw AppError.unauthorized('Invalid or malformed token');
    }
    throw AppError.unauthorized('Authentication failed');
  }
};

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.isProd,
  sameSite: env.isProd ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
};
