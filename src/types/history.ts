import { Types } from 'mongoose';

export interface IHistoryEvent {
  id: string;
  type: 'upload' | 'rewrite' | 'analyze';
  title: string;
  subtitle: string;
  label: string;
  at: Date;
  resumeId: Types.ObjectId;
  resumeTitle: string;
}
