const express = require('express');
const router = express.Router();
const controller = require('../controllers/notificationController');
const { authenticate } = require('../middleware/auth');

// All notification routes require a valid logged-in user
router.get('/:userId', authenticate, controller.getNotifications);
router.get('/:userId/count', authenticate, controller.getUnreadCount);
router.put('/:userId/read/:notificationId', authenticate, controller.markRead);
router.put('/:userId/read-all', authenticate, controller.markAllRead);

module.exports = router;