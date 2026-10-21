import { IParsedSections } from '../types/resumeVersion.js';

interface ResumeRewrite {
  original?: string;
  rewritten?: string;
}

export const applyRewritesToText = (
  rawText: string,
  rewrites: ResumeRewrite[]
): string => {
  let result: string = rawText;
  for (const r of rewrites) {
    if (!r.original || !r.rewritten) continue;
    const idx: number = result.indexOf(r.original);
    if (idx >= 0) {
      result =
        result.slice(0, idx) +
        r.rewritten +
        result.slice(idx + r.original.length);
    } else {
      result += `\n${r.rewritten}`;
    }
  }
  return result;
};

export const patchBulletsInSections = (
  sections: IParsedSections,
  rewrites: ResumeRewrite[]
) => {
  if (!sections) return null;
  const cloned = JSON.parse(JSON.stringify(sections));
  for (const r of rewrites) {
    if (!r?.original || !r?.rewritten) continue;
    for (const exp of cloned.experience || []) {
      if (!Array.isArray(exp.bullets)) continue;
      exp.bullets = exp.bullets.map((b: string) =>
        b === r.original ? r.rewritten : b
      );
    }
  }
  return cloned;
};

export const looksEmpty = (sections: IParsedSections) => {
  if (!sections) return true;
  const b = sections.basics || {};
  const hasIdentity = b.name || b.email || b.title;
  const hasBody =
    sections.summary ||
    sections.experience?.length ||
    sections.education?.length ||
    sections.skills?.length;
  return !hasIdentity && !hasBody;
};
