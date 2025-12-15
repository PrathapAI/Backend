import Favorite from '../models/Favorite.js';
import Listing from '../models/Listing.js';
import User from '../models/User.js';
import ListingImage from '../models/ListingImage.js';
import Category from '../models/Category.js';
import Location from '../models/Location.js';

// Get all favorites (admin)
export const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.findAll({
      include: [
        { model: User, attributes: ['UserID', 'Username', 'Email'] },
        { 
          model: Listing, 
          attributes: ['ListingID', 'Title', 'Description', 'ExpectedPrice', 'IsActive'],
          include: [
            { model: ListingImage, as: 'ListingImages', attributes: ['ImageURL', 'Ordinal'] },
            { model: Category, attributes: ['CategoryName'] },
            { model: Location, attributes: ['state', 'district', 'mandal', 'village'] }
          ]
        }
      ],
      order: [['DateAdded', 'DESC']]
    });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single favorite
export const getFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['UserID', 'Username', 'Email'] },
        { 
          model: Listing, 
          attributes: ['ListingID', 'Title', 'Description', 'ExpectedPrice', 'IsActive'],
          include: [
            { model: ListingImage, as: 'ListingImages', attributes: ['ImageURL', 'Ordinal'] }
          ]
        }
      ]
    });
    if (!favorite) return res.status(404).json({ error: 'Not found' });
    res.json(favorite);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user's favorite listings
export const getUserFavorites = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const favorites = await Favorite.findAll({
      where: { UserID: userId },
      include: [
        { 
          model: Listing, 
          attributes: ['ListingID', 'Title', 'Description', 'ExpectedPrice', 'IsActive', 'CreateDate'],
          include: [
            { model: ListingImage, as: 'ListingImages', attributes: ['ImageURL', 'Ordinal'] },
            { model: Category, attributes: ['CategoryID', 'CategoryName'] },
            { model: Location, attributes: ['state', 'district', 'mandal', 'village'] },
            { model: User, attributes: ['UserID', 'Username', 'PhoneNumber'] }
          ]
        }
      ],
      order: [['DateAdded', 'DESC']]
    });
    
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Check if listing is favorited by user
export const checkFavorite = async (req, res) => {
  try {
    const { userId, listingId } = req.params;
    
    const favorite = await Favorite.findOne({
      where: { UserID: userId, ListingID: listingId }
    });
    
    res.json({ isFavorite: !!favorite, favorite });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add to favorites
export const createFavorite = async (req, res) => {
  try {
    const { UserID, ListingID } = req.body;
    
    if (!UserID || !ListingID) {
      return res.status(400).json({ error: 'UserID and ListingID are required' });
    }
    
    // Check if already favorited
    const existing = await Favorite.findOne({
      where: { UserID, ListingID }
    });
    
    if (existing) {
      return res.status(400).json({ error: 'Listing already in favorites' });
    }
    
    const newFavorite = await Favorite.create({ UserID, ListingID });
    
    // Fetch with listing details
    const favoriteWithDetails = await Favorite.findByPk(newFavorite.FavoriteID, {
      include: [
        { 
          model: Listing, 
          attributes: ['ListingID', 'Title', 'ExpectedPrice'],
          include: [
            { model: ListingImage, as: 'ListingImages', attributes: ['ImageURL'], limit: 1 }
          ]
        }
      ]
    });
    
    res.status(201).json(favoriteWithDetails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove from favorites (by FavoriteID)
export const deleteFavorite = async (req, res) => {
  try {
    const deleted = await Favorite.destroy({ 
      where: { FavoriteID: req.params.id } 
    });
    
    if (!deleted) {
      return res.status(404).json({ error: 'Favorite not found' });
    }
    
    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove from favorites by UserID and ListingID
export const removeFavorite = async (req, res) => {
  try {
    const { userId, listingId } = req.params;
    
    const deleted = await Favorite.destroy({
      where: { UserID: userId, ListingID: listingId }
    });
    
    if (!deleted) {
      return res.status(404).json({ error: 'Favorite not found' });
    }
    
    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update favorite (not commonly used)
export const updateFavorite = async (req, res) => {
  try {
    const [updated] = await Favorite.update(req.body, { 
      where: { FavoriteID: req.params.id }
    });
    
    if (!updated) {
      return res.status(404).json({ error: 'Favorite not found' });
    }
    
    const favorite = await Favorite.findByPk(req.params.id);
    res.json(favorite);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
