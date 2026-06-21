const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, notificationController.list);
router.patch('/:notificationId/read', authenticate, notificationController.markRead);

module.exports = router;
