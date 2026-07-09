const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { authenticate, requireRole } = require('../middleware/auth');

/**
 * @swagger
 * /api/reservations/quick:
 *   post:
 *     tags:               
 *       - Reservation
 * 
 *     summary: Quick random reservation
 *     description: Automatically assigns an available seat randomly to the student.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Seat reserved successfully
 *       409:
 *         description: No seats are currently available
 *       500:
 *         description: Failed to create reservation
 */
router.post('/quick', authenticate, requireRole('student'), reservationController.quickRandomReserve);

/**
 * @swagger
 * /api/reservations/check-status:
 *   get:
 *     tags:               
 *       - Reservation
 *     summary: Check student active reservation status
 *     description: Determines if the student currently holds any active or pending reservations.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Verification response returning a boolean flag
 *       500:
 *         description: Failed to fetch status
 */
router.get('/check-status', authenticate, requireRole('student'), reservationController.checkStatus);

/**
 * @swagger
 * /api/reservations/manual:
 *   post:
 *     tags:               
 *       - Reservation
 *     summary: Manually reserve a target seat
 *     description: Reserves a specific seat selected by the student.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - seatId
 *             properties:
 *               seatId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Target seat successfully reserved
 *       403:
 *         description: Forbidden - Student already has an active or pending reservation
 *       404:
 *         description: Seat not found
 *       409:
 *         description: This seat is not available
 *       500:
 *         description: Failed to create reservation
 */
router.post('/manual', authenticate, requireRole('student'), reservationController.manualReserve);

/**
 * @swagger
 * /api/reservations/mine:
 *   get:
 *     tags:               
 *       - Reservation
 *     summary: Get user's active/pending reservations
 *     description: Returns the logged-in student's active or pending reservation data.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array list of running active/pending reservations
 *       500:
 *         description: Failed to fetch reservations
 */
router.get('/mine', authenticate, requireRole('student'), reservationController.myReservations);

/**
 * @swagger
 * /api/reservations/history:
 *   get:
 *     tags:               
 *       - Reservation
 *     summary: Get user's historic inactive records
 *     description: Returns the logged-in student's completed or expired reservation records.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Historic collection list of inactive items
 *       500:
 *         description: Failed to fetch reservation history
 */
router.get('/history', authenticate, requireRole('student'), reservationController.myHistory);

/**
 * @swagger
 * /api/reservations/{reservationId}:
 *   delete:
 *     tags:               
 *       - Reservation
 *     summary: Cancel a reservation
 *     description: Allows students to cancel their own active or pending seat booking.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reservation cancelled, seat released back to available state
 *       403:
 *         description: Forbidden - You can only cancel your own reservation
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Failed to cancel reservation
 */
router.delete('/:reservationId', authenticate, requireRole('student'), reservationController.cancelReservation);

/**
 * @swagger
 * /api/reservations/scan-checkin:
 *   post:
 *     tags:               
 *       - Reservation
 *     summary: QR Code scan check-in handler
 *     description: Processes a scanner-read action to change a booking status from Pending to Active.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reservationId
 *             properties:
 *               reservationId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Check-in successful
 *       404:
 *         description: Reservation not found
 *       409:
 *         description: Already checked in or status state conflict
 *       410:
 *         description: Check-in validation window has passed
 *       500:
 *         description: Failed to process check-in
 */
router.post('/scan-checkin', authenticate, requireRole('manager'), reservationController.scanCheckIn);

/**
 * @swagger
 * /api/reservations/scan-checkout:
 *   post:
 *     tags:               
 *       - Reservation
 *     summary: QR Code scan check-out handler
 *     description: Finalizes an active booking session, releases the seat asset, and marks it inactive.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reservationId
 *             properties:
 *               reservationId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Check-out successful
 *       404:
 *         description: Reservation not found
 *       409:
 *         description: Already checked out or reservation is not active
 *       500:
 *         description: Failed to process check-out
 */
router.post('/scan-checkout', authenticate, requireRole('manager'), reservationController.scanCheckOut);

