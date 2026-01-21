import express from 'express';
import { createRoom, getRooms, getRoomById, getMyRooms, deleteRoom, updateRoom, getFavorite, toggleFavorite } from '../controllers/roomController.js';

const router = express.Router();

router.get('/', getRooms);     
router.post('/', createRoom); 
router.get('/:id', getRoomById);

router.get('/my-rooms/:user_id', getMyRooms);
router.delete('/:id', deleteRoom);
router.put('/:id', updateRoom);


router.get('/favorites/:userId', getFavorite);
router.post('/favorites/toggle', toggleFavorite);

export default router;