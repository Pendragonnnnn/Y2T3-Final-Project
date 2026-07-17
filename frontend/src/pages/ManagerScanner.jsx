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
  const [lastScan, setLastScan] = useState(null);
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
        err.response?.data?.error ||
        err.message ||
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
    <div className="scanner-container">
      <div className="scanner-card">
        {/* ── Header ── */}
        <div className="scanner-header">
          <div>
            <p className="text-muted">Scanner Station</p>
            <h2 className="scanner-title">Scan Student QR</h2>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/manager')}>
            ← Dashboard
          </Button>
        </div>

        {/* ── Scanner input card ── */}
        <div className="scanner-content">
          {/* Pulsing ring to indicate "ready" */}
          <div className="scanner-icon-wrapper">
            <div className={`scanner-icon ${loading ? 'loading' : ''}`}>
              {loading ? '⏳' : '📷'}
            </div>
          </div>

          <p className="scanner-status">
            {loading ? 'Processing...' : 'Ready to scan'}
          </p>

          <p className="scanner-description">
            Point the USB scanner at a student's QR code.
            <br />
            Works for both <strong>check-in</strong> and <strong>check-out</strong>.
          </p>

          {/* Hidden-ish input that catches all scanner keystrokes */}
          <form onSubmit={handleScanSubmit} className="scanner-form">
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={loading ? 'Processing...' : '▸ Waiting for scan...'}
              disabled={loading}
              autoComplete="off"
              className="scanner-input"
            />
          </form>
        </div>

        {/* ── Last scan result card ── */}
        {lastScan && (
          <div className={`scan-result ${lastScan.outcome}`}>
            <div className="scan-result-content">
              <span className="scan-result-icon">{lastScan.icon}</span>
              <div className="scan-result-message">
                <p>{lastScan.message}</p>
              </div>
              <span className="scan-result-time">{lastScan.timestamp}</span>
            </div>
          </div>
        )}
      </div>

      <Toast message={message} />
    </div>
  );
}