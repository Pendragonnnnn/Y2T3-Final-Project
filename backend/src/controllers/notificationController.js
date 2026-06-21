const Notification = require('../models/Notification');

exports.list = async (req, res) => {
  try {
    const notifications = await Notification.listByUser(req.user.userId);
    const unreadCount = await Notification.unreadCount(req.user.userId);
    res.json({ notifications, unreadCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

exports.markRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    await Notification.markAsRead(notificationId, req.user.userId);
    res.json({ message: 'Marked as read' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update notification' });
  }
};
