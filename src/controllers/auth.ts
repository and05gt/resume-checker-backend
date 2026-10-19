import { type Request, type Response } from 'express';
import { env } from '../config/env.js';
import { signToken, cookieOptions } from '../utils/token.js';
import {
  loginService,
  passwordService,
  profileService,
  registerService,
} from '../services/auth.js';

const issueSession = (
  res: Response,
  user: { _id: { toString: () => string } }
) => {
  const token = signToken({ sub: user._id.toString() });
  res.cookie(env.cookieName, token, cookieOptions);
};

export const registerController = async (req: Request, res: Response) => {
  const user = await registerService(req.body);
  issueSession(res, user);
  res.status(201).json({ user });
};

export const loginController = async (req: Request, res: Response) => {
  const user = await loginService(req.body);
  issueSession(res, user);
  res.json({ user });
};

export const logoutController = (_req: Request, res: Response) => {
  res.clearCookie(env.cookieName, { ...cookieOptions, maxAge: 0 });
  res.json({ ok: true });
};

export const meController = async (req: Request, res: Response) => {
  res.json({ user: req.user });
};

export const profileController = async (req: Request, res: Response) => {
  const user = await profileService(req.user!._id.toString(), req.body.name);
  res.json({ user });
};

export const passwordController = async (req: Request, res: Response) => {
  await passwordService(req.user!._id.toString(), req.body);
  res.json({ ok: true });
};
