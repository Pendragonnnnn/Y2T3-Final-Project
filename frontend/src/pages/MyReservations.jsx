import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import BottomNav from '../components/BottomNav';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import Toast from '../components/Toast';
import { useToast } from '../components/useToast';

export default function MyReservations() {
  const navigate = useNavigate();
  const { message, showToast } = useToast();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    api.get('/reservations/mine').then(({ data }) => setReservations(data.reservations)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id) => {
    setBusyId(id);
    try {
      await api.delete(`/reservations/${id}`);
      showToast('Reservation cancelled');
      load();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to cancel');
    } finally {
      setBusyId(null);
    }
  };

  const handleCheckout = async (id) => {
    setBusyId(id);
    try {
      await api.post(`/reservations/${id}/checkout`);
      showToast('Checkout requested — waiting for manager approval');
      navigate(`/feedback?reservationId=${id}`);
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to request checkout');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="screen">
      <div className="screen-header">
        <h2 className="screen-title">My reservations</h2>
      </div>

      {loading ? (
        <div className="text-center mt-24"><div className="spinner" style={{ margin: '0 auto' }} /></div>
      ) : reservations.length === 0 ? (
        <div className="empty-state">
          <p style={{ fontSize: 32 }}>📭</p>
          <p style={{ fontWeight: 600, marginTop: 8 }}>No active reservations</p>
          <p className="text-muted">Reserve a seat from the home screen</p>
        </div>
      ) : (
        <div className="stack">
          {reservations.map((r) => (
            <div key={r.reservation_id} className="card">
              <div className="flex-between">
                <div>
                  <p style={{ fontWeight: 600 }}>Seat {r.seat_id} · Table {r.table_label}</p>
                  <p className="text-muted">{new Date(r.scheduled_start).toLocaleString()}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>

              <div className="flex-row mt-16">
                {r.status === 'pending' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCancel(r.reservation_id)}
                    loading={busyId === r.reservation_id}
                  >
                    Cancel
                  </Button>
                )}
                {r.status === 'active' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleCheckout(r.reservation_id)}
                    loading={busyId === r.reservation_id}
                  >
                    Request checkout
                  </Button>
                )}
                {r.status === 'active' && (
                  <span className="text-muted" style={{ fontSize: 12 }}>Check in at the library desk</span>
                )}
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
