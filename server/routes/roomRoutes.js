import express from 'express';
import { createRoom, getRooms, getRoomById, getMyRooms, deleteRoom } from '../controllers/roomController.js';

const router = express.Router();

router.get('/', getRooms);     
router.post('/', createRoom); 
router.get('/:id', getRoomById);

router.get('/my-rooms/:user_id', getMyRooms);
router.delete('/:id', deleteRoom);

export default router;