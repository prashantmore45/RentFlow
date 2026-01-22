import { supabase } from '../supabase.js';

// 1. GET ALL ROOMS (With Search Logic)
export const getRooms = async (req, res) => {
    const { location, type } = req.query;

    try {
        let query = supabase.from('rooms').select('*');

        if (location) {
            query = query.ilike('location', `%${location}%`);
        }
        if (type && type !== 'Any Type') {
            query = query.eq('property_type', type);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 2. GET SINGLE ROOM
export const getRoomById = async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('rooms')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        res.status(404).json({ error: "Room not found" });
    }
};

// 3. CREATE ROOM
export const createRoom = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('rooms')
            .insert([req.body])
            .select();

        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. GET MY ROOMS (For Dashboard)
export const getMyRooms = async (req, res) => {
    const { ownerId } = req.params; 
    try {
        const { data, error } = await supabase
            .from('rooms')
            .select('*')
            .eq('owner_id', ownerId);

        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 5. DELETE ROOM
export const deleteRoom = async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase
            .from('rooms')
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.status(200).json({ message: "Room deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 6. UPDATE ROOM
export const updateRoom = async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('rooms')
            .update(req.body)
            .eq('id', id)
            .select();

        if (error) throw error;
        res.status(200).json(data[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};