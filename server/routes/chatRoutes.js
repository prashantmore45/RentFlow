import express from 'express';
import { supabase } from '../supabase.js';

const router = express.Router();

// 1. GET Conversation between two users
router.get('/:roomId/:otherUserId/:myUserId', async (req, res) => {
  const { roomId, otherUserId, myUserId } = req.params;
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('room_id', roomId)
      .or(`and(sender_id.eq.${myUserId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${myUserId})`)
      .order('created_at', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. SEND Message
router.post('/', async (req, res) => {
  const { sender_id, receiver_id, room_id, content } = req.body;
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([{ sender_id, receiver_id, room_id, content }])
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. GET MY INBOX 
router.get('/my-chats/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        // Fetch raw messages with Room data
        const { data: messages, error } = await supabase
            .from('messages')
            .select(`
                *,
                rooms (id, title, image_url)
            `)
            .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Collect all Unique User IDs involved (Senders + Receivers)
        const userIds = new Set();
        messages.forEach(msg => {
            if(msg.sender_id) userIds.add(msg.sender_id);
            if(msg.receiver_id) userIds.add(msg.receiver_id);
        });

        // Fetch Profiles for these IDs manually
        const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .in('id', Array.from(userIds));

        if (profileError) throw profileError;

        // Attach Profile Data to Messages
        const enrichedMessages = messages.map(msg => {
            const sender = profiles.find(p => p.id === msg.sender_id) || { id: msg.sender_id, full_name: 'User', avatar_url: null };
            const receiver = profiles.find(p => p.id === msg.receiver_id) || { id: msg.receiver_id, full_name: 'User', avatar_url: null };
            
            return {
                ...msg,
                sender,
                receiver
            };
        });

        res.json(enrichedMessages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;