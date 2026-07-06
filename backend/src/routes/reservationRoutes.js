const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { authenticate, requireRole } = require('../middleware/auth');

// ── Student routes ──────────────────────────────────────────────────────────
router.post('/quick',            authenticate, requireRole('student'), reservationController.quickRandomReserve);
router.get('/check-status',      authenticate, requireRole('student'), reservationController.checkStatus);
router.post('/manual',           authenticate, requireRole('student'), reservationController.manualReserve);
router.get('/mine',              authenticate, requireRole('student'), reservationController.myReservations);
router.get('/history',           authenticate, requireRole('student'), reservationController.myHistory);
router.delete('/:reservationId', authenticate, requireRole('student'), reservationController.cancelReservation);

// ── QR scanner routes ───────────────────────────────────────────────────────
router.post('/scan-checkin',     authenticate, requireRole('manager'), reservationController.scanCheckIn);
router.post('/scan-checkout',    authenticate, requireRole('manager'), reservationController.scanCheckOut);

// ── Manager routes ──────────────────────────────────────────────────────────
router.get('/active-and-pending',authenticate, requireRole('manager'), reservationController.listActiveAndPending);
router.get('/pending',           authenticate, requireRole('manager'), reservationController.listPending);
router.get('/all',               authenticate, requireRole('manager'), reservationController.listAll);
router.get('/manager/student/:userId/history',   authenticate, requireRole('manager'), reservationController.studentHistory);
router.patch('/:reservationId/checkin',          authenticate, requireRole('manager'), reservationController.checkInReservation);
router.patch('/:reservationId/accept',           authenticate, requireRole('manager'), reservationController.acceptReservation);
router.patch('/:reservationId/reject',           authenticate, requireRole('manager'), reservationController.rejectReservation);
router.patch('/:reservationId/no-show',          authenticate, requireRole('manager'), reservationController.triggerNoShowPenalty);
router.patch('/:reservationId/approve-checkout', authenticate, requireRole('manager'), reservationController.approveCheckout);

module.exports = router;