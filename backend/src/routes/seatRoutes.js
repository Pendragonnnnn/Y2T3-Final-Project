const express = require('express');
const router = express.Router();
const seatController = require('../controllers/seatController');
const { authenticate, requireRole } = require('../middleware/auth');

router.get('/',        authenticate, seatController.getMap);
router.get('/stats',   authenticate, seatController.getStats);
router.get('/manager-map', authenticate, requireRole('manager'), seatController.getManagerMap);
router.patch('/:seatId/block', authenticate, requireRole('manager'), seatController.blockSeat);
router.patch('/:seatId/open',  authenticate, requireRole('manager'), seatController.openSeat);

module.exports = router;