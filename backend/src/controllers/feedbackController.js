const Feedback = require('../models/Feedback');
const { classifyFeedback } = require('../services/sentimentClassifier');

exports.submitFeedback = async (req, res) => {
  try {
    const { reservationId, starRating, comment } = req.body;
    if (!starRating || starRating < 1 || starRating > 5) {
      return res.status(400).json({ error: 'starRating must be between 1 and 5' });
    }

    const { sentiment, confidence } = classifyFeedback(comment);

    const feedbackId = await Feedback.create({
      userId: req.user.userId,
      reservationId,
      starRating,
      comment,
      sentiment,
      confidence,
    });

    res.status(201).json({
      message: 'Feedback submitted',
      feedbackId,
      classification: { sentiment, confidence },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
};

exports.previewClassification = async (req, res) => {
  try {
    const { comment } = req.body;
    const result = classifyFeedback(comment);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to classify comment' });
  }
};

exports.getBreakdown = async (req, res) => {
  try {
    const data = await Feedback.sentimentBreakdown();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch sentiment breakdown' });
  }
};

exports.listFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.listAll();
    res.json({ feedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
};
