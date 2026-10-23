import { Analysis } from '../models/analysis.js';
import { Resume } from '../models/resume.js';
import { ResumeVersion } from '../models/resumeVersion.js';

export const getVersionsService = async (userId: string) => {
  const resumes = await Resume.find({ userId }).lean();

  if (!resumes.length) {
    return {
      versions: [],
      totals: { all: 0, uploads: 0, rewrites: 0 },
    };
  }

  const resumeIds = resumes.map(r => r._id);
  const resumeMap = new Map(resumes.map(r => [r._id.toString(), r]));

  const versions = await ResumeVersion.find({
    resumeId: { $in: resumeIds },
  })
    .select(
      '_id resumeId label versionNumber sourceType createdAt latestAnalysisId parentVersionId'
    )
    .sort({ createdAt: -1 })
    .lean();

  const analysisIds = versions.map(v => v.latestAnalysisId).filter(Boolean);
  const analyses = analysisIds.length
    ? await Analysis.find({ _id: { $in: analysisIds } })
        .select('_id atsScore versionId')
        .lean()
    : [];
  const scoreByVersion = new Map(
    analyses.map(a => [a.versionId?.toString(), a.atsScore])
  );

  let uploadsCount = 0;
  let rewritesCount = 0;

  const items = versions.map(v => {
    if (v.sourceType === 'upload') uploadsCount++;
    if (v.sourceType === 'rewrite') rewritesCount++;

    const resume = resumeMap.get(v.resumeId.toString());
    return {
      id: v._id,
      label: v.label,
      versionNumber: v.versionNumber,
      sourceType: v.sourceType,
      createdAt: v.createdAt,
      score: scoreByVersion.get(v._id.toString()) ?? null,
      resumeId: v.resumeId,
      resumeTitle: resume?.title || 'Resume',
      parentVersionId: v.parentVersionId,
    };
  });

  return {
    versions: items,
    totals: {
      all: items.length,
      uploads: uploadsCount,
      rewrites: rewritesCount,
    },
  };
};
