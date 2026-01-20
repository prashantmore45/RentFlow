import { supabase } from '../index.js';

export const applyForRoom = async (req, res) => {
    const { room_id, owner_id, message, applicant_id } = req.body;

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


export const getMyApplications = async (req, res) => {
    const { user_id } = req.params;
    
    const { data, error } = await supabase
        .from('applications')
        .select('*, rooms(title, location, price)') 
        .eq('applicant_id', user_id);

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
};


export const getLandlordApplications = async (req, res) => {
    const { user_id } = req.params;

    const { data, error } = await supabase
        .from('applications')
        .select('*, rooms(title)')
        .eq('owner_id', user_id);

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
};


export const updateApplicationStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; 

    const { data, error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', id)
        .select();

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ message: `Application ${status}`, data });
};