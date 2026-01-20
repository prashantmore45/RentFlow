import { supabase } from '../index.js';

// 1. APPLY FOR A ROOM
export const applyForRoom = async (req, res) => {
    const { room_id, owner_id, message, applicant_id } = req.body;

    // Check if already applied
    const { data: existing } = await supabase
        .from('applications')
        .select('*')
        .eq('room_id', room_id)
        .eq('applicant_id', applicant_id)
        .single();

    if (existing) {
        return res.status(400).json({ message: "You have already applied for this room!" });
    }

    const { data, error } = await supabase
        .from('applications')
        .insert([{ room_id, owner_id, applicant_id, message }])
        .select();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ message: "Application sent successfully!", data });
};

// 2. GET MY APPLICATIONS (For Tenant)
export const getMyApplications = async (req, res) => {
    const { user_id } = req.params;
    
    // Join with 'rooms' table to get room details
    const { data, error } = await supabase
        .from('applications')
        .select('*, rooms(title, location, price)') 
        .eq('applicant_id', user_id);

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
};

// 3. GET APPLICANTS FOR MY ROOMS (For Landlord)
export const getLandlordApplications = async (req, res) => {
    const { user_id } = req.params;

    const { data, error } = await supabase
        .from('applications')
        .select('*, rooms(title)')
        .eq('owner_id', user_id);

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
};