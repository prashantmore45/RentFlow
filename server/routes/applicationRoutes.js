import express from 'express';
import { applyForRoom, getMyApplications, getLandlordApplications, updateApplicationStatus } from '../controllers/applicationController.js';

const router = express.Router();

router.post('/', applyForRoom);
router.get('/tenant/:user_id', getMyApplications); 
router.get('/landlord/:user_id', getLandlordApplications);
router.patch('/:id', updateApplicationStatus);

export default router;