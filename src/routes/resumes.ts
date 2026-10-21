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
  getAllResumesController,
  getAnalysesController,
  getAnalysisVersionController,
  getResumeController,
} from '../controllers/resumes.js';
import { analyzeBody, idParam, versionIdParam } from '../validation/resume.js';

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

export default router;
