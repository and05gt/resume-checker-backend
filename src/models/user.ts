import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import {
  type IUser,
  type UserModel,
  type IUserMethods,
} from '../types/user.js';

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: { type: String, required: true, trim: true, maxLength: 80 },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email'],
    },
    password: { type: String, required: true, select: false },
  },
  { timestamps: true }
);

userSchema.statics.hashPassword = function (password: string): Promise<string> {
  return bcrypt.hash(password, 12);
};

userSchema.methods.comparePassword = function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

export const User = model<IUser, UserModel>('User', userSchema);
