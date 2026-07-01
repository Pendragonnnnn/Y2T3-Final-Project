const Seat = require('../models/Seat');

exports.getMap = async (req, res) => {
  try {
    const seats = await Seat.getMap();
    res.json({ seats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch seat map' });
  }
};

exports.getManagerMap = async (req, res) => {
  try {
    const seats = await Seat.getManagerMap();
    res.json({ seats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch manager seat map' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const stats = await Seat.getStats();
    res.json({ stats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch seat statistics' });
  }
};

exports.blockSeat = async (req, res) => {
  try {
    const { seatId } = req.params;
    const seat = await Seat.findById(seatId);
    if (!seat) return res.status(404).json({ error: 'Seat not found' });
    await Seat.updateStatus(seatId, 'blocked');
    res.json({ message: 'Seat blocked' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to block seat' });
  }
};

exports.openSeat = async (req, res) => {
  try {
    const { seatId } = req.params;
    const seat = await Seat.findById(seatId);
    if (!seat) return res.status(404).json({ error: 'Seat not found' });
    await Seat.updateStatus(seatId, 'available');
    res.json({ message: 'Seat opened' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to open seat' });
  }
};