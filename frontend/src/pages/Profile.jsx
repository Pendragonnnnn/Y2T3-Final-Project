import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import Button from '../components/Button';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.get('/auth/me').then(({ data }) => setProfile(data.user));
    api.get('/reservations/history').then(({ data }) => setHistory(data.history));
  }, []);

  const penaltyScore = profile?.current_penalty_score ?? 0;
  const penaltyColor = penaltyScore <= 100 ? 'var(--color-success)' : penaltyScore < 130 ? 'var(--color-warning)' : 'var(--color-danger)';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="screen">
      <div className="screen-header">
        <h2 className="screen-title">Profile</h2>
      </div>

      <div className="card text-center">
        <div
          style={{
            width: 72, height: 72, borderRadius: '50%', background: 'var(--color-primary)',
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, fontWeight: 700, margin: '0 auto 12px',
          }}
        >
          {user?.fullName?.[0]}
        </div>
        <p style={{ fontWeight: 600, fontSize: 16 }}>{user?.fullName}</p>
        <p className="text-muted">{user?.email}</p>
      </div>

      <div className="card mt-16 stat-card">
        <div
          style={{
            width: 48, height: 48, borderRadius: '50%', border: `4px solid ${penaltyColor}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14,
          }}
        >
          {penaltyScore}
        </div>
        <div>
          <p style={{ fontWeight: 600 }}>Penalty score</p>
          <p className="text-muted">100 is the baseline — no-shows add 10 points</p>
        </div>
      </div>

      <h3 style={{ fontSize: 15, marginTop: 24, marginBottom: 12 }}>Reservation history</h3>
      <div className="stack">
        {history.length === 0 && <p className="text-muted">No past reservations yet.</p>}
        {history.slice(0, 5).map((h) => (
          <div key={h.history_id} className="card flex-between">
            <div>
              <p style={{ fontWeight: 600, fontSize: 13 }}>Seat {h.seat_id} · Table {h.table_label}</p>
              <p className="text-muted">{new Date(h.reservation_date).toLocaleDateString()}</p>
            </div>
            <span className={`badge badge-${h.outcome === 'completed' ? 'accepted' : h.outcome === 'no_show' ? 'occupied' : 'blocked'}`}>
              {h.outcome.replace('_', ' ')}
            </span>
          </div>
        ))}
      </div>

      <Button variant="outline" onClick={handleLogout} className="mt-24">
        Log out
      </Button>

      <BottomNav />
    </div>
  );
}
