import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import BottomNav from '../components/BottomNav';
import Toast from '../components/Toast';
import { useToast } from '../components/useToast';
import InteractiveSeatMap from '../components/InteractiveSeatMap';

export default function ManagerMap() {
  const { message, showToast } = useToast();
  const [seats, setSeats]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null); // seat object whose bottom sheet is open
  const [busy, setBusy]         = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    api.get('/seats/manager-map')
      .then(({ data }) => setSeats(data.seats))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSeatTap = (seat) => {
    setSelected(seat);
    
  }
  const handleToggle = async () => {
    if (!selected) return;
    setBusy(true);
    try {
      const isBlocked = selected.current_status === 'blocked';
      const endpoint = isBlocked ? 'open' : 'block';
      await api.patch(`/seats/${selected.seat_id}/${endpoint}`);
      showToast(`Seat ${selected.seat_id} ${isBlocked ? 'opened' : 'blocked'}`);
      setSelected(null);
      load();
    } catch (err) {
      showToast(err.response?.data?.error || 'Action failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="screen">
      <div className="screen-header">
        <div>
          <p className="text-muted">Control mode</p>
          <h2 className="screen-title">Seat Map</h2>
        </div>
      </div>

      {loading ? (
        <div className="text-center mt-24"><div className="spinner" style={{ margin: '0 auto' }} /></div>
      ) : (
        <InteractiveSeatMap
          seats={seats}
          mode="manager"
          selectedSeatId={selected?.seat_id}
          onManagerSeatTap={handleSeatTap}
        />
      )}

      {/* ── Bottom sheet: open/block toggle ── */}
      {console.log('render — selected is:', selected)}
      {selected && (
        <div className="card mt-16" style={{ position: 'sticky', bottom: 10, paddingLeft: '16px' ,paddingTop: '16px', display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'flex-start'}}>

          <button
            onClick={handleToggle}
            disabled={busy}
            style={{
              width: '100%', padding: '12px 0', borderRadius: 8,
              background: selected.current_status === 'blocked' ? 'rgba(34,197,94,0.1)' : 'rgba(100,116,139,0.15)',
              border: `1px solid ${selected.current_status === 'blocked' ? '#22c55e40' : '#334155'}`,
              color: selected.current_status === 'blocked' ? '#22c55e' : '#94a3b8',
              fontSize: 13, fontWeight: 600, cursor: busy ? 'not-allowed' : 'pointer',
              opacity: busy ? 0.6 : 1,
            }}
          >
            {busy ? 'Working…' : selected.current_status === 'blocked' ? 'Open seat' : 'Block seat'}
          </button>
          <button 
          onClick={() => setSelected(null)} 
          className='mt-8 cancel-action-btn'
          aria-label="Close"
          style={{ paddingTop: '4px' }}
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