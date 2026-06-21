const db = require('../config/db');

function toDbRole(role) {
  const normalized = typeof role === 'string' ? role.toLowerCase() : 'student';
  if (normalized === 'manager') return 'Manager';
  if (normalized === 'admin') return 'Admin';
  return 'Student';
}

class User {
  static async create({ email, password, fullName, role }) {
    const [result] = await db.query(
      'INSERT INTO user (email, password, full_name, role) VALUES (?, ?, ?, ?)',
      [email, password, fullName, toDbRole(role)]
    );
    if (toDbRole(role) === 'Student') {
      await db.query(
        'INSERT INTO student_profile (user_id, current_penalty_score) VALUES (?, 100)',
        [result.insertId]
      );
    }
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
    return rows[0] || null;
  }

  static async findById(userId) {
    const [rows] = await db.query(
      `SELECT u.user_id, u.email, u.full_name, u.role, u.created_at,
              sp.current_penalty_score
       FROM user u
       LEFT JOIN student_profile sp ON sp.user_id = u.user_id
       WHERE u.user_id = ?`,
      [userId]
    );
    return rows[0] || null;
  }

  static async listStudents() {
    const [rows] = await db.query(
      `SELECT u.user_id, u.email, u.full_name, sp.current_penalty_score
       FROM user u
       JOIN student_profile sp ON sp.user_id = u.user_id
       WHERE u.role = 'Student'
       ORDER BY u.full_name`
    );
    return rows;
  }

  static async adjustPenaltyScore(userId, delta) {
    await db.query(
      'UPDATE student_profile SET current_penalty_score = GREATEST(0, current_penalty_score + ?) WHERE user_id = ?',
      [delta, userId]
    );
  }
}

module.exports = User;
