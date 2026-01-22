import express from 'express';
import { createRoom, getRooms, getRoomById, getMyRooms, deleteRoom, updateRoom } from '../controllers/roomController.js';

const router = express.Router();

// Public Routes
router.get('/', getRooms);          
router.get('/:id', getRoomById);   

// Protected/User Routes
router.post('/', createRoom);
router.delete('/:id', deleteRoom);
router.put('/:id', updateRoom);

// Dashboard Route
router.get('/my-rooms/:ownerId', getMyRooms); 

export default router;