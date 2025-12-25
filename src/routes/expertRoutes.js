import express from 'express';
import {
  registerExpert,
  loginExpert,
  getExpertProfile,
  updateExpertProfile,
  getAvailableListings,
  placeBid,
  getExpertBids,
  withdrawBid,
  getListingBids,
  acceptBid,
  rejectBid,
  getAllExperts
} from '../controllers/expertController.js';
import { authenticateExpert } from '../middleware/expertAuth.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', registerExpert);
router.post('/login', loginExpert);
router.get('/all', getAllExperts); // Public list of experts

// Protected expert routes
router.get('/profile', authenticateExpert, getExpertProfile);
router.put('/profile', authenticateExpert, updateExpertProfile);
router.get('/listings/available', authenticateExpert, getAvailableListings);
router.post('/bids', authenticateExpert, placeBid);
router.get('/bids', authenticateExpert, getExpertBids);
router.put('/bids/:bidId/withdraw', authenticateExpert, withdrawBid);

// Protected user routes (for listing owners)
router.get('/listings/:listingId/bids', auth, getListingBids);
router.put('/bids/:bidId/accept', auth, acceptBid);
router.put('/bids/:bidId/reject', auth, rejectBid);

export default router;
