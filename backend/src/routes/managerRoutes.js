const express = require('express');
const router = express.Router();
const managerController = require('../controllers/managerController');
const { authenticate, requireRole } = require('../middleware/auth');

router.get('/students', authenticate, requireRole('manager'), managerController.listStudents);
router.get('/report', authenticate, requireRole('manager'), managerController.generateReport);

module.exports = router;
