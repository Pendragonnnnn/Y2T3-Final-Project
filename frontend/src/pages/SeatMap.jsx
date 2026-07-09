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
  const [highlightedSeatId, setHighlightedSeatId] = useState(null);

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
      showToast('Seat reserved!');
      setTimeout(() => navigate('/reservations'), 1200);
    } catch (err) {
      showToast(err.response?.data?.error || 'Could not reserve seat');
      loadSeats();
    } finally {
      setReserving(false);
    }
  };

  const handleHighlightReservation = async () => {
    try {
      const { data } = await api.get('/reservations/mine');
      const reservation = data.reservations?.find((item) => item.status === 'pending' || item.status === 'active') || data.reservations?.[0];
      if (!reservation) {
        showToast('You do not have a reservation to highlight');
        return;
      }

      const reservedSeat = seats.find((seat) => seat.seat_id === reservation.seat_id);
      if (reservedSeat) {
        setHighlightedSeatId(reservedSeat.seat_id);
      } else {
        setHighlightedSeatId(reservation.seat_id);
      }
      showToast('Your reserved seat is highlighted');
    } catch (err) {
      showToast(err.response?.data?.error || 'Could not load your reservation');
    }
  };

  return (
    
    <div className="screen">
      <div className="screen-header">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h2 className="screen-title">Library Map</h2>
        </div>
        {hasActive && (
          <div className="alert alert-warning">
            You already have a pending or active reservation.
          </div>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>
          Drag to pan · scroll to zoom
        </p>
        <Button style={{ width: 'fit-content'}} variant="outline" size="sm" onClick={handleHighlightReservation}>
            View my seat
      </Button>
      </div>
      

      {loading ? (
        <div className="text-center mt-24"><div className="spinner" style={{ margin: '0 auto' }} /></div>
      ) : (
        <InteractiveSeatMap
          seats={seats}
          selectedSeatId={selected?.seat_id}
          highlightedSeatId={highlightedSeatId}
          onSelectSeat={setSelected}
        />
      )}
    
      {selected && (
      <div className="card mt-16" style={{ position: 'sticky', bottom: -20, paddingLeft: '0px' ,paddingTop: '6px', display: 'flex', flexDirection: 'row', gap: '10px', backgroundColor: 'var(--color-bg)'}}>
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