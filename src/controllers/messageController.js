import Message from '../models/Message.js';
import User from '../models/User.js';
import Listing from '../models/Listing.js';
import { Op } from 'sequelize';

// Get all messages (admin)
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      include: [
        { model: User, as: 'Sender', attributes: ['UserID', 'Username', 'Email'] },
        { model: User, as: 'Recipient', attributes: ['UserID', 'Username', 'Email'] },
        { model: Listing, attributes: ['ListingID', 'Title'] }
      ],
      order: [['Timestamp', 'DESC']]
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single message
export const getMessage = async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id, {
      include: [
        { model: User, as: 'Sender', attributes: ['UserID', 'Username', 'Email'] },
        { model: User, as: 'Recipient', attributes: ['UserID', 'Username', 'Email'] },
        { model: Listing, attributes: ['ListingID', 'Title'] }
      ]
    });
    if (!message) return res.status(404).json({ error: 'Not found' });
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user's conversations (inbox/sent)
export const getUserMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const { type } = req.query; // 'inbox', 'sent', or 'all'
    
    let where = {};
    if (type === 'inbox') {
      where.RecipientID = userId;
    } else if (type === 'sent') {
      where.SenderID = userId;
    } else {
      where[Op.or] = [{ SenderID: userId }, { RecipientID: userId }];
    }
    
    const messages = await Message.findAll({
      where,
      include: [
        { model: User, as: 'Sender', attributes: ['UserID', 'Username', 'Email'] },
        { model: User, as: 'Recipient', attributes: ['UserID', 'Username', 'Email'] },
        { model: Listing, attributes: ['ListingID', 'Title'] }
      ],
      order: [['Timestamp', 'DESC']]
    });
    
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get conversation between two users
export const getConversation = async (req, res) => {
  try {
    const { userId, otherUserId } = req.params;
    
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { SenderID: userId, RecipientID: otherUserId },
          { SenderID: otherUserId, RecipientID: userId }
        ]
      },
      include: [
        { model: User, as: 'Sender', attributes: ['UserID', 'Username'] },
        { model: User, as: 'Recipient', attributes: ['UserID', 'Username'] },
        { model: Listing, attributes: ['ListingID', 'Title'] }
      ],
      order: [['Timestamp', 'ASC']]
    });
    
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get messages about a specific listing
export const getListingMessages = async (req, res) => {
  try {
    const { listingId } = req.params;
    
    const messages = await Message.findAll({
      where: { ListingID: listingId },
      include: [
        { model: User, as: 'Sender', attributes: ['UserID', 'Username', 'Email'] },
        { model: User, as: 'Recipient', attributes: ['UserID', 'Username', 'Email'] }
      ],
      order: [['Timestamp', 'DESC']]
    });
    
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Send a message
export const createMessage = async (req, res) => {
  try {
    const { SenderID, RecipientID, ListingID, MessageContent } = req.body;
    
    if (!SenderID || !RecipientID || !MessageContent) {
      return res.status(400).json({ error: 'SenderID, RecipientID, and MessageContent are required' });
    }
    
    const newMessage = await Message.create({ 
      SenderID, 
      RecipientID, 
      ListingID, 
      MessageContent 
    });
    
    // Fetch the created message with associations
    const messageWithDetails = await Message.findByPk(newMessage.MessageID, {
      include: [
        { model: User, as: 'Sender', attributes: ['UserID', 'Username'] },
        { model: User, as: 'Recipient', attributes: ['UserID', 'Username'] },
        { model: Listing, attributes: ['ListingID', 'Title'] }
      ]
    });
    
    res.status(201).json(messageWithDetails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update message (not typically used, but kept for completeness)
export const updateMessage = async (req, res) => {
  try {
    const [updated] = await Message.update(req.body, { 
      where: { MessageID: req.params.id }
    });
    
    if (!updated) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    const message = await Message.findByPk(req.params.id);
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete message
export const deleteMessage = async (req, res) => {
  try {
    const deleted = await Message.destroy({ where: { MessageID: req.params.id } });
    
    if (!deleted) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
