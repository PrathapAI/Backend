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

// Cloudinary signature endpoint for direct upload
router.get('/cloudinary/signature', (req, res) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;
  const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
  const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const folder = 'classified_uploads';
  // Build signature string
  const signatureString = `folder=${folder}&timestamp=${timestamp}${cloudinaryApiSecret}`;
  const signature = crypto.createHash('sha1').update(signatureString).digest('hex');
   // Log values for debugging
  console.log('Cloudinary Signature Debug:');
  console.log('apiKey:', cloudinaryApiKey);
  console.log('apiSecret:', cloudinaryApiSecret);
  console.log('cloudName:', cloudinaryCloudName);
  console.log('timestamp:', timestamp);
  console.log('folder:', folder);
  console.log('signatureString:', signatureString);
  console.log('signature:', signature);
  
  res.json({
    signature,
    timestamp,
    apiKey: cloudinaryApiKey,
    uploadUrl: `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/auto/upload`,
    folder
  });
});

router.get('/', getListings);
router.get('/:id', getListing);
router.post('/', auth, upload.array('images', 10), createListing);
router.put('/:id', auth, updateListing);
router.delete('/:id', auth, deleteListing);
router.get('/user/:userId', getUserListings);

export default router;
