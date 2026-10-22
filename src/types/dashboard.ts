import { Types } from 'mongoose';

export interface IScoreSeries {
  label: string;
  score: number | null;
  versionId: Types.ObjectId;
  at: Date;
}

export interface IVersionStack {
  id: Types.ObjectId;
  label: string;
  title: string;
  score: number | null;
  delta: number;
}
