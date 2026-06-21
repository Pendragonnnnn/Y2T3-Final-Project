import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import BottomNav from '../components/BottomNav';
import Button from '../components/Button';
import InteractiveSeatMap from '../components/InteractiveSeatMap';
import Toast from '../components/Toast';
import { useToast } from '../components/useToast';

export default function SeatMap() {
  const navigate = useNavigate();
  const { message, showToast } = useToast();
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);

  const loadSeats = () => {
    setLoading(true);
    api.get('/seats').then(({ data }) => setSeats(data.seats)).finally(() => setLoading(false));
  };

  useEffect(() => { loadSeats(); }, []);

  const handleReserve = async () => {
    if (!selected) return;
    setReserving(true);
    try {
      await api.post('/reservations/manual', { seatId: selected.seat_id });
      showToast(`Seat ${selected.seat_id} reserved! Awaiting approval.`);
      setTimeout(() => navigate('/reservations'), 1200);
    } catch (err) {
      showToast(err.response?.data?.error || 'Could not reserve seat');
      loadSeats();
    } finally {
      setReserving(false);
    }
  };

  return (
    <div className="screen">
      <div className="screen-header">
        <h2 className="screen-title">Real-time seat map</h2>
        <button onClick={loadSeats} style={{ fontSize: 18 }}>↻</button>
      </div>

      <div className="flex-row mb-16">
        <span className="badge badge-available">● Available</span>
        <span className="badge badge-occupied">● Occupied</span>
        <span className="badge badge-blocked">● Blocked</span>
      </div>

      {loading ? (
        <div className="text-center mt-24"><div className="spinner" style={{ margin: '0 auto' }} /></div>
      ) : (
        <InteractiveSeatMap seats={seats} selectedSeatId={selected?.seat_id} onSelectSeat={setSelected} />
      )}

      {selected && (
        <div className="card mt-16" style={{ position: 'sticky', bottom: 90 }}>
          <p style={{ fontWeight: 600 }}>Seat {selected.seat_id} · Table {selected.table_label}</p>
          <Button onClick={handleReserve} loading={reserving} className="mt-8">
            Reserve this seat
          </Button>
        </div>
      )}

      <Toast message={message} />
      <BottomNav />
    </div>
  );
}
