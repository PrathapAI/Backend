import Message from '../models/Message.js';

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.findAll();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMessage = async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (!message) return res.status(404).json({ error: 'Not found' });
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createMessage = async (req, res) => {
  try {
    const { SenderID, RecipientID, ListingID, MessageContent } = req.body;
    const newMessage = await Message.create({ SenderID, RecipientID, ListingID, MessageContent });
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateMessage = async (req, res) => {
  try {
    const updated = await Message.update(req.body, { where: { MessageID: req.params.id }, returning: true });
    res.json(updated[1][0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    await Message.destroy({ where: { MessageID: req.params.id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
