import express from 'express';
import { 
  getReviews, 
  getReview, 
  getListingReviews,
  getUserReviews,
  createReview, 
  updateReview, 
  deleteReview 
} from '../controllers/reviewController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all reviews
router.get('/', getReviews);

// Get single review
router.get('/:id', getReview);

// Get reviews for a specific listing
router.get('/listing/:listingId', getListingReviews);

// Get reviews by a specific user
router.get('/user/:userId', getUserReviews);

// Create review
router.post('/', auth, createReview);

// Update review
router.put('/:id', auth, updateReview);

// Delete review
router.delete('/:id', auth, deleteReview);

export default router;
