const db = require('../config/db');

function normalizeStatus(row) {
  if (!row || !row.outcome) return row;
  const statusMap = { 'active': 'Active', 'pending': 'Pending', 'inactive': 'Inactive' };
  const currentStatus = typeof row.outcome === 'string' ? row.outcome.toLowerCase() : '';
  return { ...row, outcome: statusMap[currentStatus] || row.outcome };
}

function toDbStatus(status) {
  if (typeof status !== 'string') return status;
  return status.toLowerCase() === 'active' ? 'Active' : 'Pending';
}

/**
 * Expires any Pending reservations older than 30 minutes.
 * Marks them Inactive and frees their seats in one pass.
 * Called lazily before any query that would be affected by stale Pending rows.
 */
async function expireStaleReservations() {
  await db.query(
    `UPDATE Seat
     SET current_status = 'Available'
     WHERE seat_id IN (
       SELECT seat_id FROM Reservation_Record
       WHERE outcome = 'Pending'
         AND start_time <= NOW() - INTERVAL 30 MINUTE
     )`
  );
  await db.query(
    `UPDATE Reservation_Record
     SET outcome = 'Inactive', end_time = NOW()
     WHERE outcome = 'Pending'
       AND start_time <= NOW() - INTERVAL 30 MINUTE`
  );
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

  static async activeReservationCount(userId) {
    await expireStaleReservations();
    const [rows] = await db.query(
      "SELECT reservation_id FROM Reservation_Record WHERE user_id = ? AND outcome IN ('Pending', 'Active')",
      [userId]
    );
    return rows.length > 0;
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

  // Fetches Pending + Active reservations for the manager dashboard.
  // Pending always floats to the top, then sorted by date within each group.
  static async listActiveAndPending() {
    await expireStaleReservations();
    const [rows] = await db.query(
      `SELECT r.*, u.full_name, u.email, t.table_label
       FROM Reservation_Record r
       JOIN User u ON u.user_id = r.user_id
       JOIN Seat s ON s.seat_id = r.seat_id
       JOIN Library_Table t ON t.table_id = s.table_id
       WHERE r.outcome IN ('Pending', 'Active')
       ORDER BY
         CASE r.outcome WHEN 'Pending' THEN 0 ELSE 1 END ASC,
         r.reservation_date ASC`
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
