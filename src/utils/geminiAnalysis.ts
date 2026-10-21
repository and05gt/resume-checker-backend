import { GoogleGenAI, Type } from '@google/genai';
import { env } from '../config/env.js';
import { AppError } from './appError.js';
import { analysisSchema } from '../validation/resume.js';

const ai = env.geminiApiKey
  ? new GoogleGenAI({ apiKey: env.geminiApiKey })
  : null;

const responseSchema = {
  type: Type.OBJECT,
  required: [
    'atsScore',
    'scoreBreakdown',
    'issues',
    'strengths',
    'bulletRewrites',
    'keywordsPresent',
    'keywordsMissing',
    'summary',
  ],
  properties: {
    atsScore: {
      type: Type.NUMBER,
      description: 'ATS-readiness score from 0 to 100',
    },
    scoreBreakdown: {
      type: Type.OBJECT,
      required: ['keywords', 'formatting', 'impact', 'clarity'],
      properties: {
        keywords: { type: Type.NUMBER, description: '0-25' },
        formatting: { type: Type.NUMBER, description: '0-25' },
        impact: { type: Type.NUMBER, description: '0-25' },
        clarity: { type: Type.NUMBER, description: '0-25' },
      },
    },
    issues: {
      type: Type.ARRAY,
      description: 'Exactly 5 prioritized issues',
      items: {
        type: Type.OBJECT,
        required: ['title', 'severity', 'explanation', 'fix'],
        properties: {
          title: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ['low', 'medium', 'high'] },
          explanation: { type: Type.STRING },
          fix: { type: Type.STRING },
        },
      },
    },
    strengths: {
      type: Type.ARRAY,
      description: 'Exactly 5 strengths',
      items: {
        type: Type.OBJECT,
        required: ['title', 'evidence'],
        properties: {
          title: { type: Type.STRING },
          evidence: { type: Type.STRING },
        },
      },
    },
    bulletRewrites: {
      type: Type.ARRAY,
      description:
        '5-10 weak bullets rewritten to be stronger and ATS-friendly',
      items: {
        type: Type.OBJECT,
        required: ['section', 'original', 'rewritten', 'rationale'],
        properties: {
          section: { type: Type.STRING },
          original: { type: Type.STRING },
          rewritten: { type: Type.STRING },
          rationale: { type: Type.STRING },
        },
      },
    },
    keywordsPresent: { type: Type.ARRAY, items: { type: Type.STRING } },
    keywordsMissing: { type: Type.ARRAY, items: { type: Type.STRING } },
    summary: {
      type: Type.STRING,
      description: 'One short paragraph overall verdict',
    },
  },
};

const builtPrompt = ({
  rawText,
  targetRole,
}: {
  rawText: string;
  targetRole: string;
}): string => {
  return [
    'You are a senior technical recruiter and ATS expert reviewing a resume.',
    targetRole
      ? `Target role: ${targetRole}.`
      : 'No specific target role was provided - assess for the role the candidate appears to be aiming for.',
    '',
    'Score the resume from 0-100 based on ATS readiness (keyword match, parseable formatting, quantified impact, clarity)',
    'Return exactly 5 prioritized issues, 5 standout strengths, and 5-10 weak bullets rewritten to be stronger, quantified, and ATS-friendly.',
    'Rewrites must preserve the original meaning. Each rewrite needs a one-line rationale.',
    'Identify keywords clearly present and notable keywords missing for the apparent target role.',
    'Be specific and evidence-based - cite phrasing from the resume in explanations.',
    '',
    'RESUME TEXT:',
    '----------',
    rawText,
    '----------',
  ].join('\n');
};

const callGemini = async (prompt: string) => {
  if (!ai) throw new Error('Gemini API key is not configured');

  const result = await ai.models.generateContent({
    model: env.geminiModel,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      responseMimeType: 'application/json',
      responseSchema,
      temperature: 0.4,
    },
  });

  const text = result.text;
  if (!result || !text) throw new Error('Empty response from Gemini');

  return { text, usage: result.usageMetadata || {} };
};

export const analyzeResume = async ({
  rawText,
  targetRole,
}: {
  rawText: string;
  targetRole: string;
}) => {
  if (!ai)
    throw AppError.internal('GEMINI_API_KEY is not configured on the server.');

  const prompt = builtPrompt({ rawText, targetRole });

  let lastError;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const { text, usage } = await callGemini(prompt);
      const parsed = JSON.parse(text);
      const validated = analysisSchema.parse(parsed);

      return {
        analysis: validated,
        model: env.geminiModel,
        promptTokens: usage.promptTokenCount,
        responseTokens: usage.candidatesTokenCount,
      };
    } catch (error) {
      lastError = error;
      if (attempt === 2) break;
    }
  }
  throw AppError.internal(
    `Gemini analysis failed: ${(lastError instanceof Error && lastError.message) || 'unknown error'}`
  );
};
