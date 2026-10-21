import { type Types, type Document } from 'mongoose';

export interface IResume extends Document {
  userId: Types.ObjectId;
  title: string;
  currentVersionId: Types.ObjectId | null;
  latestVersionNumber: number;
  createdAt: Date;
  updatedAt: Date;
}
