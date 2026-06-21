const db = require('../config/db');

class AuditLog {
  static async log({ performerId, actionTaken, targetId = null }) {
    await db.query(
      'INSERT INTO audit_log (performer_id, action_taken, target_id) VALUES (?, ?, ?)',
      [performerId, actionTaken, targetId]
    );
  }

  static async list(limit = 100) {
    const [rows] = await db.query(
      `SELECT al.*, u.full_name AS performer_name
       FROM audit_log al
       JOIN user u ON u.user_id = al.performer_id
       ORDER BY al.timestamp DESC
       LIMIT ?`,
      [limit]
    );
    return rows;
  }
}

module.exports = AuditLog;
