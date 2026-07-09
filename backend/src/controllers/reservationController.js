const Reservation = require('../models/Reservation');
const Seat = require('../models/Seat');
const PenaltyRecord = require('../models/PenaltyRecord');
const Notification = require('../models/Notification');
const User = require('../models/User');


// ── Student: Quick Random Reserve ───────────────────────────────
exports.quickRandomReserve = async (req, res) => {
  try {
    const available = await Seat.findAvailable();
    const hasActive = await Reservation.activeReservationCount(req.user.userId);
    if (hasActive) {
      return res.status(403).json({ error: 'You already have an active or pending reservation.' });
    }
    if (available.length === 0) {
      return res.status(409).json({ error: 'No seats are currently available' });
    }
    const seat = available[Math.floor(Math.random() * available.length)];
    const reservationId = await createReservation(req.user.userId, seat.seat_id);
    res.status(201).json({ message: 'Seat reserved', reservationId, seat });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create reservation' });
  }
};

exports.checkStatus = async (req, res) => {
  try {
    console.log("Checking status for user:", req.user?.userId);
    const reservations = await Reservation.activeReservationCount(req.user.userId);
    res.json({ hasActive: reservations.length > 0 });
  } catch (err) {
    console.error("DEBUG:", err);
    res.status(500).json({ error: 'Failed to fetch status' });
  }
};

exports.manualReserve = async (req, res) => {
  try {
    const { seatId } = req.body;
    const seat = await Seat.findById(seatId);

    if (!seat) return res.status(404).json({ error: 'Seat not found' });
    if (seat.current_status !== 'available') {
      return res.status(409).json({ error: 'This seat is not available' });
    }

    const hasActive = await Reservation.activeReservationCount(req.user.userId);
    if (hasActive) {
      return res.status(403).json({ error: 'You already have an active or pending reservation.' });
    }

    const reservationId = await createReservation(req.user.userId, seatId);
    res.status(201).json({ message: 'Seat reserved', reservationId, seat });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create reservation' });
  }
};

async function createReservation(userId, seatId) {
  const reservationId = await Reservation.create({
    user_id: userId,
    seat_id: seatId,
    reservation_date: new Date(),
    start_time: new Date(),
    outcome: 'Pending',
  });
  await Seat.updateStatus(seatId, 'occupied');
  return reservationId;
}

// ── Student: view own active reservations ───────────────────────
exports.myReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findActiveByUser(req.user.userId);
    res.json({ reservations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
};

exports.myHistory = async (req, res) => {
  try {
    const history = await Reservation.historyByUser(req.user.userId);
    res.json({ history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reservation history' });
  }
};

// ── Student: cancel a reservation ────────────────────────────────
exports.cancelReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const reservation = await Reservation.findById(reservationId);

    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });
    if (reservation.user_id !== req.user.userId) {
      return res.status(403).json({ error: 'You can only cancel your own reservation' });
    }

    await Seat.updateStatus(reservation.seat_id, 'available');
    await Reservation.updateOutcome(reservationId, 'Inactive');

    res.json({ message: 'Reservation cancelled' });
  } catch (err) {
    console.error('Cancellation Crash:', err);
    res.status(500).json({ error: 'Failed to cancel reservation' });
  }
};

exports.checkInReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });

    if (reservation.status === 'Active') {
      return res.json({ message: 'Reservation already active', reservation });
    }

    await Reservation.setCheckIn(reservationId, new Date());
    await Notification.create({
      recipientId: reservation.user_id,
      title: 'Reservation checked in',
      messageBody: 'Your reservation has been confirmed by the library manager.',
    });

    res.json({ message: 'Reservation checked in', reservation: { ...reservation, status: 'active', actual_check_in: new Date() } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to check in reservation' });
  }
};

// ── Manager: view pending / all reservations ─────────────────────
exports.listPending = async (req, res) => {
  try {
    const reservations = await Reservation.listPending();
    res.json({ reservations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch pending reservations' });
  }
};

exports.listActiveAndPending = async (req, res) => {
  try {
    const reservations = await Reservation.listActiveAndPending();
    res.json({ reservations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
};

exports.listAll = async (req, res) => {
  try {
    const reservations = await Reservation.listAll();
    res.json({ reservations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
};

// ── Manager: recent reservation history for a single student ──────
// Returns the last 10 reservations for the given user, whether or not
// they ever checked in. Used by ManagerStudents.jsx when a manager
// clicks into a student to see their history and how long each visit lasted.
exports.studentHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await Reservation.recentByUser(userId, 10);
    res.json({ history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch student history' });
  }
};

// ── Manager: accept reservation ───────────────────────────────────
exports.acceptReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });

    await Reservation.setCheckIn(reservationId, new Date());
    await Notification.create({
      recipientId: reservation.user_id,
      title: 'Reservation approved',
      messageBody: 'Your seat reservation is now active. Please proceed to your seat.',
    });

    res.json({ message: 'Reservation approved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to accept reservation' });
  }
};

// ── Manager: reject reservation ──────────────────────────────────
exports.rejectReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });

    await Seat.updateStatus(reservation.seat_id, 'available');
    await Reservation.delete(reservationId);

    await Notification.create({
      recipientId: reservation.user_id,
      title: 'Reservation rejected',
      messageBody: 'Your seat reservation request was rejected by the library manager.',
    });

    res.json({ message: 'Reservation rejected' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to reject reservation' });
  }
};

// ── No-show penalty trigger ──────────────────────────────────────
exports.triggerNoShowPenalty = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });

    await Seat.updateStatus(reservation.seat_id, 'available');
    await Reservation.archive({
      userId: reservation.user_id,
      seatId: reservation.seat_id,
      reservationDate: reservation.scheduled_start,
      endTime: new Date(),
      outcome: 'no_show',
    });
    await Reservation.delete(reservationId);

    await PenaltyRecord.create({ userId: reservation.user_id, violationType: 'NO_SHOW' });
    await User.adjustPenaltyScore(reservation.user_id, 10);

    await Notification.create({
      recipientId: reservation.user_id,
      title: 'Penalty applied',
      messageBody: 'You did not check in within the allowed time. A penalty has been applied.',
    });

    res.json({ message: 'No-show penalty applied' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to apply penalty' });
  }
};

