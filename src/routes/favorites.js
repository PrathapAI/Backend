import express from 'express';
import { 
  getFavorites, 
  getFavorite, 
  getUserFavorites,
  checkFavorite,
  createFavorite, 
  updateFavorite, 
  deleteFavorite,
  removeFavorite
} from '../controllers/favoriteController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all favorites (admin)
router.get('/', getFavorites);

// Get single favorite
router.get('/:id', getFavorite);

// Get user's favorite listings
router.get('/user/:userId', auth, getUserFavorites);

// Check if listing is favorited
router.get('/check/:userId/:listingId', auth, checkFavorite);

// Add to favorites
router.post('/', auth, createFavorite);

// Update favorite
router.put('/:id', auth, updateFavorite);

// Remove from favorites (by FavoriteID)
router.delete('/:id', auth, deleteFavorite);

// Remove from favorites (by UserID and ListingID)
router.delete('/user/:userId/listing/:listingId', auth, removeFavorite);

export default router;
