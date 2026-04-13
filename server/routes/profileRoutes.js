import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { verifyToken } from '../middleware/auth.js';
import { validateRequest, updateProfileSchema } from '../middleware/validation.js';

const router = express.Router();

// Public - Get profile info
router.get('/:id', getProfile);

// Protected - Update profile (Auth required)
router.put('/:id', verifyToken, validateRequest(updateProfileSchema), updateProfile);

export default router;