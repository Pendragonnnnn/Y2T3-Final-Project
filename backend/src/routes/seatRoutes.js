const express = require('express');
const router = express.Router();
const seatController = require('../controllers/seatController');
const { authenticate, requireRole } = require('../middleware/auth');

/**
 * @swagger
 * /api/seats:
 *   get:
 *     tags:               
 *       - Seat
 *     summary: Get structural spatial layout map
 *     description: Fetches standard seat configurations and table associations.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Layout array mapping nodes returned successfully
 *       500:
 *         description: Failed to fetch seat map
 */
router.get('/', authenticate, seatController.getMap);

/**
 * @swagger
 * /api/seats/stats:
 *   get:
 *     tags:               
 *       - Seat
 *     summary: Get occupancy analytics calculations
 *     description: Aggregates real-time seat tracking totals (available, occupied, blocked).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics analytics calculation object
 *       500:
 *         description: Failed to fetch seat statistics
 */
router.get('/stats', authenticate, seatController.getStats);

/**
 * @swagger
 * /api/seats/manager-map:
 *   get:
 *     tags:               
 *       - Seat
 *     summary: Get detailed operational map view
 *     description: Restricted to Managers. Enhances map vectors with user profiles and reservation states.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Expanded manager node layout collection
 *       500:
 *         description: Failed to fetch manager seat map
 */
router.get('/manager-map', authenticate, requireRole('manager'), seatController.getManagerMap);

/**
 * @swagger
 * /api/seats/{seatId}/block:
 *   patch:
 *     tags:               
 *       - Seat
 *     summary: Place seat under block / maintenance restriction
 *     description: Restricted to Managers. Locks down a targeted desk node from reservation availability.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: seatId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Node structural state successfully updated to blocked
 *       404:
 *         description: Seat not found
 *       500:
 *         description: Failed to block seat
 */
router.patch('/:seatId/block', authenticate, requireRole('manager'), seatController.blockSeat);

/**
 * @swagger
 * /api/seats/{seatId}/open:
 *   patch:
 *     tags:               
 *       - Seat
 *     summary: Release block / Open seat asset
 *     description: Restricted to Managers. Restores a blocked unit node back to available status.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: seatId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Node status restored to open/available status
 *       404:
 *         description: Seat not found
 *       500:
 *         description: Failed to open seat
 */
router.patch('/:seatId/open', authenticate, requireRole('manager'), seatController.openSeat);

module.exports = router;