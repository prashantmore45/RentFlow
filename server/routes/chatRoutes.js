import express from 'express';
import { supabase } from '../supabase.js';
import { verifyToken } from '../middleware/auth.js';
import { validateRequest, createMessageSchema } from '../middleware/validation.js';

const router = express.Router();

// 1. GET Conversation between two users (AUTHORIZED)
router.get('/:roomId/:otherUserId/:myUserId', verifyToken, async (req, res) => {
  const { roomId, otherUserId, myUserId } = req.params;
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized - Authentication required' });
    }

    // User can only fetch their own messages
    if (myUserId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden - Cannot access other users\' messages' });
    }

    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        rooms(id, title)
      `)
      .eq('room_id', roomId)
      .or(`and(sender_id.eq.${myUserId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${myUserId})`)
      .order('created_at', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. SEND Message (AUTHORIZED)
router.post('/', verifyToken, validateRequest(createMessageSchema), async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized - Authentication required' });
    }

    const { room_id, receiver_id, content } = req.validatedBody || req.body;
    const sender_id = req.user.id;

    // Cannot message yourself
    if (sender_id === receiver_id) {
      return res.status(400).json({ error: 'Cannot send message to yourself' });
    }

    // Verify room exists and users are involved
    const { data: room } = await supabase
      .from('rooms')
      .select('id')
      .eq('id', room_id)
      .single();

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const { data, error } = await supabase
      .from('messages')
      .insert([{
        sender_id,
        receiver_id,
        room_id,
        content,
        created_at: new Date().toISOString()
      }])
      .select(`
        *,
        rooms(id, title)
      `)
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. GET MY INBOX (AUTHORIZED)
router.get('/my-chats/:userId', verifyToken, async (req, res) => {
  const { userId } = req.params;
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized - Authentication required' });
    }

    // Users can only fetch their own inbox
    if (userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden - Cannot access other users\' inbox' });
    }

    // Fetch raw messages with Room data
    const { data: messages, error } = await supabase
      .from('messages')
      .select(`
        *,
        rooms(id, title, image_url)
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Group messages by conversation
    const conversations = {};
    messages.forEach(msg => {
      const isSender = msg.sender_id === userId;
      const partnerId = isSender ? msg.receiver_id : msg.sender_id;
      const key = `${msg.room_id}-${partnerId}`;

      if (!conversations[key]) {
        conversations[key] = msg;
      }
    });

    res.json(Object.values(conversations));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE Message (AUTHORIZED - Sender only)
router.delete('/:messageId', verifyToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized - Authentication required' });
    }

    const { messageId } = req.params;

    // Verify ownership
    const { data: message, error: msgError } = await supabase
      .from('messages')
      .select('sender_id')
      .eq('id', messageId)
      .single();

    if (msgError || !message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.sender_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden - Only the sender can delete this message' });
    }

    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);

    if (error) throw error;
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;