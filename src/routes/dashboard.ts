import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticate } from '../middleware/auth.js';
import { getDashboardDataController } from '../controllers/dashboard.js';

const router = Router();
router.use(authenticate);

router.get('/', asyncHandler(getDashboardDataController));

export default router;
