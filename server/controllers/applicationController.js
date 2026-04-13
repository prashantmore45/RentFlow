import { supabase } from '../supabase.js';

export const applyForRoom = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized - Authentication required' });
        }

        const { room_id, message } = req.validatedBody || req.body;
        const applicant_id = req.user.id;

        // Get room details including owner_id
        const { data: room, error: roomError } = await supabase
            .from('rooms')
            .select('owner_id')
            .eq('id', room_id)
            .single();

        if (roomError || !room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        // Check if user is trying to apply to their own room
        if (room.owner_id === applicant_id) {
            return res.status(400).json({ error: 'You cannot apply to your own room' });
        }

        // Check if user has already applied
        const { data: existing } = await supabase
            .from('applications')
            .select('id')
            .eq('room_id', room_id)
            .eq('applicant_id', applicant_id)
            .single();

        if (existing) {
            return res.status(400).json({ error: 'You have already applied for this room' });
        }

        const { data, error } = await supabase
            .from('applications')
            .insert([{ 
                room_id, 
                owner_id: room.owner_id,
                applicant_id,
                message,
                status: 'pending',
                created_at: new Date().toISOString()
            }])
            .select();

        if (error) return res.status(400).json({ error: error.message });
        res.status(201).json({ message: "Application sent successfully", data: data[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getMyApplications = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized - Authentication required' });
        }

        const { user_id } = req.params;
        
        // Users can only fetch their own applications
        if (user_id !== req.user.id) {
            return res.status(403).json({ error: 'Forbidden - Cannot access other users\' applications' });
        }
        
        const { data, error } = await supabase
            .from('applications')
            .select(`
                id,
                room_id,
                applicant_id,
                owner_id,
                message,
                status,
                created_at,
                rooms(id, title, location, price, image_url)
            `) 
            .eq('applicant_id', user_id)
            .order('created_at', { ascending: false });

        if (error) return res.status(400).json({ error: error.message });
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getLandlordApplications = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized - Authentication required' });
        }

        const { user_id } = req.params;

        // Landlords can only fetch their own received applications
        if (user_id !== req.user.id) {
            return res.status(403).json({ error: 'Forbidden - Cannot access other users\' applications' });
        }

        const { data, error } = await supabase
            .from('applications')
            .select(`
                id,
                room_id,
                applicant_id,
                owner_id,
                message,
                status,
                created_at,
                rooms(id, title, location, price, image_url)
            `)
            .eq('owner_id', user_id)
            .order('created_at', { ascending: false });

        if (error) return res.status(400).json({ error: error.message });
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateApplicationStatus = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized - Authentication required' });
        }

        const { id } = req.params;
        const { status } = req.validatedBody || req.body;

        // Get application to verify ownership
        const { data: app, error: appError } = await supabase
            .from('applications')
            .select('owner_id')
            .eq('id', id)
            .single();

        if (appError || !app) {
            return res.status(404).json({ error: 'Application not found' });
        }

        // Only the landlord (owner) can update application status
        if (app.owner_id !== req.user.id) {
            return res.status(403).json({ error: 'Forbidden - Only the landlord can update this application' });
        }

        const { data, error } = await supabase
            .from('applications')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select();

        if (error) return res.status(400).json({ error: error.message });
        res.status(200).json({ message: `Application ${status}`, data: data[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};