const db = require('../config/db');

function normalizeStatus(row) {
  if (!row) return row;
  return {
    ...row,
    status: typeof row.status === 'string' ? row.status.toLowerCase() : row.status,
    outcome: typeof row.outcome === 'string' ? row.outcome.toLowerCase().replace('-', '_') : row.outcome,
  };
}

function toDbStatus(status) {
  if (typeof status !== 'string') return status;
  return status.toLowerCase() === 'active' ? 'Active' : 'Pending';
}

function toDbOutcome(outcome) {
  const normalized = typeof outcome === 'string' ? outcome.toLowerCase() : outcome;
  if (normalized === 'completed') return 'Completed';
  if (normalized === 'cancelled') return 'Cancelled';
  if (normalized === 'no_show') return 'No-Show';
  return outcome;
}

class Reservation {
  static async create({ userId, seatId, scheduledStart }) {
    const [result] = await db.query(
      `INSERT INTO active_reservation (user_id, seat_id, scheduled_start, status)
       VALUES (?, ?, ?, 'Pending')`,
      [userId, seatId, scheduledStart]
    );
    return result.insertId;
  }

  static async findById(reservationId) {
    const [rows] = await db.query(
      'SELECT * FROM active_reservation WHERE reservation_id = ?',
      [reservationId]
    );
    return rows[0] || null;
  }

  static async findActiveByUser(userId) {
    const [rows] = await db.query(
      `SELECT ar.reservation_id, ar.user_id, ar.seat_id, ar.scheduled_start, ar.actual_check_in,
              LOWER(ar.status) AS status, t.table_label
       FROM active_reservation ar
       JOIN seat s ON s.seat_id = ar.seat_id
       JOIN library_table t ON t.table_id = s.table_id
       WHERE ar.user_id = ? AND ar.status IN ('Pending', 'Active')
       ORDER BY ar.scheduled_start DESC`,
      [userId]
    );
    return rows;
  }

  static async listAll() {
    const [rows] = await db.query(
      `SELECT ar.reservation_id, ar.user_id, ar.seat_id, ar.scheduled_start, ar.actual_check_in,
              LOWER(ar.status) AS status, u.full_name, u.email, t.table_label
       FROM active_reservation ar
       JOIN user u ON u.user_id = ar.user_id
       JOIN seat s ON s.seat_id = ar.seat_id
       JOIN library_table t ON t.table_id = s.table_id
       ORDER BY ar.scheduled_start DESC`
    );
    return rows;
  }

  static async listPending() {
    const [rows] = await db.query(
      `SELECT ar.reservation_id, ar.user_id, ar.seat_id, ar.scheduled_start, ar.actual_check_in,
              LOWER(ar.status) AS status, u.full_name, u.email, t.table_label
       FROM active_reservation ar
       JOIN user u ON u.user_id = ar.user_id
       JOIN seat s ON s.seat_id = ar.seat_id
       JOIN library_table t ON t.table_id = s.table_id
       WHERE ar.status = 'Pending'
       ORDER BY ar.scheduled_start ASC`
    );
    return rows;
  }

  static async updateStatus(reservationId, status) {
    const dbStatus = toDbStatus(status);
    await db.query(
      'UPDATE active_reservation SET status = ? WHERE reservation_id = ?',
      [dbStatus, reservationId]
    );
  }

  static async setCheckIn(reservationId, time) {
    await db.query(
      "UPDATE active_reservation SET actual_check_in = ?, status = 'Active' WHERE reservation_id = ?",
      [time, reservationId]
    );
  }

  static async delete(reservationId) {
    await db.query('DELETE FROM active_reservation WHERE reservation_id = ?', [reservationId]);
  }

  static async archive({ userId, seatId, reservationDate, endTime, outcome }) {
    await db.query(
      `INSERT INTO reservation_history (user_id, seat_id, reservation_date, end_time, outcome)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, seatId, reservationDate, endTime, toDbOutcome(outcome)]
    );
  }

  static async historyByUser(userId) {
    const [rows] = await db.query(
      `SELECT rh.history_id, rh.user_id, rh.seat_id, rh.reservation_date, rh.end_time,
              LOWER(REPLACE(rh.outcome, '-', '_')) AS outcome, t.table_label
       FROM reservation_history rh
       JOIN seat s ON s.seat_id = rh.seat_id
       JOIN library_table t ON t.table_id = s.table_id
       WHERE rh.user_id = ?
       ORDER BY rh.reservation_date DESC`,
      [userId]
    );
    return rows;
  }
}

module.exports = Reservation;
