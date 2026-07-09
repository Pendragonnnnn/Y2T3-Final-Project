import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function ManagementIssuesList() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const SENTIMENT_COLORS = {
    bug: '#E74C3C',
    feature_request: '#4095F6',
    management_issue: '#F5A623',
    general: '#A0AAC2',
  };

  const SENTIMENT_LABELS = {
    bug: 'Bug Report',
    feature_request: 'Feature Request',
    management_issue: 'Management Issue',
    general: 'General Comment',
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const feedbackDate = new Date(date);
    const seconds = Math.floor((now - feedbackDate) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return `${Math.floor(seconds / 604800)}w ago`;
  };

  useEffect(() => {
    // Call the feedback endpoint to get all feedback submitted by users
    api.get('/feedback')
      .then(({ data }) => setIssues(data.feedback || data))
      .finally(() => setLoading(false));
  }, []);

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
            lineHeight: 2,
            alignSelf: 'flex-start',
            color: 'var(--color-primary)',
          }}
          aria-label="Go back"
        >
          く
        </button>

        <h2 className="screen-title">User Feedback</h2>

        <div style={{ width: 22 }} />
      </div>

      <div className="flex-between mb-16" style={{ gap: 1 }}>
        <p className="text-muted" style={{ fontSize: 12 }}>Feedback from users within the last 30 days.</p>
      </div>

      {loading ? (
        <div className="text-center mt-24"><div className="spinner" style={{ margin: '0 auto' }} /></div>
      ) : issues.length === 0 ? (
        <p className="text-muted text-center mt-12">No feedback submitted yet.</p>
      ) : (
        <div className="flex-col">
          {issues.map(issue => (
            <div key={issue.feedback_id} className="card" style={{ borderLeft: `4px solid ${SENTIMENT_COLORS[issue.sentiment] || '#A0AAC2'}` }}>
              <div className="mb-2" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '10px', alignItems: 'center' }}>
                  <div className="font-semibold">{issue.full_name || 'Anonymous User'}</div>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    backgroundColor: SENTIMENT_COLORS[issue.sentiment] || 'orange',
                    color: 'black',
                    display: 'inline-block'
                  }}>
                    {SENTIMENT_LABELS[issue.sentiment] || issue.sentiment}
                  </div>
                </div>
                <div className="text-xs text-muted" style={{ textAlign: 'right' }}>
                  {getTimeAgo(issue.created_at)}
                </div>
              </div>
              <div className="flex items-center mb-2" style={{ marginTop: '8px' }}>
                <span style={{ color: SENTIMENT_COLORS[issue.sentiment] || '#F5A623' }}>{'★'.repeat(issue.star_rating)}</span>
                <span style={{ color: '#ddd' }}>{'★'.repeat(5 - issue.star_rating)}</span>
              </div>
              <p className="text-sm" style={{ color: 'var(--color-text-primary)', marginTop: '8px' }}>{issue.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}