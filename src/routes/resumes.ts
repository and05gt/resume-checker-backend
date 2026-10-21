import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { uploadPdf } from '../middleware/upload.js';
import { analyzeLimiter } from '../middleware/rateLimit.js';
import {
  analyzeResumeController,
  createResumeController,
  deleteResumeController,
  diffResumeController,
  getAllResumesController,
  getAnalysesController,
  getAnalysisVersionController,
  getResumeController,
  rewriteResumeController,
} from '../controllers/resumes.js';
import {
  analyzeBody,
  diffQuery,
  idParam,
  rewriteBody,
  versionIdParam,
} from '../validation/resume.js';

const router = Router();
router.use(authenticate);

router.post('/', uploadPdf('file'), asyncHandler(createResumeController));
router.get('/', asyncHandler(getAllResumesController));
router.get(
  '/:id',
  validate(idParam, 'params'),
  asyncHandler(getResumeController)
);
router.get('/:id/versions/:versionId', validate(versionIdParam, 'params'));
router.delete(
  '/:id',
  validate(idParam, 'params'),
  asyncHandler(deleteResumeController)
);
router.post(
  '/:id/analyze',
  analyzeLimiter,
  validate(idParam, 'params'),
  validate(analyzeBody),
  asyncHandler(analyzeResumeController)
);
router.get(
  '/:id/analyses',
  validate(idParam, 'params'),
  asyncHandler(getAnalysesController)
);
router.get(
  '/:id/versions/:versionId/analysis',
  validate(versionIdParam, 'params'),
  asyncHandler(getAnalysisVersionController)
);
router.post(
  '/:id/rewrite',
  validate(idParam, 'params'),
  validate(rewriteBody),
  asyncHandler(rewriteResumeController)
);
router.get(
  '/:id/diff',
  validate(idParam, 'params'),
  validate(diffQuery, 'query'),
  asyncHandler(diffResumeController)
);

export default router;
