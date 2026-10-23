import { Analysis } from '../models/analysis.js';
import { Resume } from '../models/resume.js';
import { ResumeVersion } from '../models/resumeVersion.js';
import { IHistoryEvent } from '../types/history.js';

export const getHistoryDataService = async (userId: string) => {
  const resumes = await Resume.find({ userId }).lean();

  if (!resumes.length) {
    return {
      events: [],
      totals: {
        all: 0,
        upload: 0,
        rewrite: 0,
        analyze: 0,
      },
    };
  }

  const resumeIds = resumes.map(r => r._id);
  const resumeMap = new Map(resumes.map(r => [r._id.toString(), r]));

  const [versions, analyses] = await Promise.all([
    ResumeVersion.find({ resumeId: { $in: resumeIds } })
      .select('_id resumeId label versionNumber sourceType createdAt')
      .lean(),
    Analysis.find({ userId })
      .select('_id resumeId versionId atsScore createdAt')
      .lean(),
  ]);

  const events: IHistoryEvent[] = [];
  let rewriteCount = 0;

  for (const r of resumes) {
    events.push({
      id: `r-${r._id}`,
      type: 'upload',
      title: `${r.title} uploaded`,
      subtitle: 'Parsed and version V1 created',
      label: 'V1',
      at: r.createdAt,
      resumeId: r._id,
      resumeTitle: r.title,
    });
  }

  for (const v of versions) {
    if (v.sourceType !== 'rewrite') continue;
    rewriteCount++;
    const resume = resumeMap.get(v.resumeId.toString());
    events.push({
      id: `v-${v._id}`,
      type: 'rewrite',
      title: `${v.label} created for ${resume?.title || 'resume'}`,
      subtitle: 'Rewrites applied to previous version',
      label: `${v.label} created`,
      at: v.createdAt,
      resumeId: v.resumeId,
      resumeTitle: resume?.title || 'Resume',
    });
  }

  for (const a of analyses) {
    const resume = resumeMap.get(a.resumeId.toString());
    events.push({
      id: `a-${a._id}`,
      type: 'analyze',
      title: `Analysis complete for ${resume?.title || 'resume'}`,
      subtitle: `ATS score ${a.atsScore} / 100`,
      label: `${a.atsScore}`,
      at: a.createdAt,
      resumeId: a.resumeId,
      resumeTitle: resume?.title || 'Resume',
    });
  }

  events.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

  return {
    events,
    totals: {
      all: events.length,
      upload: resumes.length,
      rewrite: rewriteCount,
      analyze: analyses.length,
    },
  };
};
