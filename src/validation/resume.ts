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

const objectIdSchema = z
  .string()
  .refine(v => isValidObjectId(v), { message: 'Invalid Id' });

export const idParam = z.object({ id: objectIdSchema });

export const versionIdParam = z.object({
  id: objectIdSchema,
  versionId: objectIdSchema,
});
