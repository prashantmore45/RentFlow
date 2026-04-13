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

// 3. CREATE ROOM (AUTHORIZED - User can only create their own rooms)
export const createRoom = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized - Authentication required' });
        }

        // Use validated body from validation middleware
        const roomData = req.validatedBody || req.body;
        
        const { data, error } = await supabase
            .from('rooms')
            .insert([{
                ...roomData,
                owner_id: req.user.id,
                created_at: new Date().toISOString()
            }])
            .select();

        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. GET MY ROOMS (AUTHORIZED)
export const getMyRooms = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized - Authentication required' });
        }

        // Users can only fetch their own rooms
        const { ownerId } = req.params;
        if (ownerId !== req.user.id) {
            return res.status(403).json({ error: 'Forbidden - Cannot access other users\' rooms' });
        }

        const { data, error } = await supabase
            .from('rooms')
            .select('*')
            .eq('owner_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 5. DELETE ROOM (AUTHORIZED - Owner only)
export const deleteRoom = async (req, res) => {
    const { id } = req.params;
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized - Authentication required' });
        }

        // First, get the room to verify ownership
        const { data: room, error: fetchError } = await supabase
            .from('rooms')
            .select('owner_id')
            .eq('id', id)
            .single();

        if (fetchError || !room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        // Check if user is the owner
        if (room.owner_id !== req.user.id) {
            return res.status(403).json({ error: 'Forbidden - Only the owner can delete this room' });
        }

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

// 6. UPDATE ROOM (AUTHORIZED - Owner only)
export const updateRoom = async (req, res) => {
    const { id } = req.params;
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized - Authentication required' });
        }

        // First, get the room to verify ownership
        const { data: room, error: fetchError } = await supabase
            .from('rooms')
            .select('owner_id')
            .eq('id', id)
            .single();

        if (fetchError || !room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        // Check if user is the owner
        if (room.owner_id !== req.user.id) {
            return res.status(403).json({ error: 'Forbidden - Only the owner can update this room' });
        }

        // Use validated body from validation middleware
        const updateData = req.validatedBody || req.body;
        
        const { data, error } = await supabase
            .from('rooms')
            .update({
                ...updateData,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select();

        if (error) throw error;
        res.status(200).json(data[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};