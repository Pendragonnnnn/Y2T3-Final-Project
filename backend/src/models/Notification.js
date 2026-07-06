const db = require('../config/db');

// create a notification for a user
class Notification {
  static async create({ recipientId, title, messageBody }) {
    await db.query(
      'INSERT INTO notification (recipient_id, title, message_body) VALUES (?, ?, ?)',
      [recipientId, title, messageBody]
    );
  }

  // Get all notifications for one user
  static async listByUser(userId) {
    const [rows] = await db.query(
      'SELECT * FROM notification WHERE recipient_id = ? ORDER BY created_at DESC LIMIT 50',
      [userId]
    );
    return rows;
  }

  // Count unread notifications for a user
  static async unreadCount(userId) {
    const [rows] = await db.query(
      'SELECT COUNT(*) as count FROM notification WHERE recipient_id = ? AND is_read = 0',
      [userId]
    );
    return rows[0].count;
  }

  // Mark a notification as read for a user
  static async markAsRead(notificationId, userId) {
    await db.query(
      'UPDATE notification SET is_read = 1 WHERE notification_id = ? AND recipient_id = ?',
      [notificationId, userId]
    );
  }

  // Mark all notifications as read for a user
  static async markAllAsRead(userId) {
    await db.query(
      'UPDATE notification SET is_read = 1 WHERE recipient_id = ?',
      [userId]
    );
  }

  // Delete one notification (optional)
  static async delete(notificationId, userId) {
    await db.query(
      'DELETE FROM notification WHERE notification_id = ? AND recipient_id = ?',
      [notificationId, userId]
    );
  }
}

module.exports = Notification;