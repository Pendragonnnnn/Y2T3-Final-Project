/**
 * Simplified Logistic Regression-style feedback classifier.
 *
 * In production this would be a trained scikit-learn LogisticRegression
 * model (TF-IDF vectorizer + LR classifier) served via a Flask microservice.
 * For the demo/prototype, this module reproduces the same PIPELINE
 * (pre-process -> weighted feature scoring -> softmax -> classification)
 * using a small hand-built lexicon instead of a trained weight matrix,
 * so the system's behaviour and output format match the real model.
 *
 * Categories:
 *  - bug:               comment describes an app/software problem
 *                        (crashes, freezes, glitches, errors)
 *  - feature_request:   comment asks for/suggests new functionality
 *  - management_issue:  comment describes a physical facility or
 *                        hardware problem (damaged furniture, broken
 *                        scanner, AC, cleanliness, etc.) for staff
 *                        to act on
 *  - general:   general praise, complaint, or noise with no
 *                        actionable bug, feature, or facility signal
 */

const STOPWORDS = new Set([
  'i', 'the', 'a', 'an', 'is', 'was', 'to', 'and', 'of', 'in', 'it', 'my',
  'for', 'that', 'just', 'so', 'really', 'very', 'all', 'be', 'been', 'but',
  'at', 'on', 'with', 'this', 'have', 'had', 'they', 'we', 'not', 'no', 'by',
  'its', 'are', 'as', 'or', 'from', 'should', 'if', 'when',
  'before', 'after', 'only', 'out', 'up', 'do', 'did', 'what', 'how', 'why',
  'there', 'here', 'over', 'about', 'more', 'some', 'into', 'also', 'then',
]);

// Lexicon weights approximate what a trained TF-IDF + LR model would learn
const CLASS_WEIGHTS = {
  bug: {
    bug: 0.95, broken: 0.5, error: 0.85, crash: 0.95, crashes: 0.95,
    crashed: 0.95, glitch: 0.85, glitchy: 0.85, issue: 0.55, issues: 0.55,
    fails: 0.85, failed: 0.85, failing: 0.85, freezes: 0.9, freeze: 0.85,
    frozen: 0.85, blank: 0.7, unresponsive: 0.6, stuck: 0.4, wrong: 0.55,
    incorrect: 0.6, doesnt: 0.6, wont: 0.6, cant: 0.6, broke: 0.5,
    laggy: 0.7, lag: 0.6, loading: 0.45, duplicate: 0.6,
    blocked: 0.4, disappeared: 0.65, missing: 0.4, app: 0.4, login: 0.5,
    logging: 0.4, password: 0.3, booking: 0.3, reservation: 0.3,
  },
  feature_request: {
    wish: 0.85, feature: 0.9, features: 0.85, suggestion: 0.85,
    suggest: 0.8, suggesting: 0.8, add: 0.65, adding: 0.6, please: 0.55,
    request: 0.8, requesting: 0.8, want: 0.65, wanted: 0.6, hope: 0.55,
    idea: 0.75, improve: 0.55, improvement: 0.7, integration: 0.65,
    option: 0.55, options: 0.55, ability: 0.6, support: 0.5, would: 0.4,
    could: 0.4, maybe: 0.4, consider: 0.6, allow: 0.55, include: 0.5,
    notification: 0.4, notifications: 0.4, filter: 0.35,
  },
  management_issue: {
    damaged: 0.9, damage: 0.85, chair: 0.85, chairs: 0.85, table: 0.75,
    tables: 0.75, seat: 0.6, seats: 0.6, scanner: 0.85, qr: 0.6,
    hardware: 0.7, facility: 0.75, facilities: 0.75, maintenance: 0.8,
    broken: 0.5, torn: 0.8, ripped: 0.8, ac: 0.85, air: 0.5,
    conditioning: 0.8, hot: 0.6, cold: 0.55, dirty: 0.8, unclean: 0.8,
    smell: 0.7, smelly: 0.75, noisy: 0.6, noise: 0.5, light: 0.45,
    lights: 0.5, flickering: 0.75, door: 0.6, doors: 0.6, lock: 0.55,
    locked: 0.45, wifi: 0.55, outlet: 0.7, outlets: 0.7, plug: 0.6,
    electricity: 0.65, power: 0.45, printer: 0.7, restroom: 0.8,
    bathroom: 0.8, cleaning: 0.6, dusty: 0.7, leaking: 0.8, leak: 0.75,
    smelling: 0.7, stuck: 0.4, infrastructure: 0.6,
  },
  general: {
    love: 0.85, great: 0.85, good: 0.6, nice: 0.6, thanks: 0.75,
    thank: 0.75, awesome: 0.85, easy: 0.6, helpful: 0.7, amazing: 0.85,
    terrible: 0.55, bad: 0.55, okay: 0.6, fine: 0.55, decent: 0.55,
    overall: 0.5, convenient: 0.6, smooth: 0.6, fantastic: 0.85,
    perfect: 0.8, excellent: 0.8, annoying: 0.5, disappointed: 0.5,
    happy: 0.7, useless: 0.5, best: 0.7, worst: 0.6, slow: 0.35,
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
  const raw = { bug: 0.05, feature_request: 0.05, management_issue: 0.05, general: 0.3 }; // small bias terms
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
    return {
      sentiment: 'general',
      confidence: 0.25,
      probabilities: {
        bug: 0.25, feature_request: 0.25, management_issue: 0.25, general: 0.25,
      },
    };
  }

  const tokens = preprocess(text);
  const rawScores = scoreClasses(tokens);
  const probs = softmax(rawScores);

  const sentiment = Object.keys(probs).reduce((a, b) => (probs[a] > probs[b] ? a : b));
  const confidence = Math.round(probs[sentiment] * 1000) / 1000;

  return { sentiment, confidence, probabilities: probs };
}

module.exports = { classifyFeedback, preprocess };