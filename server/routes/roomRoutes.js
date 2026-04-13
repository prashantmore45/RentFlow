import express from 'express';
import { createRoom, getRooms, getRoomById, getMyRooms, deleteRoom, updateRoom } from '../controllers/roomController.js';
import { verifyToken } from '../middleware/auth.js';
import { validateRequest, createRoomSchema, updateRoomSchema } from '../middleware/validation.js';

const router = express.Router();

// Public Routes - No auth required
router.get('/', getRooms);
router.get('/:id', getRoomById);

// Protected Routes - Auth required
router.post('/', verifyToken, validateRequest(createRoomSchema), createRoom);
router.put('/:id', verifyToken, validateRequest(updateRoomSchema), updateRoom);
router.delete('/:id', verifyToken, deleteRoom);

// My Rooms Route - Auth required
router.get('/my-rooms/:ownerId', verifyToken, getMyRooms);

export default router;