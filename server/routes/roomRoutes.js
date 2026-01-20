import express from 'express';
import { createRoom, getRooms, getRoomById } from '../controllers/roomController.js';

const router = express.Router();

router.get('/', getRooms);     
router.post('/', createRoom); 
router.get('/:id', getRoomById);

export default router;