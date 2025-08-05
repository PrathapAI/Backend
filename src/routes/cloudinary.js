import express from 'express';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

router.get('/signature', (req, res) => {
  const timestamp = Math.round(Date.now() / 1000);
  const folder = 'classified_uploads';

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET
  );

  res.json({
    timestamp,
    signature,
    folder,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  });
});

export default router;
