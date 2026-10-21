import { isValidObjectId } from 'mongoose';
import { z } from 'zod';

export const resumeSchema = z.object({
  basics: z.object({
    name: z.string().default(''),
    title: z.string().default(''),
    location: z.string().default(''),
    email: z.string().default(''),
    phone: z.string().default(''),
    links: z
      .array(z.object({ label: z.string(), url: z.string() }))
      .default([]),
  }),
  summary: z.string().default(''),
  experience: z
    .array(
      z.object({
        company: z.string().default(''),
        role: z.string().default(''),
        location: z.string().default(''),
        period: z.string().default(''),
        bullets: z.array(z.string()).default([]),
      })
    )
    .default([]),
  education: z
    .array(
      z.object({
        degree: z.string().default(''),
        school: z.string().default(''),
        location: z.string().default(''),
        period: z.string().default(''),
        details: z.string().default(''),
      })
    )
    .default([]),
  skills: z.array(z.string()).default([]),
  projects: z
    .array(
      z.object({
        name: z.string().default(''),
        description: z.string().default(''),
        tech: z.array(z.string()).default([]),
        links: z
          .array(z.object({ label: z.string(), url: z.string() }))
          .default([]),
      })
    )
    .default([]),
  certifications: z
    .array(
      z.object({
        name: z.string().default(''),
        issuer: z.string().default(''),
        year: z.string().default(''),
      })
    )
    .default([]),
  languages: z.array(z.string()).default([]),
  interests: z.array(z.string()).default([]),
});

export const analysisSchema = z.object({
  atsScore: z.number().min(0).max(100),
  scoreBreakdown: z.object({
    keywords: z.number().min(0).max(25),
    formatting: z.number().min(0).max(25),
    impact: z.number().min(0).max(25),
    clarity: z.number().min(0).max(25),
  }),
  issues: z
    .array(
      z.object({
        title: z.string(),
        severity: z.enum(['low', 'medium', 'high']),
        explanation: z.string(),
        fix: z.string(),
      })
    )
    .min(1),
  strengths: z
    .array(
      z.object({
        title: z.string(),
        evidence: z.string(),
      })
    )
    .min(1),
  bulletRewrites: z
    .array(
      z.object({
        section: z.string(),
        original: z.string(),
        rewritten: z.string(),
        rationale: z.string(),
      })
    )
    .default([]),
  keywordsPresent: z.array(z.string()).default([]),
  keywordsMissing: z.array(z.string()).default([]),
  summary: z.string(),
});

const objectIdSchema = z
  .string()
  .refine(v => isValidObjectId(v), { message: 'Invalid Id' });

export const idParam = z.object({ id: objectIdSchema });

export const versionIdParam = z.object({
  id: objectIdSchema,
  versionId: objectIdSchema,
});

export const analyzeBody = z.object({
  versionId: objectIdSchema.optional(),
  targetRole: z.string().trim().max(120).optional(),
});
