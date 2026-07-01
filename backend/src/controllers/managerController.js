const User = require('../models/User');
const Seat = require('../models/Seat');
const Feedback = require('../models/Feedback');
const Reservation = require('../models/Reservation');

exports.listStudents = async (req, res) => {
  try {
    const students = await User.listStudents();
    res.json({ students });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

exports.generateReport = async (req, res) => {
  try {
    const seatOccupancy = await Seat.getOccupancy(); 
    const satisfaction = await Feedback.getSatisfactionStats();
    const reservationStats = await Reservation.getPeriodicStats(); 
    
    const peakHours = await Reservation.getPeakHours(); 

    res.json({
      seatOccupancy: seatOccupancy,
      satisfaction: satisfaction,
      reservationStats: reservationStats,
      peakHours: peakHours 
    });
  } catch (error) {
    console.error("REPORT CRASH CULPRIT:", error);
    res.status(500).json({ error: error.message });
  }
};
  // Inside managerController.js

exports.getManagementFeedback = async (req, res) => {
  try {
    const issues = await Feedback.getManagementIssues(); // The SQL selector we built earlier
    res.json(issues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
