import express from 'express';
import { applyForRoom, getMyApplications, getLandlordApplications } from '../controllers/applicationController.js';

const router = express.Router();

router.post('/', applyForRoom);
router.get('/tenant/:user_id', getMyApplications); // My sent applications
router.get('/landlord/:user_id', getLandlordApplications); // Applications received

export default router;