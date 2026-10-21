import { Resume } from '../models/resume.js';
import { ResumeVersion } from '../models/resumeVersion.js';
import { IResume } from '../types/resume.js';
import { IResumeVersion } from '../types/resumeVersion.js';
import { AppError } from '../utils/appError.js';
import { extractText } from '../utils/parsePdf.js';
import { parseResume } from '../utils/structuredParser.js';

export const loadOwnedResume = async (
  id: string,
  userId: string
): Promise<IResume> => {
  const resume = await Resume.findOne({ _id: id, userId });
  if (!resume) throw AppError.notFound('Resume not found');

  return resume;
};

export const loadVersion = async (
  resumeId: string,
  versionId: string
): Promise<IResumeVersion> => {
  const version = await ResumeVersion.findOne({ _id: versionId, resumeId });
  if (!version) throw AppError.notFound('Version not found');

  return version;
};

export const createResumeService = async (
  payload: Buffer,
  userId: string,
  resumeTitle?: string,
  originalName?: string
) => {
  const { text, meta } = await extractText(payload);
  const parsedSections = await parseResume(text);

  const title =
    (resumeTitle || '').trim() ||
    originalName?.replace(/\.pdf$/i, '') ||
    'Untitled Resume';

  const resume = await Resume.create({ userId, title, latestVersionNumber: 1 });

  const version = await ResumeVersion.create({
    resumeId: resume._id,
    versionNumber: 1,
    label: 'V1',
    rawText: text,
    parsedSections,
    sourceType: 'upload',
    parentVersionId: null,
  });

  resume.currentVersionId = version._id;
  await resume.save();

  return { resume, version, meta };
};

export const getAllResumesService = async (id: string) => {
  return Resume.find({ userId: id }).sort({ updatedAt: -1 }).lean();
};

export const getResumeService = async (id: string, userId: string) => {
  const resume = await loadOwnedResume(id, userId);
  const versions = await ResumeVersion.find({ resumeId: resume._id })
    .sort({
      versionNumber: 1,
    })
    .select('-rawText')
    .lean();

  return { resume, versions };
};

export const getVersionResumeService = async (
  id: string,
  userId: string,
  versionId: string
) => {
  const resume = await loadOwnedResume(id, userId);
  const version = await loadVersion(resume._id.toString(), versionId);

  return version;
};

export const deleteResumeService = async (
  id: string,
  userId: string
): Promise<void> => {
  const resume = await loadOwnedResume(id, userId);
  await ResumeVersion.deleteMany({ resumeId: resume._id });
  await resume.deleteOne();
};
