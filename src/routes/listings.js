import express from 'express';


import {
  createListing,
  getListings,
  getListing,
  updateListing,
  deleteListing,
  getUserListings
} from '../controllers/listingController.js';
import crypto from 'crypto';
import upload from '../middleware/upload.js';
import auth from '../middleware/auth.js';


const router = express.Router();



router.get('/', getListings);
router.get('/:id', getListing);
router.post('/', auth, upload.array('images', 10), createListing);
router.put('/:id', auth, updateListing);
router.delete('/:id', auth, deleteListing);
router.get('/user/:userId', getUserListings);

export default router;
