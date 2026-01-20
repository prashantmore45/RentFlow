import { supabase } from '../index.js';

// ADD NEW ROOM
export const createRoom = async (req, res) => {
    try {
        const { 
            title, 
            location, 
            price, 
            property_type, 
            tenant_preference, 
            contact_number, 
            owner_id
        } = req.body;

        if (!title || !price || !location || !contact_number) {
            return res.status(400).json({ error: "Please fill all required fields." });
        }

        const { data, error } = await supabase
            .from('rooms')
            .insert([{
                owner_id,
                title,
                location,
                price,
                property_type,
                tenant_preference,
                contact_number
            }])
            .select(); 

        if (error) throw error;

        res.status(201).json({ message: "Room created successfully", room: data[0] });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET ALL ROOMS
export const getRooms = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('rooms')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET SINGLE ROOM
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