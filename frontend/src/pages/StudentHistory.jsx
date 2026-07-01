import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import BottomNav from '../components/BottomNav';

function formatDuration(minutes) {
  if (minutes === null || minutes === undefined) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

export default function StudentHistory() {
  const { userId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const student = state?.student;

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.get(`/reservations/manager/student/${userId}/history`)
      .then(({ data }) => { if (!cancelled) setHistory(data.history); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [userId]);

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

        <h2 className="screen-title">Reservation History</h2>

        <div style={{ width: 22 }} />

      </div>

      {loading ? (
        <div className="text-center mt-24"><div className="spinner" style={{ margin: '0 auto' }} /></div>
      ) : (
        <div className="stack mt-16">
          {history.map((r) => {
            const checkedIn = r.check_in_time != null;
            const duration = formatDuration(r.duration_minutes);
            return (
              <div key={r.reservation_id} className="card flex-between">
                <div>
                  <p style={{ fontWeight: 600 }}>Seat {r.seat_id}</p>
                  <p className="text-muted" style={{ fontSize: 12 }}>
                    {new Date(r.reservation_date).toLocaleDateString()} · {r.outcome}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {checkedIn ? (
                    duration ? (
                      <p style={{ fontWeight: 700 }}>{duration}</p>
                    ) : (
                      <p style={{ fontWeight: 700, color: 'var(--color-warning)' }}>In progress</p>
                    )
                  ) : (
                    <p style={{ fontWeight: 700, color: 'var(--color-danger)' }}>No check-in</p>
                  )}
                  
                </div>
              </div>
            );
          })}
          {history.length === 0 && <p className="text-muted text-center mt-16">No reservations yet</p>}
        </div>
      )}

      <BottomNav />
    </div>
  );
}