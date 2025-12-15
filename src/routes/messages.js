import express from 'express';
import { 
  getMessages, 
  getMessage, 
  getUserMessages,
  getConversation,
  getListingMessages,
  createMessage, 
  updateMessage, 
  deleteMessage 
} from '../controllers/messageController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all messages (admin)
router.get('/', getMessages);

// Get single message
router.get('/:id', getMessage);

// Get user's messages (inbox/sent/all)
router.get('/user/:userId', auth, getUserMessages);

// Get conversation between two users
router.get('/conversation/:userId/:otherUserId', auth, getConversation);

// Get messages about a specific listing
router.get('/listing/:listingId', getListingMessages);

// Send message
router.post('/', auth, createMessage);

// Update message
router.put('/:id', auth, updateMessage);

// Delete message
router.delete('/:id', auth, deleteMessage);

export default router;
