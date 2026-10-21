import { type Request, type Response } from 'express';
import {
  analyzeResumeService,
  createResumeService,
  deleteResumeService,
  diffResumeService,
  getAllResumesService,
  getAnalysesService,
  getAnalysisVersionService,
  getResumeService,
  getVersionResumeService,
  rewriteResumeService,
} from '../services/resumes.js';
import { AppError } from '../utils/appError.js';

export const createResumeController = async (req: Request, res: Response) => {
  if (!req.file?.buffer || !req.file?.originalname) {
    throw AppError.badRequest('Resume PDF file is required');
  }

  const userId = req.user!._id.toString();

  const { resume, version, meta } = await createResumeService(
    req.file.buffer,
    userId,
    req.body.title,
    req.file.originalname
  );

  res.status(201).json({ resume, version, meta });
};

export const getAllResumesController = async (req: Request, res: Response) => {
  const resumes = await getAllResumesService(req.user!._id.toString());

  res.json({ resumes });
};

export const getResumeController = async (req: Request, res: Response) => {
  const id = String(req.params.id);

  const { resume, versions } = await getResumeService(
    id,
    req.user!._id.toString()
  );

  res.json({ resume, versions });
};

export const getVersionResumeController = async (
  req: Request,
  res: Response
) => {
  const id = String(req.params.id);
  const versionId = String(req.params.versionId);

  const version = await getVersionResumeService(
    id,
    req.user!._id.toString(),
    versionId
  );

  res.json({ version });
};

export const deleteResumeController = async (req: Request, res: Response) => {
  const id = String(req.params.id);

  await deleteResumeService(id, req.user!._id.toString());

  res.json({ ok: true });
};

export const analyzeResumeController = async (req: Request, res: Response) => {
  const id = String(req.params.id);

  const result = await analyzeResumeService(
    id,
    req.user!._id.toString(),
    req.body.versionId,
    req.body.targetRole
  );

  res.status(201).json({ analysis: result });
};

export const getAnalysesController = async (req: Request, res: Response) => {
  const id = String(req.params.id);

  const analyses = await getAnalysesService(id, req.user!._id.toString());

  res.json({ analyses });
};

export const getAnalysisVersionController = async (
  req: Request,
  res: Response
) => {
  const id = String(req.params.id);
  const versionId = String(req.params.versionId);

  const analysis = await getAnalysisVersionService(
    id,
    req.user!._id.toString(),
    versionId
  );

  res.json({ analysis: analysis || null });
};

export const rewriteResumeController = async (req: Request, res: Response) => {
  const id = String(req.params.id);

  const { newVersion, appliedCount } = await rewriteResumeService(
    id,
    req.user!._id.toString(),
    req.body.analysisId,
    req.body.rewriteIds,
    req.body.label
  );

  res.status(201).json({ version: newVersion, appliedCount });
};

export const diffResumeController = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const from = typeof req.query.from === 'string' ? req.query.from : undefined;
  const to = typeof req.query.to === 'string' ? req.query.to : undefined;
  const mode = req.query.mode === 'lines' ? 'lines' : 'words';

  if (!from || !to) {
    throw AppError.badRequest(
      'Query parameters "from" and "to" version IDs are required'
    );
  }

  const {
    from: fromVersion,
    to: toVersion,
    parts,
    stats,
  } = await diffResumeService(id, req.user!._id.toString(), from, to, mode);

  res.json({ from: fromVersion, to: toVersion, parts, stats });
};
