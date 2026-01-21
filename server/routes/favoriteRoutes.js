import express from 'express';
import { supabase } from '../supabase.js';

const router = express.Router();

// GET Favorites for a user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('room_id')
      .eq('user_id', userId);

    if (error) throw error;
    res.json(data.map(item => item.room_id)); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// TOGGLE Favorite (Like/Unlike)
router.post('/toggle', async (req, res) => {
  const { user_id, room_id } = req.body;
  try {
    const { data: existing } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user_id)
      .eq('room_id', room_id)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', existing.id);
      if (error) throw error;
      res.json({ status: 'removed' });
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert([{ user_id, room_id }]);
      if (error) throw error;
      res.json({ status: 'added' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;