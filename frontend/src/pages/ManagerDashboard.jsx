import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import Button from '../components/Button';
import Toast from '../components/Toast';
import { useToast } from '../components/useToast';

export default function ManagerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { message, showToast } = useToast();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    api.get('/reservations/pending').then(({ data }) => setReservations(data.reservations)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleAction = async (id, action) => {
    setBusyId(id);
    try {
      await api.patch(`/reservations/${id}/${action}`);
      showToast(action === 'accept' ? 'Reservation approved' : 'Reservation rejected');
      load();
    } catch (err) {
      showToast(err.response?.data?.error || 'Action failed');
    } finally {
      setBusyId(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="screen">
      <div className="screen-header">
        <div>
          <p className="text-muted">Manager Dashboard</p>
          <h2 className="screen-title">Pending reservations</h2>
        </div>
        <button onClick={handleLogout} style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Log out</button>
      </div>

      {loading ? (
        <div className="text-center mt-24"><div className="spinner" style={{ margin: '0 auto' }} /></div>
      ) : reservations.length === 0 ? (
        <div className="empty-state">
          <p style={{ fontSize: 32 }}>✓</p>
          <p style={{ fontWeight: 600 }}>All caught up</p>
          <p className="text-muted">No pending reservations right now</p>
        </div>
      ) : (
        <div className="stack">
          {reservations.map((r) => (
            <div key={r.reservation_id} className="card">
              <div className="flex-between">
                <div>
                  <p style={{ fontWeight: 600 }}>{r.full_name}</p>
                  <p className="text-muted">{r.email}</p>
                  <p className="text-muted mt-8">Seat {r.seat_id} · Table {r.table_label}</p>
                </div>
                <span className="badge badge-pending">Pending</span>
              </div>
              <div className="flex-row mt-16">
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleAction(r.reservation_id, 'accept')}
                  loading={busyId === r.reservation_id}
                >
                  Accept
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleAction(r.reservation_id, 'reject')}
                  loading={busyId === r.reservation_id}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Toast message={message} />
      <BottomNav />
    </div>
  );
}
