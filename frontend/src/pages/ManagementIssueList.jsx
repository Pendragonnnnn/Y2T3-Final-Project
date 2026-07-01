import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function ManagementIssuesList() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Call the new backend endpoint created in Step 1
    api.get('/manager/feedback/management-issues')
      .then(({ data }) => setIssues(data))
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
            color: 'var(--color-text-secondary)',
            padding: 0,
            lineHeight: 1,
            alignSelf: 'flex-start',
            color: '#0B56A4',
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
        <p className="text-muted text-center mt-12">No management issues found.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {issues.map(issue => (
            <div key={issue.feedback_id} className="card border-l-4 border-yellow-500">
              <div className="mb-2" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <div className="font-semibold">{issue.full_name || 'Anonymous User'}</div>
                <div className="text-xs text-muted">
                  {new Date(issue.created_at).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center mb-2">
                <span className="text-yellow-500 mr-2">{'★'.repeat(issue.star_rating)}</span>
                <span className="text-gray-300">{'★'.repeat(5 - issue.star_rating)}</span>
              </div>
              <p className="text-sm text-gray-700">{issue.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}