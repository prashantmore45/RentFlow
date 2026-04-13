import express from 'express';
import { applyForRoom, getMyApplications, getLandlordApplications, updateApplicationStatus } from '../controllers/applicationController.js';
import { verifyToken } from '../middleware/auth.js';
import { validateRequest, createApplicationSchema, updateApplicationStatusSchema } from '../middleware/validation.js';

const router = express.Router();

// Apply for a room - Auth required
router.post('/', verifyToken, validateRequest(createApplicationSchema), applyForRoom);

// Get my sent applications - Auth required
router.get('/tenant/:user_id', verifyToken, getMyApplications);

// Get received applications (landlord) - Auth required
router.get('/landlord/:user_id', verifyToken, getLandlordApplications);

// Update application status - Auth required
router.patch('/:id', verifyToken, validateRequest(updateApplicationStatusSchema), updateApplicationStatus);

export default router;