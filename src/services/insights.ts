import { Analysis } from '../models/analysis.js';
import { Resume } from '../models/resume.js';
import { getTopFrequent } from '../utils/getTopFrequent.js';

export const getInsightsDataService = async (userId: string) => {
  const resumes = await Resume.find({ userId }).sort({ updatedAt: -1 }).lean();
  const resumeMap = new Map(resumes.map(r => [r._id.toString(), r]));

  const analyses = await Analysis.find({ userId })
    .sort({ createdAt: 1 })
    .lean();

  if (!analyses.length) {
    return {
      empty: true,
      totalAnalyses: 0,
      resumes: resumes.map(r => ({
        _id: r._id,
        title: r.title,
        latestVersionNumber: r.latestVersionNumber,
      })),
    };
  }

  const totalScore = analyses.reduce((s, a) => s + a.atsScore, 0);
  const averageScore = Math.round(totalScore / analyses.length);

  const bestEntry = analyses.reduce((best, a) =>
    a.atsScore > best.atsScore ? a : best
  );
  const bestResume = resumeMap.get(bestEntry.resumeId.toString());

  const scoreTrend = analyses.map(a => ({
    at: a.createdAt,
    score: a.atsScore,
    resumeId: a.resumeId,
    resumeTitle: resumeMap.get(a.resumeId.toString())?.title || 'Resume',
  }));

  const allIssues = analyses.flatMap(a => a.issues || []);
  const topIssues = getTopFrequent(
    allIssues,
    i => i.title?.trim().toLowerCase(),
    6
  ).map(row => ({
    title: row.sample?.title || row.key,
    count: row.count,
    severity: row.sample?.severity || 'medium',
  }));

  const allMissing = analyses.flatMap(a => a.keywordsMissing || []);
  const allPresent = analyses.flatMap(a => a.keywordsPresent || []);
  const topMissing = getTopFrequent(allMissing, k => k.toLowerCase(), 12).map(
    r => ({
      keyword: r.sample,
      count: r.count,
    })
  );
  const topPresent = getTopFrequent(allPresent, k => k.toLowerCase(), 12).map(
    r => ({
      keyword: r.sample,
      count: r.count,
    })
  );

  const resumePerformance = resumes
    .map(r => {
      const res = analyses.filter(
        a => a.resumeId.toString() === r._id.toString()
      );
      if (!res.length) return null;
      const latest = res[res.length - 1];
      const best = res.reduce((b, a) => (a.atsScore > b.atsScore ? a : b));
      const first = res[0];
      return {
        resumeId: r._id,
        title: r.title,
        analysesCount: res.length,
        latestScore: latest.atsScore,
        bestScore: best.atsScore,
        improvement: latest.atsScore - first.atsScore,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => b?.latestScore - a?.latestScore);

  return {
    empty: false,
    totalAnalyses: analyses.length,
    averageScore,
    bestScore: {
      value: bestEntry.atsScore,
      resumeId: bestEntry.resumeId,
      resumeTitle: bestResume?.title || 'Resume',
      at: bestEntry.createdAt,
    },
    scoreTrend,
    topIssues,
    topMissingKeywords: topMissing,
    topPresentKeywords: topPresent,
    resumePerformance,
  };
};
