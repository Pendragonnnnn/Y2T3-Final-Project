const db = require('../config/db');

class Notification {
  static async create({ recipientId, title, messageBody }) {
    await db.query(
      'INSERT INTO notification (recipient_id, title, message_body) VALUES (?, ?, ?)',
      [recipientId, title, messageBody]
    );
  }

  static async listByUser(userId) {
    const [rows] = await db.query(
      'SELECT * FROM notification WHERE recipient_id = ? ORDER BY created_at DESC LIMIT 50',
      [userId]
    );
    return rows;
  }

  static async markAsRead(notificationId, userId) {
    await db.query(
      'UPDATE notification SET is_read = 1 WHERE notification_id = ? AND recipient_id = ?',
      [notificationId, userId]
    );
  }

  static async unreadCount(userId) {
    const [rows] = await db.query(
      'SELECT COUNT(*) as count FROM notification WHERE recipient_id = ? AND is_read = 0',
      [userId]
    );
    return rows[0].count;
  }
}

module.exports = Notification;
