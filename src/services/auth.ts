import { AppError } from '../utils/appError.js';
import { User } from '../models/user.js';
import { IUser } from '../types/user.js';

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

export const registerService = async (
  payload: RegisterPayload
): Promise<IUser> => {
  const { name, email, password } = payload;
  const existing = await User.findOne({ email });
  if (existing) throw AppError.conflict('Email already registered');

  const hashedPassword = await User.hashPassword(password);
  const user = await User.create({ name, email, password: hashedPassword });

  return user;
};

export const loginService = async (payload: LoginPayload): Promise<IUser> => {
  const { email, password } = payload;

  const user = await User.findOne({ email }).select('+password');
  if (!user) throw AppError.unauthorized('Invalid credentials');

  const ok = await user.comparePassword(password);
  if (!ok) throw AppError.unauthorized('Invalid credentials');

  return user;
};

export const profileService = async (
  userId: string,
  name: string
): Promise<IUser> => {
  const user = await User.findById(userId);
  if (!user) throw AppError.unauthorized('Session no longer valid');

  user.name = name;
  await user.save();

  return user;
};

export const passwordService = async (
  userId: string,
  payload: { currentPassword: string; newPassword: string }
): Promise<void> => {
  const user = await User.findById(userId).select('+password');
  if (!user) throw AppError.unauthorized('Session no longer valid');

  const ok = await user.comparePassword(payload.currentPassword);
  if (!ok) throw AppError.unauthorized('Current password is incorrect');

  user.password = await User.hashPassword(payload.newPassword);
  await user.save();
};
