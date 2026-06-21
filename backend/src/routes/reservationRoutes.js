const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { authenticate, requireRole } = require('../middleware/auth');

// Student routes
router.post('/quick', authenticate, requireRole('student'), reservationController.quickRandomReserve);
router.post('/manual', authenticate, requireRole('student'), reservationController.manualReserve);
router.get('/mine', authenticate, requireRole('student'), reservationController.myReservations);
router.get('/history', authenticate, requireRole('student'), reservationController.myHistory);
router.delete('/:reservationId', authenticate, requireRole('student'), reservationController.cancelReservation);
router.post('/:reservationId/checkout', authenticate, requireRole('student'), reservationController.requestCheckout);

// Manager routes
router.get('/pending', authenticate, requireRole('manager'), reservationController.listPending);
router.get('/all', authenticate, requireRole('manager'), reservationController.listAll);
router.patch('/:reservationId/accept', authenticate, requireRole('manager'), reservationController.acceptReservation);
router.patch('/:reservationId/reject', authenticate, requireRole('manager'), reservationController.rejectReservation);
router.patch('/:reservationId/no-show', authenticate, requireRole('manager'), reservationController.triggerNoShowPenalty);
router.patch('/:reservationId/approve-checkout', authenticate, requireRole('manager'), reservationController.approveCheckout);

module.exports = router;
