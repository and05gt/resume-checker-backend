import { type Document, type Types } from 'mongoose';

export type ResumeSourceType = 'upload' | 'rewrite';

export interface ILink {
  label?: string;
  url?: string;
}

export interface IBasics {
  name?: string;
  title?: string;
  location?: string;
  email?: string;
  phone?: string;
  links: ILink[];
}

export interface IExperienceItem {
  company?: string;
  role?: string;
  location?: string;
  period?: string;
  bullets: string[];
}

export interface IEducationItem {
  degree?: string;
  school?: string;
  location?: string;
  period?: string;
  details?: string;
}

export interface IProjectItem {
  name?: string;
  description?: string;
  tech: string[];
  links: ILink[];
}

export interface ICertificationItem {
  name?: string;
  issuer?: string;
  year?: string;
}

export interface IParsedSections {
  basics: IBasics;
  summary: string;
  experience: IExperienceItem[];
  education: IEducationItem[];
  skills: string[];
  projects: IProjectItem[];
  certifications: ICertificationItem[];
  languages: string[];
  interests: string[];
}

export interface IResumeVersion extends Document {
  resumeId: Types.ObjectId;
  versionNumber: number;
  label: string;
  rawText: string;
  parsedSections: IParsedSections;
  sourceType: ResumeSourceType;
  parentVersionId: Types.ObjectId | null;
  latestAnalysisId: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}
