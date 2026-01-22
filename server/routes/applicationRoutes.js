import express from 'express';
import { applyForRoom, getMyApplications, getLandlordApplications, updateApplicationStatus } from '../controllers/applicationController.js';

const router = express.Router();

router.post('/', applyForRoom);
router.get('/tenant/:user_id', getMyApplications); 
router.get('/landlord/:user_id', getLandlordApplications);
router.patch('/:id', updateApplicationStatus);

// GET Applications for TENANT (My Sent Apps)
router.get('/tenant/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const { data, error } = await supabase
            .from('applications')
            .select('*, rooms(*)') 
            .eq('applicant_id', userId);
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET Applications for LANDLORD (Received Apps)
router.get('/landlord/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const { data, error } = await supabase
            .from('applications')
            .select('*, rooms(title), profiles:applicant_id(full_name, email, contact_number)')
            .eq('owner_id', userId);
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;