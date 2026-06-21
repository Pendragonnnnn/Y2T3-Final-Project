const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { authenticate, requireRole } = require('../middleware/auth');

router.post('/', authenticate, feedbackController.submitFeedback);
router.post('/preview', authenticate, feedbackController.previewClassification);
router.get('/breakdown', authenticate, requireRole('manager'), feedbackController.getBreakdown);
router.get('/', authenticate, requireRole('manager'), feedbackController.listFeedback);

module.exports = router;
