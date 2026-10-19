import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimit.js';
import {
  loginSchema,
  passwordSchema,
  profileSchema,
  registerSchema,
} from '../validation/auth.js';
import {
  loginController,
  logoutController,
  meController,
  passwordController,
  profileController,
  registerController,
} from '../controllers/auth.js';

const router = Router();

router.post(
  '/register',
  authLimiter,
  validate(registerSchema),
  asyncHandler(registerController)
);

router.post(
  '/login',
  authLimiter,
  validate(loginSchema),
  asyncHandler(loginController)
);

router.post('/logout', logoutController);

router.get('/me', authenticate, asyncHandler(meController));

router.patch(
  '/profile',
  authenticate,
  validate(profileSchema),
  asyncHandler(profileController)
);

router.patch(
  '/password',
  authLimiter,
  authenticate,
  validate(passwordSchema),
  asyncHandler(passwordController)
);

export default router;
