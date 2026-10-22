import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticate } from '../middleware/auth.js';
import { getInsightsDataController } from '../controllers/insights.js';

const router = Router();
router.use(authenticate);

router.get('/', asyncHandler(getInsightsDataController));

export default router;
