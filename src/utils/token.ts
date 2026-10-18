import jwt from 'jsonwebtoken';
import type { JwtPayload, SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';

const jwtSecret = env.jwtSecret;

export const signToken = (payload: string | object | Buffer): string => {
  if (!jwtSecret) {
    throw new Error('JWT secret is not configured');
  }

  return jwt.sign(payload, jwtSecret, {
    expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'],
  });
};

export const verifyToken = (token: string): string | JwtPayload => {
  if (!jwtSecret) {
    throw new Error('JWT secret is not configured');
  }

  return jwt.verify(token, jwtSecret);
};

export const cookieOptions = {
  httpOnly: true,
  secure: env.isProd,
  sameSite: env.isProd ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
};
