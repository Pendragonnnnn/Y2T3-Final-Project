const db = require('../config/db');

class Feedback {
  static async create({ userId, starRating, comment, sentiment, confidence }) {
    const [result] = await db.query(
      `INSERT INTO feedback (user_id, star_rating, comment, sentiment, confidence, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [userId, starRating, comment || null, sentiment, confidence]
    );
    return result.insertId;
  }

  static async listAll() {
    const [rows] = await db.query(
      `SELECT f.*, u.full_name
       FROM feedback f
       JOIN user u ON u.user_id = f.user_id
       ORDER BY f.created_at DESC`
    );
    return rows;
  }

  static async sentimentBreakdown() {
    const [rows] = await db.query(
      `SELECT sentiment, COUNT(*) as count FROM feedback
       WHERE sentiment IS NOT NULL
       GROUP BY sentiment`
    );
    const breakdown = { bug: 0, feature_request: 0, management_issue: 0, general: 0 };
    rows.forEach(r => { breakdown[r.sentiment] = r.count; });
    const total = breakdown.bug + breakdown.feature_request + breakdown.management_issue + breakdown.general;

    const [avgRows] = await db.query('SELECT AVG(star_rating) as avg_rating FROM feedback');
    const avgRating = avgRows[0].avg_rating ? Number(avgRows[0].avg_rating).toFixed(2) : null;

    return { breakdown, total, avgRating };
  }
}

module.exports = Feedback;