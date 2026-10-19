import { type Document, type Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  comparePassword(password: string): Promise<boolean>;
}

export interface UserModel extends Model<IUser, object, IUserMethods> {
  hashPassword(password: string): Promise<string>;
}