// ── Student: request checkout ─────────────────────────────────────
exports.requestCheckout = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });
    if (reservation.user_id !== req.user.userId) {
      return res.status(403).json({ error: 'You can only checkout your own reservation' });
    }

    res.json({ message: 'Checkout requested. Waiting for manager approval.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to request checkout' });
  }
};

// ── Manager: approve checkout ─────────────────────────────────────
exports.approveCheckout = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });

    await Seat.updateStatus(reservation.seat_id, 'available');
    await Reservation.archive({
      userId: reservation.user_id,
      seatId: reservation.seat_id,
      reservationDate: reservation.scheduled_start,
      endTime: new Date(),
      outcome: 'completed',
    });
    await Reservation.delete(reservationId);

    await Notification.create({
      recipientId: reservation.user_id,
      title: 'Checkout approved',
      messageBody: 'Your checkout has been approved. Thank you for using the Smart Library System!',
    });

    res.json({ message: 'Checkout approved', reservation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to approve checkout' });
  }
};


// ════════════════════════════════════════════════════════════════════════════
// QR SCANNER HANDLERS
// Called by ManagerScanner.jsx when the USB gun reads a student's phone screen
// ════════════════════════════════════════════════════════════════════════════

// ── QR Scan: Check-In (Pending → Active) ─────────────────────────────────────
// Expiry is validated server-side against the reservation's own start_time.
// The client-supplied expiresAt field in the QR is NOT trusted for security —
// we recompute the deadline from the DB record so it cannot be spoofed.
exports.scanCheckIn = async (req, res) => {
  try {
    const { reservationId } = req.body;

    // 1. Fetch the reservation
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found.' });
    }

    // 2. Guard: must be Pending to check in
    if (reservation.outcome === 'Active') {
      return res.status(409).json({ error: 'Student is already checked in.' });
    }
    if (reservation.outcome !== 'Pending') {
      return res.status(409).json({
        error: `Cannot check in — reservation status is "${reservation.outcome}".`,
      });
    }

    // 3. Validate the 30-minute window using the DB start_time (not client data)
    const NO_SHOW_WINDOW_MS = 30 * 60 * 1000;
    const startTime = reservation.start_time || reservation.reservation_date;
    const deadline = new Date(new Date(startTime).getTime() + NO_SHOW_WINDOW_MS);
    if (new Date() > deadline) {
      // The cron job will clean this up shortly; surface a clear message now
      return res.status(410).json({
        error: 'The 30-minute check-in window has passed. This reservation will be cancelled automatically.',
      });
    }

    // 4. Set check-in time & flip outcome to Active
    await Reservation.setCheckIn(reservationId, new Date());

    // 5. Notify student
    await Notification.create({
      recipientId: reservation.user_id,
      title: 'Checked in!',
      messageBody: `You have been checked in to Seat ${reservation.seat_id}. Enjoy your study session!`,
    });

    res.json({
      message: 'Check-in successful',
      seatId: reservation.seat_id,
      reservationId,
    });
  } catch (err) {
    console.error('scanCheckIn error:', err);
    res.status(500).json({ error: 'Failed to process check-in.' });
  }
};

// ── QR Scan: Check-Out (Active → Inactive) ───────────────────────────────────
// No expiry — students can check out whenever they're done.
exports.scanCheckOut = async (req, res) => {
  try {
    const { reservationId } = req.body;

    // 1. Fetch the reservation
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found.' });
    }

    // 2. Guard: must be Active to check out
    if (reservation.outcome === 'Inactive') {
      return res.status(409).json({ error: 'Student is already checked out.' });
    }
    if (reservation.outcome !== 'Active') {
      return res.status(409).json({
        error: `Cannot check out — reservation status is "${reservation.outcome}". Student must check in first.`,
      });
    }

    // 3. Finalise: set end_time, flip outcome to Inactive, free the seat
    await Reservation.finalizeReservation(reservationId, new Date(), 'Inactive');
    await Seat.updateStatus(reservation.seat_id, 'available');

    // 4. Notify student
    await Notification.create({
      recipientId: reservation.user_id,
      title: 'Checked out!',
      messageBody: 'Your session has ended. Thank you for using the Smart Library System!',
    });

    res.json({
      message: 'Check-out successful',
      seatId: reservation.seat_id,
      reservationId,
    });
  } catch (err) {
    console.error('scanCheckOut error:', err);
    res.status(500).json({ error: 'Failed to process check-out.' });
  }
};

exports.displayPeakHours = async (req, res) => {
  try {
    const peakHours = await Reservation.getPeakHours();
    res.json({
      peakHours: peakHours,
    }
    );
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to process.' });
  }
};