import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/Button';
import Toast from '../components/Toast';
import { useToast } from '../components/useToast';

// Maps each QR action type to the backend route and human-readable label
const QR_ACTIONS = {
  'library-checkin': {
    route: '/reservations/scan-checkin',
    successLabel: 'Checked in',
    icon: '✅',
  },
  'library-checkout': {
    route: '/reservations/scan-checkout',
    successLabel: 'Checked out',
    icon: '✅',
  },
};

export default function ManagerScanner() {
  const navigate = useNavigate();
  const { message, showToast } = useToast();
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastScan, setLastScan] = useState(null); // { type, seatId, studentName, timestamp }

  const inputRef = useRef(null);

  // Keep the field permanently focused so the USB gun fires straight into it
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Re-focus after each scan so the manager never has to click the box again
  const refocus = () => setTimeout(() => inputRef.current?.focus(), 50);

  const handleScanSubmit = async (e) => {
    e.preventDefault();
    const raw = inputVal.trim();
    if (!raw || loading) return;

    setLoading(true);
    setLastScan(null);

    try {
      // 1. Parse QR payload
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error('Unreadable QR code. Please try again.');
      }

      // 2. Look up the right backend route for this QR type
      const action = QR_ACTIONS[data.type];
      if (!action) {
        throw new Error(`Unknown QR type "${data.type}". This code is not for this library system.`);
      }

      // 3. Call the backend
      const response = await api.post(action.route, {
        reservationId: data.reservationId,
        expiresAt: data.expiresAt,
      });

      // 4. Show success
      setLastScan({
        outcome: 'success',
        type: data.type,
        icon: action.icon,
        label: action.successLabel,
        seatId: response.data.seatId,
        message: response.data.message,
        timestamp: new Date().toLocaleTimeString(),
      });

      showToast(`${action.icon} ${action.successLabel}`);
    } catch (err) { 
      const errMsg =
        err.response?.data?.error || // backend validation error
        err.message ||               // our own thrown error
        'Something went wrong. Please try again.';

      setLastScan({
        outcome: 'error',
        icon: '❌',
        label: 'Scan failed',
        message: errMsg,
        timestamp: new Date().toLocaleTimeString(),
      });
    } finally {
      setInputVal('');
      setLoading(false);
      refocus();
    }
  };

  return (
    <div className="screen" style={{ padding: 16 }}>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="faq-screen-header">
        <div>
          <p className="text-muted">Scanner Station</p>
          <h2 className="screen-title">Scan Student QR</h2>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate('/manager/dashboard')}>
          ← Dashboard
        </Button>
      </div>

      {/* ── Scanner input card ─────────────────────────────────────────────── */}
      <div
        className="card"
        style={{ maxWidth: 420, margin: '24px auto 0', padding: 28, textAlign: 'center' }}
      >
        {/* Pulsing ring to indicate "ready" */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: loading
                ? '#FFF4E0'
                : 'linear-gradient(135deg, #E8F8EE 0%, #d1f2e2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              boxShadow: loading
                ? '0 0 0 8px rgba(245,166,35,0.15)'
                : '0 0 0 8px rgba(46,204,113,0.12)',
              transition: 'all 0.3s ease',
            }}
          >
            {loading ? '⏳' : '📷'}
          </div>
        </div>

        <p style={{ fontWeight: 600, marginBottom: 6, color: 'var(--color-text-primary)' }}>
          {loading ? 'Processing…' : 'Ready to scan'}
        </p>
        <p className="text-muted" style={{ marginBottom: 20, fontSize: 13, lineHeight: 1.5 }}>
          Point the USB scanner at a student's QR code.
          <br />
          Works for both <strong>check-in</strong> and <strong>check-out</strong>.
        </p>

        {/* Hidden-ish input that catches all scanner keystrokes */}
        <form onSubmit={handleScanSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={loading ? 'Processing…' : '▸  Waiting for scan…'}
            disabled={loading}
            autoComplete="off"
            style={{
              padding: '13px 16px',
              width: '100%',
              textAlign: 'center',
              fontSize: 15,
              fontFamily: 'var(--font-body)',
              border: `2px solid ${loading ? 'var(--color-warning)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-sm)',
              background: loading ? '#FFFBF2' : '#FAFBFD',
              color: 'var(--color-text-primary)',
              outline: 'none',
              transition: 'border-color 0.2s ease',
            }}
          />
        </form>
      </div>

      {/* ── Last scan result card ──────────────────────────────────────────── */}
      {lastScan && (
        <div
          className="card"
          style={{
            maxWidth: 420,
            margin: '16px auto 0',
            padding: '20px 24px',
            borderLeft: `4px solid ${lastScan.outcome === 'success' ? 'var(--color-success)' : 'var(--color-danger)'}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 28, lineHeight: 1 }}>{lastScan.icon}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
                {lastScan.message}
              </p>
            </div>
            <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)', whiteSpace: 'nowrap' }}>
              {lastScan.timestamp}
            </span>
          </div>
        </div>
      )}

      {/* ── Legend ────────────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 420,
          margin: '20px auto 0',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
        }}
      >
        
      </div>

      
    </div>
  );
}