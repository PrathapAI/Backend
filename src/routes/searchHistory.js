import express from 'express';
import { 
  getSearchHistory, 
  getUserSearchHistory, 
  createSearchHistory, 
  clearUserSearchHistory,
  deleteSearchHistory 
} from '../controllers/searchHistoryController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all search history (with optional user filter)
router.get('/', getSearchHistory);

// Get user's search history
router.get('/user/:userId', getUserSearchHistory);

// Save a search query
router.post('/', auth, createSearchHistory);

// Clear user's search history
router.delete('/user/:userId', auth, clearUserSearchHistory);

// Delete specific search entry
router.delete('/:id', auth, deleteSearchHistory);

export default router;
