import Review from '../models/Review.js';
import User from '../models/User.js';
import Listing from '../models/Listing.js';

export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        { model: User, attributes: ['Username', 'Email'] },
        { model: Listing, attributes: ['Title'] }
      ]
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['Username', 'Email'] },
        { model: Listing, attributes: ['Title'] }
      ]
    });
    if (!review) return res.status(404).json({ error: 'Not found' });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const { ListingID, UserID, Rating, Comment } = req.body;
    const newReview = await Review.create({ ListingID, UserID, Rating, Comment });
    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const updated = await Review.update(req.body, { where: { ReviewID: req.params.id }, returning: true });
    res.json(updated[1][0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    await Review.destroy({ where: { ReviewID: req.params.id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
