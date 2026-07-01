const express = require('express');
const router = express.Router();
const managerController = require('../controllers/managerController');
const { authenticate, requireRole } = require('../middleware/auth');

router.get('/students', authenticate, requireRole('manager'), managerController.listStudents);
router.get('/report', authenticate, requireRole('manager'), managerController.generateReport);
router.get('/feedback/management-issues', authenticate, requireRole('manager'), managerController.getManagementFeedback);

module.exports = router;
