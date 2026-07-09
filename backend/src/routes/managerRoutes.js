const express = require('express');
const router = express.Router();
const managerController = require('../controllers/managerController');
const { authenticate, requireRole } = require('../middleware/auth');

/**
 * @swagger
 * /api/manager/students:
 *   get:
 *     tags:               
 *       - Manager
 * 
 *     summary: List all students
 *     description: Restricted to Managers. Returns profiles of all registered users with the "Student" role including active penalty scores.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of students
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires Manager role)
 *       500:
 *         description: Server error
 */
router.get('/students', authenticate, requireRole('manager'), managerController.listStudents);

/**
 * @swagger
 * /api/manager/report:
 *   get:
 *     tags:               
 *       - Manager
 *     summary: Generate analytical operational report
 *     description: Restricted to Managers. Compiles seat occupancy snapshot, historic satisfaction levels, chronological transaction volumes, and hourly hot-spots.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Aggregated data dashboard metrics object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires Manager role)
 *       500:
 *         description: Server error
 */
router.get('/report', authenticate, requireRole('manager'), managerController.generateReport);

/**
 * @swagger
 * /api/manager/feedback/management-issues:
 *   get:
 *     tags:               
 *       - Manager
 *     summary: Get recent management issue feedback tickets
 *     description: Restricted to Managers. Filters for complaints explicitly targeted with a category signature matching 'Management_issue' over the past rolling 30 days.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of matched target management issues
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires Manager role)
 *       500:
 *         description: Server error
 */
router.get('/feedback/management-issues', authenticate, requireRole('manager'), managerController.getManagementFeedback);

module.exports = router;