const db = require('../config/db');

class PenaltyRecord {
  static async create({ userId, violationType }) {
    await db.query(
      'INSERT INTO penalty_record (user_id, violation_type) VALUES (?, ?)',
      [userId, violationType]
    );
  }

  static async listByUser(userId) {
    const [rows] = await db.query(
      'SELECT * FROM penalty_record WHERE user_id = ? ORDER BY timestamp DESC',
      [userId]
    );
    return rows;
  }
}

module.exports = PenaltyRecord;
