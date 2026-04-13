import express from 'express';
import { supabase } from '../supabase.js';
import { verifyToken } from '../middleware/auth.js';
import { validateRequest, createReviewSchema } from '../middleware/validation.js';

const router = express.Router();

// GET Reviews for a Room (Public - No auth required)
router.get('/:roomId', async (req, res) => {
  const { roomId } = req.params;
  try {
    // Validate room exists
    const { data: room } = await supabase
      .from('rooms')
      .select('id')
      .eq('id', roomId)
      .single();

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

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
        profiles: userProfile || { id: review.user_id, full_name: 'Anonymous User', avatar_url: null }
      };
    });

    res.json(reviewsWithProfiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a Review (AUTHORIZED - Auth required)
router.post('/', verifyToken, validateRequest(createReviewSchema), async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized - Authentication required' });
    }

    const { room_id, rating, comment } = req.validatedBody || req.body;
    const user_id = req.user.id;

    // Verify room exists
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('id')
      .eq('id', room_id)
      .single();

    if (roomError || !room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Check if user already reviewed this room
    const { data: existing } = await supabase
      .from('reviews')
      .select('id')
      .eq('room_id', room_id)
      .eq('user_id', user_id)
      .single();

    if (existing) {
      return res.status(400).json({ error: 'You have already reviewed this room' });
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert([{ room_id, user_id, rating, comment, created_at: new Date().toISOString() }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a Review (AUTHORIZED - Owner only)
router.delete('/:reviewId', verifyToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized - Authentication required' });
    }

    const { reviewId } = req.params;

    // Verify ownership
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .select('user_id')
      .eq('id', reviewId)
      .single();

    if (reviewError || !review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (review.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden - Only the review author can delete this' });
    }

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);

    if (error) throw error;
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;