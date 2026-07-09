/**
 * noShowJob.js
 * 
 * Run this file as a background process alongside your Express server.
 * It checks every minute for Pending reservations older than 30 minutes
 * and auto-cancels them (frees the seat, marks outcome Inactive).
 *
 * Usage — add to your server entry point (e.g. index.js / app.js):
 *
 *   require('./jobs/noShowJob');
 *
 * Or run separately:
 *
 *   node jobs/noShowJob.js
 */

const db = require('../config/db');

const CHECK_INTERVAL_MS = 60 * 1000;   // 60 seconds
const NO_SHOW_WINDOW_MS = 30 * 60 * 1000; // 30 minutes

async function expireNoShows() {
  try {
    // Find all Pending reservations whose start_time is more than 30 min ago
    const cutoff = new Date(Date.now() - NO_SHOW_WINDOW_MS);

    const [rows] = await db.query(
      `SELECT reservation_id, seat_id, user_id
       FROM Reservation_Record
       WHERE outcome = 'Pending'
         AND start_time <= ?`,
      [cutoff]
    );

    if (rows.length === 0) return;

    console.log(`[noShowJob] Expiring ${rows.length} no-show reservation(s)…`);

    for (const row of rows) {
      try {
        // 1. Free the seat
        await db.query(
          "UPDATE Seat SET current_status = 'Available' WHERE seat_id = ?",
          [row.seat_id]
        );

        // 2. Mark the reservation Inactive (keeps it in history)
        await db.query(
          "UPDATE Reservation_Record SET outcome = 'Inactive', end_time = NOW() WHERE reservation_id = ?",
          [row.reservation_id]
        );

        // 3. Optional: send a notification row
        await db.query(
          `INSERT INTO Notification (recipient_id, title, message_body)
           VALUES (?, 'Reservation expired', 'Your reservation was cancelled because you did not check in within 30 minutes.')`,
          [row.user_id]
        );

        console.log(`[noShowJob] Expired reservation #${row.reservation_id} (seat ${row.seat_id})`);
      } catch (innerErr) {
        console.error(`[noShowJob] Failed to expire reservation #${row.reservation_id}:`, innerErr);
      }
    }
  } catch (err) {
    console.error('[noShowJob] Query error:', err);
  }
}

// Run immediately on startup, then every minute
expireNoShows();
setInterval(expireNoShows, CHECK_INTERVAL_MS);

module.exports = { expireNoShows }; // exported for testing
