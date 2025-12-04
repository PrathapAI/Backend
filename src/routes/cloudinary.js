import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import '../config/cloudinary.js'; // Ensures cloudinary is configured

const router = express.Router();

router.get('/signature', (req, res) => {
  const timestamp = Math.round(Date.now() / 1000);
  const folder = 'classified_uploads';

  console.log('Generating signature with timestamp:', timestamp, 'folder:', folder);
  console.log('CLOUDINARY_API_SECRET present:', !!process.env.CLOUDINARY_API_SECRET);

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET
  );

  console.log('Generated signature:', signature);

  res.json({
    timestamp,
    signature,
    folder,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    uploadUrl: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`
  });
});

export default router;

