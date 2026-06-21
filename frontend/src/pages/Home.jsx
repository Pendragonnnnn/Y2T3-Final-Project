import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import BottomNav from '../components/BottomNav';
import Button from '../components/Button';
import Toast from '../components/Toast';
import { useToast } from '../components/useToast';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { message, showToast } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);

  useEffect(() => {
    api.get('/seats/stats')
      .then(({ data }) => setStats(data.stats))
      .finally(() => setLoading(false));
  }, []);

  const handleQuickReserve = async () => {
    setReserving(true);
    try {
      const { data } = await api.post('/reservations/quick');
      showToast(`Seat ${data.seat.seat_id} reserved! Awaiting manager approval.`);
      setTimeout(() => navigate('/reservations'), 1200);
    } catch (err) {
      showToast(err.response?.data?.error || 'Could not reserve a seat');
    } finally {
      setReserving(false);
    }
  };

  return (
    <div className="screen">
      <div className="screen-header">
        <div>
          <p className="text-muted">Welcome back,</p>
          <h2 className="screen-title">{user?.fullName?.split(' ')[0]} 👋</h2>
        </div>
        <div
          style={{
            width: 40, height: 40, borderRadius: 12, background: 'var(--color-primary)',
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 600,
          }}
        >
          {user?.fullName?.[0] || 'S'}
        </div>
      </div>

      {/* Seat stats card — Mobile 2 style with two stat pills */}
      <div className="card mt-8" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))' }}>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>Seats available right now</p>
        {loading ? (
          <div className="spinner" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white', margin: '12px 0' }} />
        ) : (
          <div className="flex-row" style={{ gap: 16, marginTop: 8 }}>
            <div>
              <p style={{ color: 'white', fontSize: 28, fontWeight: 700 }}>{stats?.available ?? 0}</p>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11 }}>Available</p>
            </div>
            <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.25)' }} />
            <div>
              <p style={{ color: 'white', fontSize: 28, fontWeight: 700 }}>{stats?.occupied ?? 0}</p>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11 }}>Occupied</p>
            </div>
            <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.25)' }} />
            <div>
              <p style={{ color: 'white', fontSize: 28, fontWeight: 700 }}>{stats?.total ?? 0}</p>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11 }}>Total</p>
            </div>
          </div>
        )}
      </div>

      {/* Reservation actions — Mobile 4 style: choose your own seat vs random */}
      <h3 style={{ fontSize: 15, marginTop: 24, marginBottom: 12 }}>Find a seat</h3>
      <div className="stack">
        <div className="card flex-between" onClick={handleQuickReserve} style={{ cursor: 'pointer' }}>
          <div>
            <p style={{ fontWeight: 600, fontSize: 14 }}>⚡ Quick Random Reserve</p>
            <p className="text-muted">Instantly grab any available seat</p>
          </div>
        </div>
        <div className="card flex-between" onClick={() => navigate('/map')} style={{ cursor: 'pointer' }}>
          <div>
            <p style={{ fontWeight: 600, fontSize: 14 }}>🗺️ Choose Your Own Seat</p>
            <p className="text-muted">Browse the real-time seat map</p>
          </div>
        </div>
      </div>

      <Button onClick={handleQuickReserve} loading={reserving} className="mt-24">
        Reserve a seat now
      </Button>

      <Toast message={message} />
      <BottomNav />
    </div>
  );
}
