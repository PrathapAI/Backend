import express from 'express';
import { getMessages, getMessage, createMessage, updateMessage, deleteMessage } from '../controllers/messageController.js';

const router = express.Router();

router.get('/', getMessages);
router.get('/:id', getMessage);
router.post('/', createMessage);
router.put('/:id', updateMessage);
router.delete('/:id', deleteMessage);

export default router;
