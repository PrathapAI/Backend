import express from 'express';
import { 
  getUserNotifications,
  getUnreadCount,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications
} from '../controllers/notificationController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get user's notifications
router.get('/user/:userId', auth, getUserNotifications);

// Get unread count
router.get('/user/:userId/unread-count', auth, getUnreadCount);

// Create notification
router.post('/', createNotification);

// Mark notification as read
router.put('/:id/read', auth, markAsRead);

// Mark all user notifications as read
router.put('/user/:userId/read-all', auth, markAllAsRead);

// Delete notification
router.delete('/:id', auth, deleteNotification);

// Clear all user notifications
router.delete('/user/:userId/clear', auth, clearAllNotifications);

export default router;
