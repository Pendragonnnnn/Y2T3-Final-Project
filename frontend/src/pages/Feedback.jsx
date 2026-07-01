import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/Button';

const STARS = [1, 2, 3, 4, 5];

const CATEGORY_LABELS = {
  bug: 'Bug report',
  feature_request: 'Feature request',
  management_issue: 'Management issue',
  general: 'General comment',
};

export default function Feedback() {
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!rating) {
      setError('Please select a star rating');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const { data } = await api.post('/feedback', {
        starRating: rating,
        comment,
      });
      setResult(data.classification);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => navigate('/home');

  if (result) {
    const label = CATEGORY_LABELS[result.sentiment] || result.sentiment;
    return (
      <div className="screen" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
        <h2 className="screen-title" style={{ marginBottom: 8 }}>Thanks for your feedback!</h2>
        <p className="text-muted" style={{ marginBottom: 20 }}>
          Your comment was classified as{' '}
          <strong style={{ color: 'var(--color-primary)' }}>{label}</strong>{' '}
          ({Math.round(result.confidence * 100)}% confidence)
        </p>
        <Button onClick={() => navigate('/home')}>Back to home</Button>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="faq-screen-header">
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 22,
            cursor: 'pointer',
            padding: 0,
            lineHeight: 1,
            alignSelf: 'flex-start',
            color: '#0B56A4',
          }}
          aria-label="Go back"
        >
          く
        </button>

        <h2 className="screen-title">Feedback</h2>

        <div style={{ width: 22 }} />
        </div>

      <div className="card text-center">
        <p className="text-muted" style={{ marginBottom: 16 }}>How would you rate your experience?</p>
        <div className="flex-row" style={{ justifyContent: 'center', gap: 8 }}>
          {STARS.map((s) => (
            <span
              key={s}
              onClick={() => setRating(s)}
              style={{
                fontSize: 32,
                cursor: 'pointer',
                color: s <= rating ? 'var(--color-warning)' : 'var(--color-border)',
              }}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      <div className="field mt-16">
        <label>Your feedback</label>
        <textarea
          rows={4}
          placeholder="Your honest feedback is valuable to us..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      {error && <p style={{ color: 'var(--color-danger)', fontSize: 13, marginBottom: 12 }}>{error}</p>}

      <Button onClick={handleSubmit} loading={submitting}>Submit feedback</Button>

    </div>
  );
}