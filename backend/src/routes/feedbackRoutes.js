const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { authenticate, requireRole } = require('../middleware/auth');

/**
 * @swagger
 * /api/feedback:
 *   post:
 *     tags:               
 *       - Feedback
 * 
 *     summary: Submit feedback
 *     description: Submits feedback with a rating. The system automatically handles sentiment and confidence classification.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - starRating
 *             properties:
 *               starRating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Feedback submitted
 *       400:
 *         description: Invalid rating
 *       500:
 *         description: Server error
 *   get:
 *     tags:               
 *       - Feedback
 *     summary: List all feedback
 *     description: Restricted to Managers. Fetches all recorded feedback along with full names of the authors.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of feedback objects
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires Manager role)
 *       500:
 *         description: Server error
 */
router.post('/', authenticate, feedbackController.submitFeedback);

/**
 * @swagger
 * /api/feedback/preview:
 *   post:
 *     tags:               
 *       - Feedback
 *     summary: Preview sentiment classification
 *     description: Test text payload parsing and sentiment outcome without saving into the database.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *             properties:
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Raw classification result returned successfully
 *       500:
 *         description: Server error
 */
router.post('/preview', authenticate, feedbackController.previewClassification);

/**
 * @swagger
 * /api/feedback/breakdown:
 *   get:
 *     tags:               
 *       - Feedback
 *     summary: Get feedback metrics and sentiment breakdown
 *     description: Restricted to Managers. Compiles categorical summary metrics alongside calculated average rating.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Aggregated rating metrics and summary bucket data points
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires Manager role)
 *       500:
 *         description: Server error
 */
router.get('/breakdown', authenticate, requireRole('manager'), feedbackController.getBreakdown);

router.get('/', authenticate, requireRole('manager'), feedbackController.listFeedback);

module.exports = router;