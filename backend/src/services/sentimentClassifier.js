/**
 * Simplified Logistic Regression-style sentiment classifier.
 *
 * In production this would be a trained scikit-learn LogisticRegression
 * model (TF-IDF vectorizer + LR classifier) served via a Flask microservice.
 * For the demo/prototype, this module reproduces the same PIPELINE
 * (pre-process -> weighted feature scoring -> softmax -> classification)
 * using a small hand-built lexicon instead of a trained weight matrix,
 * so the system's behaviour and output format match the real model.
 */

const STOPWORDS = new Set([
  'i', 'the', 'a', 'an', 'is', 'was', 'to', 'and', 'of', 'in', 'it', 'my',
  'for', 'that', 'just', 'so', 'really', 'very', 'all', 'be', 'been', 'but',
  'at', 'on', 'with', 'this', 'have', 'had', 'they', 'we', 'not', 'no', 'by',
  'its', 'are', 'as', 'or', 'from', 'would', 'could', 'should', 'if', 'when',
  'before', 'after', 'only', 'out', 'up', 'do', 'did', 'what', 'how', 'why',
  'there', 'here', 'over', 'about', 'more', 'some', 'into', 'also', 'then',
]);

// Lexicon weights approximate what a trained TF-IDF + LR model would learn
const CLASS_WEIGHTS = {
  frustrated: {
    waste: 0.9, wasted: 0.9, full: 0.8, occupied: 0.6, nowhere: 0.85,
    nothing: 0.6, empty: 0.5, lost: 0.6, useless: 0.9, annoying: 0.85,
    disappointed: 0.85, tired: 0.6, defeated: 0.9, confusing: 0.8,
    rejected: 0.85, broken: 0.85, slow: 0.6, bad: 0.7, terrible: 0.95,
    frustrating: 0.95, frustrated: 0.95, never: 0.6, worst: 0.95,
  },
  satisfied: {
    love: 0.9, great: 0.85, easy: 0.75, convenient: 0.85, save: 0.7,
    saved: 0.7, quick: 0.7, efficient: 0.8, happy: 0.85, good: 0.6,
    helpful: 0.75, nice: 0.6, amazing: 0.9, smooth: 0.75, fantastic: 0.9,
    perfect: 0.9, excellent: 0.9, reliable: 0.8, fast: 0.65, best: 0.85,
    awesome: 0.9, useful: 0.7,
  },
  neutral: {
    okay: 0.6, sometimes: 0.4, usually: 0.4, often: 0.3, fine: 0.5,
    average: 0.5, decent: 0.5, alright: 0.5,
  },
};

function preprocess(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOPWORDS.has(w));
}

function scoreClasses(tokens) {
  const raw = { frustrated: 0.05, neutral: 0.25, satisfied: 0.05 }; // small bias terms
  tokens.forEach(tok => {
    Object.keys(CLASS_WEIGHTS).forEach(cls => {
      if (CLASS_WEIGHTS[cls][tok]) raw[cls] += CLASS_WEIGHTS[cls][tok];
    });
  });
  return raw;
}

function softmax(scores) {
  const exp = {};
  let sum = 0;
  Object.keys(scores).forEach(k => {
    exp[k] = Math.exp(scores[k]);
    sum += exp[k];
  });
  const probs = {};
  Object.keys(exp).forEach(k => { probs[k] = exp[k] / sum; });
  return probs;
}

/**
 * Classify a feedback comment.
 * @param {string} text
 * @returns {{ sentiment: string, confidence: number, probabilities: object }}
 */
function classifyFeedback(text) {
  if (!text || !text.trim()) {
    return { sentiment: 'neutral', confidence: 0.34, probabilities: { frustrated: 0.33, neutral: 0.34, satisfied: 0.33 } };
  }

  const tokens = preprocess(text);
  const rawScores = scoreClasses(tokens);
  const probs = softmax(rawScores);

  const sentiment = Object.keys(probs).reduce((a, b) => (probs[a] > probs[b] ? a : b));
  const confidence = Math.round(probs[sentiment] * 1000) / 1000;

  return { sentiment, confidence, probabilities: probs };
}

module.exports = { classifyFeedback, preprocess };
