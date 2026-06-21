const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const Seat = require('../models/Seat');
const Feedback = require('../models/Feedback');

exports.listStudents = async (req, res) => {
  try {
    const students = await User.listStudents();
    res.json({ students });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

exports.viewAuditLog = async (req, res) => {
  try {
    const logs = await AuditLog.list();
    res.json({ logs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch audit log' });
  }
};

exports.generateReport = async (req, res) => {
  try {
    const seatStats = await Seat.getStats();
    const sentiment = await Feedback.sentimentBreakdown();
    res.json({
      generatedAt: new Date(),
      seatOccupancy: seatStats,
      satisfaction: sentiment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate report' });
  }
};
