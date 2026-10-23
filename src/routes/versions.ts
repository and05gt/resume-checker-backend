import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticate } from '../middleware/auth.js';
import { getVersionsController } from '../controllers/versions.js';

const router = Router();
router.use(authenticate);

router.get('/', asyncHandler(getVersionsController));

export default router;