/**
 * @swagger
 * /api/reservations/active-and-pending:
 *   get:
 *     tags:               
 *       - Reservation
 *     summary: List active and pending allocations
 *     description: Restricted to Managers. Retrieves the manager workspace allocation dashboard queue.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sorted queue array list
 *       500:
 *         description: Failed to fetch reservations
 */
router.get('/active-and-pending', authenticate, requireRole('manager'), reservationController.listActiveAndPending);

/**
 * @swagger
 * /api/reservations/pending:
 *   get:
 *     tags:               
 *       - Reservation
 *     summary: List all pending reservation items
 *     description: Restricted to Managers. Pulls only unapproved reservation rows.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array query result
 *       500:
 *         description: Failed to fetch pending reservations
 */
router.get('/pending', authenticate, requireRole('manager'), reservationController.listPending);

/**
 * @swagger
 * /api/reservations/all:
 *   get:
 *     tags:               
 *       - Reservation
 *     summary: Master list chronological history
 *     description: Restricted to Managers. Complete dump of all registration timeline log profiles.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total dataset transaction logs array
 *       500:
 *         description: Failed to fetch reservations
 */
router.get('/all', authenticate, requireRole('manager'), reservationController.listAll);

/**
 * @swagger
 * /api/reservations/manager/student/{userId}/history:
 *   get:
 *     tags:               
 *       - Reservation
 *     summary: Pull structural chronological metrics map for a unique user
 *     description: Restricted to Managers. Reviews recent past 10 logs for a specific user to evaluate durations and compliance.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Array subset tracking student engagement history records
 *       500:
 *         description: Failed to fetch student history
 */
router.get('/manager/student/:userId/history', authenticate, requireRole('manager'), reservationController.studentHistory);

/**
 * @swagger
 * /api/reservations/{reservationId}/checkin:
 *   patch:
 *     tags:               
 *       - Reservation
 *     summary: Override / Manually force check-in confirmation
 *     description: Restricted to Managers. Manually updates a pending request to active status.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Forced validation status change recorded
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Failed to check in reservation
 */
router.patch('/:reservationId/checkin', authenticate, requireRole('manager'), reservationController.checkInReservation);

/**
 * @swagger
 * /api/reservations/{reservationId}/accept:
 *   patch:
 *     tags:               
 *       - Reservation
 *     summary: Accept a student's reservation request
 *     description: Restricted to Managers. Validates and flags an individual seat claim submission.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Approval confirmation successful
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Failed to accept reservation
 */
router.patch('/:reservationId/accept', authenticate, requireRole('manager'), reservationController.acceptReservation);

/**
 * @swagger
 * /api/reservations/{reservationId}/reject:
 *   patch:
 *     tags:               
 *       - Reservation
 *     summary: Reject a student's reservation request
 *     description: Restricted to Managers. Discards a submission query from the database and updates seat status.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Rejection confirmation successful
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Failed to reject reservation
 */
router.patch('/:reservationId/reject', authenticate, requireRole('manager'), reservationController.rejectReservation);

/**
 * @swagger
 * /api/reservations/{reservationId}/no-show:
 *   patch:
 *     tags:               
 *       - Reservation
 *     summary: Trigger manual no-show enforcement
 *     description: Restricted to Managers. Cancels a target request, applies penalty points, and logs structural violations.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: No-show processing complete, penalties updated
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Failed to apply penalty
 */
router.patch('/:reservationId/no-show', authenticate, requireRole('manager'), reservationController.triggerNoShowPenalty);

/**
 * @swagger
 * /api/reservations/{reservationId}/approve-checkout:
 *   patch:
 *     tags:               
 *       - Reservation
 *     summary: Manager manual checkout approval
 *     description: Restricted to Managers. Accepts checkout requests, terminates running logs, and releases seats.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Checkout confirmed, log archived successfully
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Failed to approve checkout
 */
router.patch('/:reservationId/approve-checkout', authenticate, requireRole('manager'), reservationController.approveCheckout);

router.get('/peakHours', authenticate, requireRole('student'), reservationController.displayPeakHours);

module.exports = router;