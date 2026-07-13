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
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
    return rows[0] || null;
  }

  static async findById(userId) {
    const [rows] = await db.query(
      `SELECT u.user_id, u.email, u.full_name, u.role
       FROM user u
       WHERE u.user_id = ?`,
      [userId]
    );
    return rows[0] || null;
  }

  static async listStudents() {
    const [rows] = await db.query(
      `SELECT u.user_id, u.email, u.full_name
       FROM user u
       WHERE u.role = 'Student'
       ORDER BY u.full_name`
    );
    return rows;
  }

  

  /**
   * Returns the stored password value for a given user.
   * Used by the change-password flow to verify the current password.
   */
  static async getPasswordById(userId) {
    const [rows] = await db.query(
      'SELECT password FROM user WHERE user_id = ?',
      [userId]
    );
    return rows[0]?.password ?? null;
  }

  /**
   * Overwrites the stored password for a user.
   */
  static async updatePassword(userId, newPassword) {
    await db.query(
      'UPDATE user SET password = ? WHERE user_id = ?',
      [newPassword, userId]
    );
  }
}

module.exports = User;