import { diffLines, diffWordsWithSpace, type Change } from 'diff';

type DiffPart = {
  value: string;
  added?: boolean;
  removed?: boolean;
};

export const diffText = (
  oldText: string,
  newText: string,
  mode: 'lines' | 'words' = 'words'
): DiffPart[] => {
  const parts: Change[] =
    mode === 'lines'
      ? diffLines(oldText || '', newText || '', undefined)
      : diffWordsWithSpace(oldText || '', newText || '', undefined);
  return parts.map((p: Change): DiffPart => ({
    value: p.value,
    added: !!p.added,
    removed: !!p.removed,
  }));
};

export const summarize = (parts: DiffPart[]) => {
  let added = 0;
  let removed = 0;
  for (const p of parts) {
    if (p.added) added += p.value.length;
    else if (p.removed) removed += p.value.length;
  }
  return { added, removed };
};
