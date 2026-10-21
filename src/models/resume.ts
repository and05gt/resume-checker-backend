import { model, Schema } from 'mongoose';
import { IResume } from '../types/resume.js';

const resumeSchema = new Schema<IResume>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxLength: 120 },
    currentVersionId: {
      type: Schema.Types.ObjectId,
      ref: 'ResumeVersion',
      default: null,
    },
    latestVersionNumber: { type: Number, default: 0 },
  },
  { timestamps: true }
);

resumeSchema.index({ userId: 1, createdAt: -1 });

export const Resume = model<IResume>('Resume', resumeSchema);
