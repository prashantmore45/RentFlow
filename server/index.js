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

// Import Middleware
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ROUTES 
app.use('/api/rooms', roomRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/favorites', favoriteRoutes); 
app.use('/api/reviews', reviewRoutes);
app.use('/api/chat', chatRoutes);

// Health check endpoint
app.get('/', (req, res) => {
    res.send('API is running... RentFlow Backend is Live!');
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Error Handler Middleware
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});