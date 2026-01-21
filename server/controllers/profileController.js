import { supabase } from '../supabase.js';

// GET PROFILE (By ID)
export const getProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            return res.status(200).json({ id, full_name: "New User", bio: "" });
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { full_name, bio, avatar_url } = req.body;

        const { data, error } = await supabase
            .from('profiles')
            .upsert({ id, full_name, bio, avatar_url, updated_at: new Date() })
            .select();

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};