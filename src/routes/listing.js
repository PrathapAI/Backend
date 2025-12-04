import express from 'express';
import Listing from '../models/Listing.js';
import upload from '../middleware/upload.js'; // Multer config
import auth from '../middleware/auth.js';
import { createListing } from '../controllers/listingController.js';
const router = express.Router();

// Create - Use the controller that handles ImageURLs array and ListingImages table
router.post('/', auth, createListing);

// Read all
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.findAll();
    // Ensure ImageURL is always present and consistent in response
    const listingsWithImage = listings.map(l => ({
      ...l.dataValues,
      ImageURL: l.ImageURL && l.ImageURL !== '' ? l.ImageURL : null
    }));
    res.json(listingsWithImage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read one
import { getListing } from '../controllers/listingController.js';

// ...existing code...

// Read one (full details)
router.get('/:id', getListing);

// Update
router.put('/:id', auth, async (req, res) => {
  try {
    const [updatedRows] = await Listing.update(req.body, { where: { ListingID: req.params.id } });
    if (!updatedRows) return res.status(404).json({ error: 'Not found' });
    const updatedListing = await Listing.findByPk(req.params.id);
    res.json(updatedListing);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedRows = await Listing.destroy({ where: { ListingID: req.params.id } });
    if (!deletedRows) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
