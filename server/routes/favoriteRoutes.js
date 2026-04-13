import express from 'express';
import { supabase } from '../supabase.js';
import { verifyToken } from '../middleware/auth.js';
import { validateRequest, createFavoriteSchema } from '../middleware/validation.js';

const router = express.Router();

// TOGGLE Favorite (backward compatible - AUTHORIZED) - MUST BE BEFORE /:userId
router.post('/toggle/:roomId', verifyToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized - Authentication required' });
    }

    const roomId = req.params.roomId || req.body.room_id;
    const user_id = req.user.id;

    if (!roomId) {
      return res.status(400).json({ error: 'Room ID is required' });
    }

    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user_id)
      .eq('room_id', roomId)
      .single();

    if (existing) {
      await supabase
        .from('favorites')
        .delete()
        .eq('id', existing.id);
      res.json({ status: 'removed' });
    } else {
      await supabase
        .from('favorites')
        .insert([{ user_id, room_id: roomId, created_at: new Date().toISOString() }]);
      res.json({ status: 'added' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Alternative toggle endpoint using body params (backward compatibility)
router.post('/toggle', verifyToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized - Authentication required' });
    }

    const { room_id: roomId } = req.body;
    const user_id = req.user.id;

    if (!roomId) {
      return res.status(400).json({ error: 'Room ID is required' });
    }

    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user_id)
      .eq('room_id', roomId)
      .single();

    if (existing) {
      await supabase
        .from('favorites')
        .delete()
        .eq('id', existing.id);
      res.json({ status: 'removed' });
    } else {
      await supabase
        .from('favorites')
        .insert([{ user_id, room_id: roomId, created_at: new Date().toISOString() }]);
      res.json({ status: 'added' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add to Favorites (AUTHORIZED)
router.post('/', verifyToken, validateRequest(createFavoriteSchema), async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized - Authentication required' });
    }

    const { room_id } = req.validatedBody || req.body;
    const user_id = req.user.id;

    // Verify room exists
    const { data: room } = await supabase
      .from('rooms')
      .select('id')
      .eq('id', room_id)
      .single();

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Check if already favorited
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user_id)
      .eq('room_id', room_id)
      .single();

    if (existing) {
      return res.status(400).json({ error: 'Room already in favorites' });
    }

    const { data, error } = await supabase
      .from('favorites')
      .insert([{ user_id, room_id, created_at: new Date().toISOString() }])
      .select();

    if (error) throw error;
    res.status(201).json({ status: 'added', data: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove from Favorites (AUTHORIZED)
router.delete('/:favoriteId', verifyToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized - Authentication required' });
    }

    const { favoriteId } = req.params;

    // Verify ownership
    const { data: favorite, error: favError } = await supabase
      .from('favorites')
      .select('user_id')
      .eq('id', favoriteId)
      .single();

    if (favError || !favorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    if (favorite.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden - Only the owner can remove this favorite' });
    }

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', favoriteId);

    if (error) throw error;
    res.status(200).json({ status: 'removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET Favorites for a user (AUTHORIZED) - GENERIC ROUTE, MUST BE LAST
router.get('/:userId', verifyToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized - Authentication required' });
    }

    const { userId } = req.params;

    // Users can only fetch their own favorites
    if (userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden - Cannot access other users\' favorites' });
    }

    const { data, error } = await supabase
      .from('favorites')
      .select('room_id, id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;