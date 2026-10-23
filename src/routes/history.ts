import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticate } from '../middleware/auth.js';
import { getHistoryDataController } from '../controllers/history.js';

const router = Router();
router.use(authenticate);

router.get('/', asyncHandler(getHistoryDataController));

export default router;
