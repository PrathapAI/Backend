import Review from '../models/Review.js';
import User from '../models/User.js';
import Listing from '../models/Listing.js';
import sequelize from '../config/sequelize.js';

// Get all reviews
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        { model: User, attributes: ['UserID', 'Username', 'Email'] },
        { model: Listing, attributes: ['ListingID', 'Title'] }
      ],
      order: [['ReviewDate', 'DESC']]
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single review
export const getReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['UserID', 'Username', 'Email'] },
        { model: Listing, attributes: ['ListingID', 'Title'] }
      ]
    });
    if (!review) return res.status(404).json({ error: 'Not found' });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get reviews for a specific listing
export const getListingReviews = async (req, res) => {
  try {
    const { listingId } = req.params;
    
    const reviews = await Review.findAll({
      where: { ListingID: listingId },
      include: [
        { model: User, attributes: ['UserID', 'Username'] }
      ],
      order: [['ReviewDate', 'DESC']]
    });
    
    // Calculate average rating
    const avgRating = await Review.findOne({
      where: { ListingID: listingId },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('Rating')), 'averageRating'],
        [sequelize.fn('COUNT', sequelize.col('ReviewID')), 'totalReviews']
      ],
      raw: true
    });
    
    res.json({
      reviews,
      averageRating: parseFloat(avgRating?.averageRating || 0).toFixed(1),
      totalReviews: parseInt(avgRating?.totalReviews || 0)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get reviews by a specific user
export const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const reviews = await Review.findAll({
      where: { UserID: userId },
      include: [
        { model: Listing, attributes: ['ListingID', 'Title'] }
      ],
      order: [['ReviewDate', 'DESC']]
    });
    
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a review
export const createReview = async (req, res) => {
  try {
    const { ListingID, UserID, Rating, Comment } = req.body;
    
    if (!ListingID || !UserID || !Rating) {
      return res.status(400).json({ error: 'ListingID, UserID, and Rating are required' });
    }
    
    if (Rating < 1 || Rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    // Check if user already reviewed this listing
    const existing = await Review.findOne({
      where: { ListingID, UserID }
    });
    
    if (existing) {
      return res.status(400).json({ error: 'You have already reviewed this listing' });
    }
    
    const newReview = await Review.create({ ListingID, UserID, Rating, Comment });
    
    // Fetch with associations
    const reviewWithDetails = await Review.findByPk(newReview.ReviewID, {
      include: [
        { model: User, attributes: ['UserID', 'Username'] },
        { model: Listing, attributes: ['ListingID', 'Title'] }
      ]
    });
    
    res.status(201).json(reviewWithDetails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a review
export const updateReview = async (req, res) => {
  try {
    const { Rating, Comment } = req.body;
    
    if (Rating && (Rating < 1 || Rating > 5)) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    const [updated] = await Review.update(
      { Rating, Comment },
      { where: { ReviewID: req.params.id } }
    );
    
    if (!updated) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    const review = await Review.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['UserID', 'Username'] },
        { model: Listing, attributes: ['ListingID', 'Title'] }
      ]
    });
    
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const deleted = await Review.destroy({ where: { ReviewID: req.params.id } });
    
    if (!deleted) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
