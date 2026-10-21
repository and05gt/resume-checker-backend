import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { uploadPdf } from '../middleware/upload.js';
import {
  createResumeController,
  deleteResumeController,
  getAllResumesController,
  getResumeController,
} from '../controllers/resumes.js';
import { idParam, versionIdParam } from '../validation/resume.js';

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

export default router;
