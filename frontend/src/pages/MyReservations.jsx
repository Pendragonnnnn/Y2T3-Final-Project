import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import api from '../services/api';
import BottomNav from '../components/BottomNav';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import Toast from '../components/Toast';
import { useToast } from '../components/useToast';

const NO_SHOW_WINDOW_MS = 30 * 60 * 1000; // must match backend job

/**
 * Check-in QR: expires exactly 30 min from reservation start_time.
 * The expiry is derived from the DB timestamp — never from Date.now() —
 * so re-renders don't change the QR or extend the window.
 */
function getCheckInQr(reservation) {
  const startTime = reservation.start_time || reservation.reservation_date;
  const expiresAt = new Date(new Date(startTime).getTime() + NO_SHOW_WINDOW_MS).toISOString();
  return JSON.stringify({
    type: 'library-checkin',
    reservationId: reservation.reservation_id,
    seatId: reservation.seat_id,
    expiresAt,
  });
}

/**
 * Check-out QR: no expiry — student can leave whenever they're done.
 * Backend ignores expiresAt for checkout.
 */
function getCheckOutQr(reservation) {
  return JSON.stringify({
    type: 'library-checkout',
    reservationId: reservation.reservation_id,
    seatId: reservation.seat_id,
  });
}

export default function MyReservations() {
  const navigate = useNavigate();
  const { message, showToast } = useToast();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [now, setNow] = useState(Date.now());

  // Tick every second — only used for the countdown display, not QR generation
  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const load = () => {
    setLoading(true);
    api
      .get('/reservations/mine')
      .then(({ data }) => setReservations(data.reservations || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  // Countdown to the 30-min no-show deadline
  const formatCountdown = (startTime) => {
    const expiresAt = new Date(startTime).getTime() + NO_SHOW_WINDOW_MS;
    const diff = Math.max(0, expiresAt - now);
    const m = Math.floor(diff / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const isExpired = (startTime) => {
    return now >= new Date(startTime).getTime() + NO_SHOW_WINDOW_MS;
  };

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

  return (
    <div className="screen">
      <div className="screen-header">
        <h2 className="screen-title">My Reservation</h2>
      </div>

      {loading ? (
        <div className="text-center mt-24">
          <div className="spinner" style={{ margin: '0 auto' }} />
        </div>
      ) : reservations.length === 0 ? (
        <div className="empty-state">
          <p style={{ fontSize: 50, color: 'var(--color-primary)' }}>✉</p>
          <p style={{ fontWeight: 600, marginTop: 8 }}>No active reservation</p>
          <p className="text-muted">Reserve a seat from the library map</p>
        </div>
      ) : (
        <div className="stack">
          {reservations.map((r) => {
            const isPending = r.outcome === 'Pending';
            const isActive  = r.outcome === 'Active';
            const baseTime  = r.start_time || r.reservation_date;
            const expired   = isPending && baseTime && isExpired(baseTime);
            const qrValue   = isPending ? getCheckInQr(r) : isActive ? getCheckOutQr(r) : null;

            return (
              <div key={r.reservation_id} className="qr-card" style={{ background: 'var(--qr-code-bg)', marginBottom: 100}}>

                {/* ── Top row ── */}
                

                {/* ── QR section ── */}
                {qrValue && (
                  <div style={{ marginTop: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12  }}>

                    {/* Context bannesr */}
                    <div style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      background: isPending ? (expired ? '' : '#ff2121') : '#065af6',
                      border: `1px solid ${isPending ? (expired ? '#00000030' : '#F5A62330') : '#ffffff'}`,
                      textAlign: 'center',
                    }}>
                      <p style={{
                        fontWeight: '600',
                        fontSize: 18,
                        color: isPending ? (expired ? 'var(--color-danger)' : '#ffffff') : '#ffffff',
                      }}>
                        {isPending
                          ? (expired ? 'Check-in window closed' : 'Check-in QR')
                          : 'Check-out QR'}
                      </p>
                      <p className="text-muted" style={{ fontSize: 12, marginTop: 2, color: expired ? 'var(--color-text-primary)' : '#dadada' }}>
                        {isPending
                          ? (expired
                              ? 'This reservation has expired and will be removed shortly'
                              : 'Show this to the manager to confirm your seat')
                          : 'Show this to the manager when you are done'}
                      </p>
                    </div>

                    {/* QR code — greyed out if expired */}
                    <div style={{
                      padding: 12,
                      background: '#fff',
                      borderRadius: 12,
                      boxShadow: '0 2px 12px rgba(26,34,56,0.08)',
                      border: '1px solid var(--color-border)',
                      opacity: expired ? 0.35 : 1,
                      filter: expired ? 'grayscale(1)' : 'none',
                      transition: 'opacity 0.4s ease',
                    }}>
                      <QRCodeSVG value={qrValue} size={240} level="H" includeMargin={false} />
                    </div>

                    {/* Countdown (only for pending, not expired) */}
                    {isPending && baseTime && !expired && (
                      <p className="text-muted" style={{ fontSize: 12, textAlign: 'center' }}>
                        Check-in window closes in{' '}
                        <strong style={{ color: 'var(--color-text-primary)' }}>
                          {formatCountdown(baseTime)} {qrValue}
                        </strong>
                      </p>
                    )}

                    {/* No expiry note for checkout */}
                    {isActive && (
                      <p className="text-muted" style={{ fontSize: 12, textAlign: 'center' }}>
                        No expiry — scan when you're ready to leave {qrValue}
                        
                      </p>
                      
                    )}
                  </div>
                )}

                {/* ── Actions ── */}
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', marginTop: '28px' }}>
                  {isPending && (
                    <Button
                    className='cancel-action-btn'
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancel(r.reservation_id)}
                      loading={busyId === r.reservation_id}

                    >
                      Cancel
                    </Button>
                  )}

                  {/* marginLeft: 'auto' forces this div to the far right side */}
                  <div style={{ marginLeft: 'auto' }}>
                    <p className="text-muted" style={{ margin: 0, marginTop: '2px' }}>
                      {baseTime ? new Date(baseTime).toLocaleString() : 'No date available'}
                    </p>
                  </div>
              </div>    
                
                  
                

              </div>
            );
          })}
        </div>
      )}

      <Toast message={message} />
      <BottomNav />
    </div>
  );
}