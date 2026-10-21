import { model, Schema } from 'mongoose';

const issueSchema = new Schema(
  {
    title: { type: String, required: true },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    explanation: String,
    fix: String,
  },
  { _id: false }
);

const strengthSchema = new Schema(
  {
    title: { type: String, required: true },
    evidence: String,
  },
  { _id: false }
);

const bulletRewriteSchema = new Schema(
  {
    section: String,
    original: { type: String, required: true },
    rewritten: { type: String, required: true },
    rationale: String,
  },
  { _id: true }
);

const scoreBreakdownSchema = new Schema(
  {
    keywords: { type: Number, min: 0, max: 25 },
    formatting: { type: Number, min: 0, max: 25 },
    impact: { type: Number, min: 0, max: 25 },
    clarity: { type: Number, min: 0, max: 25 },
  },
  { _id: false }
);

const analysisSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    resumeId: {
      type: Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
      index: true,
    },
    versionId: {
      type: Schema.Types.ObjectId,
      ref: 'ResumeVersion',
      required: true,
      index: true,
    },
    atsScore: { type: Number, min: 0, max: 100, required: true },
    scoreBreakdown: scoreBreakdownSchema,
    issues: { type: [issueSchema], default: [] },
    strengths: { type: [strengthSchema], default: [] },
    bulletRewrites: { type: [bulletRewriteSchema], default: [] },
    keywordsPresent: { type: [String], default: [] },
    keywordsMissing: { type: [String], default: [] },
    summary: { type: String, default: '' },
    model: { type: String, required: true },
    promptTokens: Number,
    responseTokens: Number,
  },
  { timestamps: true }
);

export const Analysis = model('Analysis', analysisSchema);
