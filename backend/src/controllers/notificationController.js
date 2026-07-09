const Notification = require("../models/Notification");

// Get all notifications for a user
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.listByUser(req.params.userId);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Get unread notification count for a user
exports.getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.params;
    const unreadCount = await Notification.unreadCount(userId);
    return res.status(200).json({ unreadCount: Number(unreadCount) });
  } catch (err) {
    console.error('Error in getUnreadCount:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Mark a single notification as read
exports.markRead = async (req, res) => {
  try {
    await Notification.markAsRead(
      req.params.notificationId,
      req.params.userId
    );
    res.json({
      message: "Notification updated",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Mark all notifications as read for a user
exports.markAllRead = async (req, res) => {
  try {
    await Notification.markAllAsRead(req.params.userId);
    res.json({
      message: "All notifications marked as read",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};