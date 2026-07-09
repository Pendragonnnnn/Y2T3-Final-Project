import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import BottomNav from '../components/BottomNav';
import Button from '../components/Button';
import Toast from '../components/Toast';
import { useToast } from '../components/useToast';
import person from '../assets/person.svg';


export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { message, showToast } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = useCallback(async () => {
    if (!user?.userId) return;
    try {
      const { data } = await api.get(`/notifications/${user.userId}/count`);

      // Debug: see exactly what the server sent back.
      console.log('unread-count response:', data);

      // Handle a few possible response shapes defensively:
      // { unreadCount: 2 }, { count: 2 }, or a raw number.
      const count =
        data?.unreadCount ??
        data?.count ??
        (typeof data === 'number' ? data : 0);

      setUnreadCount(Number(count) || 0);
    } catch (err) {
      console.error('Error fetching unread notifications count:', err);
    }
  }, [user]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data } = await api.get('/seats/stats');
        setStats(data.stats);
      } finally {
        setLoading(false);
      }

      fetchUnreadCount(); // Fetch unread notifications count after loading stats
    };

    loadStats();
  }, [fetchUnreadCount]);

  // Listen for the "notificationUpdated" event fired by Notification.jsx
  // whenever a notification (or all of them) gets marked as read, and
  // also refresh whenever the user comes back to this tab/screen.
  useEffect(() => {
    const handleNotificationUpdated = () => {
      fetchUnreadCount();
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchUnreadCount();
      }
    };

    window.addEventListener('notificationUpdated', handleNotificationUpdated);
    window.addEventListener('focus', fetchUnreadCount);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('notificationUpdated', handleNotificationUpdated);
      window.removeEventListener('focus', fetchUnreadCount);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [fetchUnreadCount]);

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
        <div className="welcome-card">
          <button className="profile-icon" type="button" onClick={() => navigate('/profile')}>
            <img src={person} alt="Profile" />
          </button>

          <div className="welcome-text">
            <p className="text-muted">Welcome back,</p>
            <h2 className="screen-title">{user?.fullName?.split(' ')[0]} 👋</h2>
          </div>
        </div>
        <div
          style={{
            width: 40, height: 40, borderRadius: 12, background: 'var(--color-primary)',
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 600,
          }}
        >
          <button
            className="notif-btn"
            aria-label="Open notifications"
            onClick={() => navigate('/notifications')}
          >
            🔔
            {unreadCount > 0 && (
              <span className="notif-dot">{unreadCount > 99 ? '99+' : unreadCount}</span>
            )}
            
          </button>
          
        </div>
      </div>

      {/* Seat stats card — Mobile 2 style with two stat pills */}
      <div className="card mt-8" style={{ background: 'linear-gradient(270deg, var(--color-primary), var(--color-primary-light))', padding: 20 }}>
        <p style={{ color: 'white', fontSize: 14, paddingBottom: 10 }}>Seats available right now</p>
        {loading ? (
          <div className="spinner" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white', margin: '12px 0' }} />
        ) : (
          <div className="flex-row" style={{ gap: 16, marginTop: 8 }}>
            <div className='show_seat'>
              <p style={{ color: 'blue', fontSize: 28, fontWeight: 700 }}>{stats?.available ?? 0}</p>
              <p style={{ color: 'var(--color-text-primary)', fontSize: 11 }}>Available</p>
            </div >

            <div className='show_seat'>
              <p style={{ color: 'red', fontSize: 28, fontWeight: 700 }}>{stats?.occupied ?? 0}</p>
              <p style={{ color: 'var(--color-text-primary)', fontSize: 11 }}>Occupied</p>
            </div>

            <div className='show_seat'>
              <p style={{ color: 'rgb(31, 146, 35)', fontSize: 28, fontWeight: 700 }}>{stats?.total ?? 0}</p>
              <p style={{ color: 'var(--color-text-primary)', fontSize: 11 }}>Total</p>
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

      <Toast message={message} />
      <BottomNav />

      <div className="card1">
        <div className="card-header">
          <h2 className="card-title">Library Map</h2>
          <button className="view-full " onClick={() => navigate('/map')}>
            View Full
          </button>
        </div>
        <div className="map-area">
          <span className="floor-badge">Floor</span>
          <div className="pin" onClick={() => navigate('/map')}>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 7 12 8 12s8-6.75 8-12c0-4.42-3.58-8-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
            </svg>
          </div>
          <div className="status-dots">
            <span className="dot-green"></span>
            <span className="dot-red"></span>
            <span className="dot-gray"></span>
          </div>
        </div>
      </div>

    </div>
  );
}