import Favorite from '../models/Favorite.js';

export const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.findAll();
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findByPk(req.params.id);
    if (!favorite) return res.status(404).json({ error: 'Not found' });
    res.json(favorite);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createFavorite = async (req, res) => {
  try {
    const { UserID, ListingID } = req.body;
    const newFavorite = await Favorite.create({ UserID, ListingID });
    res.status(201).json(newFavorite);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateFavorite = async (req, res) => {
  try {
    const updated = await Favorite.update(req.body, { where: { FavoriteID: req.params.id }, returning: true });
    res.json(updated[1][0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteFavorite = async (req, res) => {
  try {
    await Favorite.destroy({ where: { FavoriteID: req.params.id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
