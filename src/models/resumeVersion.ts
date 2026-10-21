import { model, Schema } from 'mongoose';
import {
  type IResumeVersion,
  type IBasics,
  type IExperienceItem,
  type IEducationItem,
  type IProjectItem,
  type ICertificationItem,
  type IParsedSections,
  type ILink,
} from '../types/resumeVersion.js';

const linkSchema = new Schema<ILink>(
  {
    label: String,
    url: String,
  },
  { _id: false }
);

const basicsSchema = new Schema<IBasics>(
  {
    name: String,
    title: String,
    location: String,
    email: String,
    phone: String,
    links: [linkSchema],
  },
  { _id: false }
);

const experienceItemSchema = new Schema<IExperienceItem>(
  {
    company: String,
    role: String,
    location: String,
    period: String,
    bullets: [String],
  },
  { _id: false }
);

const educationItemSchema = new Schema<IEducationItem>(
  {
    degree: String,
    school: String,
    location: String,
    period: String,
    details: String,
  },
  { _id: false }
);

const projectItemSchema = new Schema<IProjectItem>(
  {
    name: String,
    description: String,
    tech: [String],
    links: [linkSchema],
  },
  { _id: false }
);

const certificationItemSchema = new Schema<ICertificationItem>(
  {
    name: String,
    issuer: String,
    year: String,
  },
  { _id: false }
);

const parsedSectionsSchema = new Schema<IParsedSections>(
  {
    basics: { type: basicsSchema, default: () => ({}) },
    summary: { type: String, default: '' },
    experience: { type: [experienceItemSchema], default: [] },
    education: { type: [educationItemSchema], default: [] },
    skills: { type: [String], default: [] },
    projects: { type: [projectItemSchema], default: [] },
    certifications: { type: [certificationItemSchema], default: [] },
    languages: { type: [String], default: [] },
    interests: { type: [String], default: [] },
  },
  { _id: false }
);

const resumeVersionSchema = new Schema<IResumeVersion>(
  {
    resumeId: {
      type: Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
      index: true,
    },
    versionNumber: { type: Number, required: true, min: 1 },
    label: { type: String, required: true },
    rawText: { type: String, required: true },
    parsedSections: { type: parsedSectionsSchema, default: () => ({}) },
    sourceType: { type: String, enum: ['upload', 'rewrite'], required: true },
    parentVersionId: {
      type: Schema.Types.ObjectId,
      ref: 'ResumeVersion',
      default: null,
    },
    latestAnalysisId: {
      type: Schema.Types.ObjectId,
      ref: 'Analysis',
      default: null,
    },
  },
  { timestamps: true }
);

resumeVersionSchema.index({ resumeId: 1, versionNumber: 1 }, { unique: true });

export const ResumeVersion = model<IResumeVersion>(
  'ResumeVersion',
  resumeVersionSchema
);
