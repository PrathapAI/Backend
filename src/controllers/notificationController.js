import Notification from '../models/Notification.js';
import User from '../models/User.js';

// Get all notifications for a user
export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const { unreadOnly } = req.query;
    
    const where = { UserID: userId };
    if (unreadOnly === 'true') {
      where.IsRead = false;
    }
    
    const notifications = await Notification.findAll({
      where,
      order: [['Timestamp', 'DESC']],
      limit: 50
    });
    
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get unread count
export const getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const count = await Notification.count({
      where: { UserID: userId, IsRead: false }
    });
    
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create notification
export const createNotification = async (req, res) => {
  try {
    const { UserID, NotificationType, Message } = req.body;
    
    if (!UserID || !Message) {
      return res.status(400).json({ error: 'UserID and Message are required' });
    }
    
    const notification = await Notification.create({
      UserID,
      NotificationType,
      Message
    });
    
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [updated] = await Notification.update(
      { IsRead: true },
      { where: { NotificationID: id } }
    );
    
    if (!updated) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    const notification = await Notification.findByPk(id);
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark all user notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const [updated] = await Notification.update(
      { IsRead: true },
      { where: { UserID: userId, IsRead: false } }
    );
    
    res.json({ message: `Marked ${updated} notifications as read` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const deleted = await Notification.destroy({
      where: { NotificationID: req.params.id }
    });
    
    if (!deleted) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Clear all user notifications
export const clearAllNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const deleted = await Notification.destroy({
      where: { UserID: userId }
    });
    
    res.json({ message: `Deleted ${deleted} notifications` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
