const db = require('../config/db');

function normalizeSeatRow(row) {
  return row
    ? { ...row, current_status: typeof row.current_status === 'string' ? row.current_status.toLowerCase() : row.current_status }
    : row;
}

class Seat {
  static async getMap() {
    const [rows] = await db.query(
      `SELECT s.seat_id, LOWER(s.current_status) AS current_status,
              t.table_id, t.table_label, t.positionX, t.positionY, t.rotation
       FROM library_table t
       LEFT JOIN seat s ON t.table_id = s.table_id
       ORDER BY t.table_label, s.seat_id`
    );
    return rows;
  }

  

  static async findById(seatId) {
    const [rows] = await db.query('SELECT * FROM seat WHERE seat_id = ?', [seatId]);
    return normalizeSeatRow(rows[0] || null);
  }

  static async findAvailable() {
    const [rows] = await db.query(
      "SELECT * FROM seat WHERE current_status = 'Available'"
    );
    return rows.map(normalizeSeatRow);
  }

  static async updateStatus(seatId, status) {
    const dbStatus = typeof status === 'string' ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : status;
    await db.query('UPDATE Seat SET current_status = ? WHERE seat_id = ?', [dbStatus, seatId]);
  }

  static async getStats() {
    const [rows] = await db.query(
      `SELECT LOWER(current_status) AS current_status, COUNT(*) as count FROM seat GROUP BY current_status`
    );
    const total = rows.reduce((sum, r) => sum + r.count, 0);
    const stats = { total, available: 0, occupied: 0, blocked: 0 };
    rows.forEach(r => { stats[r.current_status] = r.count; });
    return stats;
  }
}

module.exports = Seat;
