import SearchHistory from '../models/SearchHistory.js';
import User from '../models/User.js';

// Get all search history (with optional user filter)
export const getSearchHistory = async (req, res) => {
  try {
    const { userId } = req.query;
    const where = userId ? { UserID: userId } : {};
    
    const searches = await SearchHistory.findAll({
      where,
      include: [
        { model: User, attributes: ['UserID', 'Username', 'Email'] }
      ],
      order: [['SearchDate', 'DESC']],
      limit: 50
    });
    res.json(searches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user's recent searches
export const getUserSearchHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 20;
    
    const searches = await SearchHistory.findAll({
      where: { UserID: userId },
      order: [['SearchDate', 'DESC']],
      limit
    });
    res.json(searches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Save a search query
export const createSearchHistory = async (req, res) => {
  try {
    const { UserID, SearchQuery } = req.body;
    
    if (!UserID || !SearchQuery) {
      return res.status(400).json({ error: 'UserID and SearchQuery are required' });
    }
    
    const newSearch = await SearchHistory.create({
      UserID,
      SearchQuery
    });
    
    res.status(201).json(newSearch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Clear user's search history
export const clearUserSearchHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const deleted = await SearchHistory.destroy({
      where: { UserID: userId }
    });
    
    res.json({ message: `Deleted ${deleted} search records` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete specific search entry
export const deleteSearchHistory = async (req, res) => {
  try {
    const deleted = await SearchHistory.destroy({
      where: { SearchID: req.params.id }
    });
    
    if (!deleted) {
      return res.status(404).json({ error: 'Search history not found' });
    }
    
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
