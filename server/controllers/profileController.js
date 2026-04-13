import { supabase } from '../supabase.js';

// GET PROFILE (By ID - Public endpoint)
export const getProfile = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate profile ID format
        if (!id || typeof id !== 'string') {
            return res.status(400).json({ error: 'Invalid profile ID' });
        }

        const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name, bio, avatar_url, updated_at')
            .eq('id', id)
            .single();

        if (error) {
            // Return default profile for non-existent users
            return res.status(200).json({ id, full_name: "User", bio: "", avatar_url: null });
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// UPDATE PROFILE (AUTHORIZED)
export const updateProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized - Authentication required' });
        }

        const { id } = req.params;

        // Users can only update their own profile
        if (id !== req.user.id) {
            return res.status(403).json({ error: 'Forbidden - Cannot update other users\' profiles' });
        }

        // Use validated body from validation middleware
        const updateData = req.validatedBody || req.body;

        const { data, error } = await supabase
            .from('profiles')
            .upsert({ 
                id: req.user.id, 
                ...updateData,
                updated_at: new Date().toISOString()
            }, { onConflict: 'id' })
            .select();

        if (error) throw error;
        res.status(200).json(data[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};