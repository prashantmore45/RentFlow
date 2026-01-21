import express from 'express';
import { supabase } from '../supabase.js';

const router = express.Router();

// GET Reviews for a Room (with User Names)
router.get('/:roomId', async (req, res) => {
  const { roomId } = req.params;
  try {
    const { data: reviews, error: reviewError } = await supabase
      .from('reviews')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: false });

    if (reviewError) throw reviewError;

    if (!reviews || reviews.length === 0) {
        return res.json([]);
    }

    const userIds = reviews.map(r => r.user_id);

    const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url') 
        .in('id', userIds);
    
    if (profileError) throw profileError;

    const reviewsWithProfiles = reviews.map(review => {
        const userProfile = profiles.find(p => p.id === review.user_id);
        return {
            ...review,
            profiles: userProfile || { full_name: 'Anonymous User' } 
        };
    });

    res.json(reviewsWithProfiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a Review
router.post('/', async (req, res) => {
  const { room_id, user_id, rating, comment } = req.body;
  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert([{ room_id, user_id, rating, comment }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;