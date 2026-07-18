const db = require('../config/db');

function normalizeStatus(row) {
  if (!row || !row.outcome) return row;
  const statusMap = { 'active': 'Active', 'pending': 'Pending', 'inactive': 'Inactive' };
  const currentStatus = typeof row.outcome === 'string' ? row.outcome.toLowerCase() : '';
  return { ...row, outcome: statusMap[currentStatus] || row.outcome };
}

function toDbStatus(status) {
  if (typeof status !== 'string') return status;
  const normalized = status.toLowerCase();
  if (normalized === 'active') return 'Active';
  if (normalized === 'inactive') return 'Inactive';
  return 'Pending';
}


class Reservation {
  static async create(data) {
    const [result] = await db.query(
      "INSERT INTO Reservation_Record (user_id, seat_id, reservation_date, start_time, outcome) VALUES (?, ?, ?, ?, ?)",
      [data.user_id, data.seat_id, data.reservation_date, data.start_time, data.outcome]
    );
    return result.insertId;
  }

  static async activeReservationCount(userId) {
    const [rows] = await db.query(
      "SELECT r.reservation_id FROM Reservation_Record r JOIN User u ON u.user_id = r.user_id WHERE r.user_id = ? AND r.outcome IN ('Pending', 'Active') AND u.role = 'Student'",
      [userId]
    );
    return rows.length > 0;
  }

  static async findById(reservationId) {
    const [rows] = await db.query(
      'SELECT * FROM Reservation_Record WHERE reservation_id = ?',
      [reservationId]
    );
    return rows[0] || null;
  }

  static async findActiveByUser(userId) {
    const [rows] = await db.query(
      `SELECT r.*, t.table_label
       FROM Reservation_Record r
       JOIN Seat s ON s.seat_id = r.seat_id
       JOIN Library_Table t ON t.table_id = s.table_id
       WHERE r.user_id = ? AND r.outcome IN ('Pending', 'Active')
       ORDER BY r.reservation_date DESC`,
      [userId]
    );
    return rows;
  }

  // Fetches Pending + Active reservations for the manager dashboard.
  // Pending always floats to the top, then sorted by date within each group.
  static async listActiveAndPending() {
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
      `SELECT r.*, u.full_name, u.email, t.table_label
       FROM Reservation_Record r
       JOIN User u ON u.user_id = r.user_id
       JOIN Seat s ON s.seat_id = r.seat_id
       JOIN Library_Table t ON t.table_id = s.table_id
       ORDER BY r.reservation_date DESC`
    );
    return rows;
  }

  static async listPending() {
    const [rows] = await db.query(
      `SELECT r.*, u.full_name, u.email, t.table_label
       FROM Reservation_Record r
       JOIN User u ON u.user_id = r.user_id
       JOIN Seat s ON s.seat_id = r.seat_id
       JOIN Library_Table t ON t.table_id = s.table_id
       WHERE r.outcome = 'Pending'
       ORDER BY r.reservation_date ASC`
    );
    return rows;
  }

  static async updateOutcome(reservationId, outcome) {
    await db.query(
      'UPDATE Reservation_Record SET outcome = ? WHERE reservation_id = ?',
      [outcome, reservationId]
    );
  }

  static async setCheckIn(reservationId, time) {
    await db.query(
      "UPDATE Reservation_Record SET check_in_time = ?, outcome = 'Active' WHERE reservation_id = ?",
      [time, reservationId]
    );
  }

  static async finalizeReservation(reservationId, endTime, outcome) {
    await db.query(
      "UPDATE Reservation_Record SET end_time = ?, outcome = ? WHERE reservation_id = ?",
      [endTime, outcome, reservationId]
    );
  }

  static async delete(reservationId) {
    await db.query('DELETE FROM Reservation_Record WHERE reservation_id = ?', [reservationId]);
  }

  static async historyByUser(userId) {
    const [rows] = await db.query(
      `SELECT r.*, t.table_label
       FROM Reservation_Record r
       JOIN Seat s ON s.seat_id = r.seat_id
       JOIN Library_Table t ON t.table_id = s.table_id
       WHERE r.user_id = ? AND r.outcome = 'Inactive'
       ORDER BY r.reservation_date DESC`,
      [userId]
    );
    return rows;
  }

  // Last N reservations for a user regardless of outcome (used by the manager's
  // per-student history view). Includes rows where the student never checked in
  // (check_in_time IS NULL) so no-shows are visible too. Duration is only
  // computed when both check_in_time and end_time are present — otherwise the
  // student either never checked in or the session is still ongoing.
  static async recentByUser(userId, limit = 10) {
    const safeLimit = Number.isInteger(limit) && limit > 0 ? limit : 10;
    const [rows] = await db.query(
      `SELECT r.*, t.table_label,
              CASE
                WHEN r.check_in_time IS NOT NULL AND r.end_time IS NOT NULL
                  THEN TIMESTAMPDIFF(MINUTE, r.check_in_time, r.end_time)
                ELSE NULL
              END AS duration_minutes
       FROM Reservation_Record r
       JOIN Seat s ON s.seat_id = r.seat_id
       JOIN Library_Table t ON t.table_id = s.table_id
       WHERE r.user_id = ?
       ORDER BY r.reservation_date DESC
       LIMIT ${safeLimit}`,
      [userId]
    );
    return rows;
  }

  static async getPeriodicStats() {
  const [today] = await db.query(
    `SELECT COUNT(*) as count FROM Reservation_Record WHERE DATE(reservation_date) = CURDATE()`
  );
  const [week] = await db.query(
    `SELECT COUNT(*) as count FROM Reservation_Record WHERE YEARWEEK(reservation_date, 1) = YEARWEEK(CURDATE(), 1)`
  );
  const [month] = await db.query(
    `SELECT COUNT(*) as count FROM Reservation_Record WHERE MONTH(reservation_date) = MONTH(CURDATE()) AND YEAR(reservation_date) = YEAR(CURDATE())`
  );

  return {
    today: today[0]?.count,
    week: week[0]?.count,
    month: month[0]?.count
  };
}

// Add this inside your Reservation class in Reservation.js
static async getPeakHours() {
  const [rows] = await db.query(
    `SELECT 
        HOUR(start_time) AS hour,  -- Use start_time here instead of reservation_date
        COUNT(*) AS count
     FROM Reservation_Record
     WHERE start_time >= NOW() - INTERVAL 30 DAY
     GROUP BY HOUR(start_time)
     ORDER BY count DESC 
     LIMIT 5`
  );
  return rows;
}

}



module.exports = Reservation;