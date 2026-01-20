import { supabase } from '../index.js';

// 1. GET ROOMS (With Search Filter)
export const getRooms = async (req, res) => {
    try {
        const { location, type } = req.query;
        
        let query = supabase.from('rooms').select('*');

        if (location) {
            query = query.ilike('location', `%${location}%`);
        }

        if (type && type !== "All Types") {
            query = query.eq('property_type', type);
        }

        const { data, error } = await query;
        if (error) throw error;
        
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// 2. GET SINGLE ROOM
export const getRoomById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('rooms')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(404).json({ error: "Room not found" });
    }
};

// 3. CREATE ROOM
export const createRoom = async (req, res) => {
    try {
        const { title, location, price, property_type, tenant_preference, contact_number, owner_id, image_url } = req.body;
        const { data, error } = await supabase
            .from('rooms')
            .insert([{ title, location, price, property_type, tenant_preference, contact_number, owner_id, image_url }])
            .select();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// 4. GET MY ROOMS
export const getMyRooms = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { data, error } = await supabase.from('rooms').select('*').eq('owner_id', user_id);
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// 5. DELETE ROOM
export const deleteRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase.from('rooms').delete().eq('id', id);
        if (error) throw error;
        res.status(200).json({ message: "Room deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// 6. UPDATE ROOM
export const updateRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const { data, error } = await supabase.from('rooms').update(updates).eq('id', id).select();
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};