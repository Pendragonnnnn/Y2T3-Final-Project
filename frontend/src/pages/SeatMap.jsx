import { useEffect, useState, useCallback } from 'react';
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
  const [hasActive, setHasActive] = useState(false);

  const loadSeats = () => {
    setLoading(true);
    api.get('/seats').then(({ data }) => setSeats(data.seats)).finally(() => setLoading(false));
  };

  const checkActiveReservation = useCallback(async () => {
  try {
    const { data } = await api.get('/reservations/check-status'); // Add this endpoint in your backend
    setHasActive(data.hasActive);
  } catch (err) {
    console.error("Failed to check status", err);
  }
}, []);

  useEffect(() => {
  loadSeats();
  checkActiveReservation();
}, []);

  const handleReserve = async () => {
    if (!selected) return;
    setReserving(true);
    try {
      await api.post('/reservations/manual', { seatId: selected.seat_id });
      showToast(`Seat reserved!`);
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
        <h2 className="screen-title">Library Map</h2>
        {hasActive && (
  <div className="alert alert-warning">
    You already have a pending or active reservation.
  </div>
)}
      </div>

      {loading ? (
        <div className="text-center mt-24"><div className="spinner" style={{ margin: '0 auto' }} /></div>
      ) : (
        <InteractiveSeatMap seats={seats} selectedSeatId={selected?.seat_id} onSelectSeat={setSelected} />
      )}
    
      {selected && (
      <div className="card mt-16" style={{ position: 'sticky', bottom: 10, paddingLeft: '0px' ,paddingTop: '6px', display: 'flex', flexDirection: 'row', gap: '10px'}}>
        {/* Close Button */}
        <p style={{ fontWeight: '200' }}></p>
        <Button 
          onClick={handleReserve} 
          loading={reserving} 
          disabled={hasActive || !selected} 
          className="mt-8"
        > 
          {hasActive ? 'Reservation Limit Reached' : 'Reserve this seat'}
        </Button>
        <button 
          onClick={() => setSelected(null)} 
          className='mt-8 cancel-action-btn'
          aria-label="Close"
          
        >
          Cancel
        </button>
      </div>
    )}

      <Toast message={message} />
      <BottomNav />
    </div>
  );
}