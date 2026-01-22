import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Routes
import roomRoutes from './routes/roomRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js'; 
import reviewRoutes from './routes/reviewRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// ROUTES 
app.use('/api/rooms', roomRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/favorites', favoriteRoutes); 
app.use('/api/reviews', reviewRoutes);
app.use('/api/chat', chatRoutes);


app.get('/', (req, res) => {
    res.send('API is running... RentFlow Backend is Live!');
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});