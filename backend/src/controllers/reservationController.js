const Reservation = require('../models/Reservation');
const Seat = require('../models/Seat');
const PenaltyRecord = require('../models/PenaltyRecord');
const Notification = require('../models/Notification');
const User = require('../models/User');

// ── Student: Quick Random Reserve ───────────────────────────────
exports.quickRandomReserve = async (req, res) => {
  try {
    const available = await Seat.findAvailable();
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

// ── Student: Choose Your Own Seat ───────────────────────────────
exports.manualReserve = async (req, res) => {
  try {
    const { seatId } = req.body;
    const seat = await Seat.findById(seatId);
    if (!seat) return res.status(404).json({ error: 'Seat not found' });
    if (seat.current_status !== 'available') {
      return res.status(409).json({ error: 'This seat is not available' });
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
    userId,
    seatId,
    scheduledStart: new Date(),
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
    await Reservation.archive({
      userId: reservation.user_id,
      seatId: reservation.seat_id,
      reservationDate: reservation.scheduled_start,
      endTime: new Date(),
      outcome: 'cancelled',
    });
    await Reservation.delete(reservationId);

    res.json({ message: 'Reservation cancelled' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to cancel reservation' });
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

exports.listAll = async (req, res) => {
  try {
    const reservations = await Reservation.listAll();
    res.json({ reservations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
};

// ── Manager: accept reservation ───────────────────────────────────
exports.acceptReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });

    await Reservation.updateStatus(reservationId, 'Active');
    await Notification.create({
      recipientId: reservation.user_id,
      title: 'Reservation approved',
      messageBody: 'Your seat reservation is now active. Please check in within 10 minutes.',
    });

    res.json({ message: 'Reservation approved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to accept reservation' });
  }
};

// ── Manager: reject reservation (no penalty — not the student's fault) ──
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

// ── No-show penalty trigger (timeout-based, NOT manager rejection) ──
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
      messageBody: 'You did not check in within 10 minutes of your reservation. A penalty has been applied.',
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
