import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import roomRoutes from './routes/roomRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use('/api/rooms', roomRoutes);
app.use('/api/applications', applicationRoutes);

export const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

app.get('/', (req, res) => {
    res.send('API is running... Room Finder Backend is Live!');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});