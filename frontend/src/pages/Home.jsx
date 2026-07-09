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
  const [hasActive, setHasActive] = useState(false);
  const [report, setReport] = useState(null);
  //////////////////////////////////////////
  

const checkActiveReservation = useCallback(async () => {
  try {
    const { data } = await api.get('/reservations/check-status'); // Add this endpoint in your backend
    setHasActive(data.hasActive);
  } catch (err) {
    console.error("Failed to check status", err);
  }
}, []);

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
    const loadHomeData = async () => {
      setLoading(true);
      try {
        const [statsResponse, reportResponse] = await Promise.all([
          api.get('/seats/stats'),
          api.get('/reservations/peakHours'),
        ]);

        setStats(statsResponse.data.stats);
        setReport(reportResponse.data);
        await checkActiveReservation();
        fetchUnreadCount();
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, [checkActiveReservation, fetchUnreadCount]);

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
///////////////////////////////////
  

  const handleQuickReserve = async () => {
    setReserving(true);
    try {
      const { data } = await api.post('/reservations/quick');
      showToast(`Seat reserved!`);
      setTimeout(() => navigate('/reservations'), 1200);
    } catch (err) {
      showToast(err.response?.data?.error || 'Could not reserve a seat');
    } finally {
      setReserving(false);
    }
  };

  const peakHours = report?.peakHours;

  const maxCount = peakHours && peakHours.length > 0 
    ? Math.max(...peakHours.map(p => p.count)) 
    : 1;
  
  return (
    <div className="screen">
      <div className="home-screen-header">
        {hasActive && (
          <div className="alert alert-warning">
            You already have a pending or active reservation.
          </div>
        )}
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
      <div style={{ display: 'flex', gap: '64px', alignItems: 'center'}}>
      <div className="home-card mt-8" style={{ background: 'linear-gradient(270deg, var(--color-primary), var(--color-primary-light))', padding: 20  }}>
        <p style={{ color: 'white', fontSize: 14, paddingBottom: 10 }}>Seats available right now</p>
        {loading ? (
          <div className="spinner" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white', margin: '12px 0' }} />
        ) : (
          <div className="flex-row" style={{ gap: 16, marginTop: 8 }}>
            <div className='show_seat'>
              <p style={{ color: 'var(--color-primary)', fontSize: 28, fontWeight: 700 }}>{stats?.available ?? 0}</p>
              <p style={{ color: 'var(--color-text-primary)', fontSize: 11 }}>Available</p>
            </div >

            <div className='show_seat'>
              <p style={{ color: '#a90505', fontSize: 28, fontWeight: 700 }}>{stats?.occupied ?? 0}</p>
              <p style={{ color: 'var(--color-text-primary)', fontSize: 11 }}>Occupied</p>
            </div>

            <div className='show_seat'>
              <p style={{ color: '#539546', fontSize: 28, fontWeight: 700 }}>{stats?.total ?? 0}</p>
              <p style={{ color: 'var(--color-text-primary)', fontSize: 11 }}>Total</p>
            </div>
          </div>
        )}
      </div>

        <div className="card1-desktop" style={{ flexGrow: ''  }}>
        <div className="card-header">
          <h2 className="card-title">Peak Booking Hours </h2>
        </div>
        <div className="card mt-16">
        <p style={{ fontWeight: 200, marginBottom: 20, color:'#666666', fontSize:'12px'}}>Most recent 30 days</p>
        
        {!peakHours || peakHours.length === 0 ? (
          <p className="text-muted text-center py-4">No hourly data tracked yet.</p>
        ) : (
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-end', 
              height: '140px', 
              paddingTop: '20px',
              borderBottom: '1px solid var(--color-border)'
            }}
          >
            {[...peakHours]
              .sort((a, b) => a.hour - b.hour)
              .map((item) => {
                const barHeight = `${Math.min(Math.max((item.count / maxCount) * 100, 8), 100)}%`;
                const displayHour = item.hour >= 12 
                  ? `${item.hour === 12 ? 12 : item.hour - 12}pm` 
                  : `${item.hour}am`;
                console.log(`Hour: ${item.hour}, Count: ${item.count}, Max: ${maxCount}, Height: ${barHeight}`);
                return (
                  <div key={item.hour} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '10px', color: 'var(--color-text-primary)', fontWeight: '600', marginBottom: '4px' }}>
                      {item.count}
                    </span>
                    <div style={{ width: '65%', height: barHeight, backgroundColor: '#4095F6', borderRadius: '4px 4px 0 0', transition: 'height 0.3s ease', minHeight: '8px', flexShrink: 0 }} title={`${item.count} reservations at ${displayHour}`} />
                    <span className="text-muted" style={{ fontSize: '10px', marginTop: '8px', whiteSpace: 'nowrap' }}>
                      {displayHour}
                    </span>
                  </div>
                );
              })}
          </div>
        )}
      </div>
      </div>

      </div>

      {/* Reservation actions — Mobile 4 style: choose your own seat vs random */}
      
      <h3 style={{ fontSize: 15, marginTop: 24, marginBottom: 12 }}>Find a seat</h3>
      <div className="stack">
        <div className="card flex-between" onClick={handleQuickReserve} disabled={hasActive} style={{ cursor: 'pointer' }}>
          <div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'center'}}>
              <div style={{ fontSize: "18px" }}>ϟ</div>
              <p style={{ fontWeight: 600, fontSize: 14 }}> Quick Random Reserve</p>
            </div>
            
            <p className="text-muted">Instantly grab any available seat</p>
          </div>
        </div>
        <div className="card flex-between"  onClick={() => navigate('/map')} style={{ cursor: 'pointer' }}>
          <div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'center'}}>
              <div style={{ fontSize: "18px" }} >𖥔</div>
              <p style={{ fontWeight: 600, fontSize: 14 }}> Choose Your Own Seat</p>
            </div>
            <p className="text-muted">Browse the real-time seat map</p>
          </div>
        </div>
      </div>

      <Toast message={message} />
      <BottomNav />

      <div className="card1-mobile">
        <div className="card-header">
          <h2 className="card-title">Peak Booking Hours </h2>
        </div>
        <div className="card mt-16">
        <p style={{ fontWeight: 200, marginBottom: 20, color:'#666666', fontSize:'12px'}}>Most recent 30 days</p>
        
        {!peakHours || peakHours.length === 0 ? (
          <p className="text-muted text-center py-4">No hourly data tracked yet.</p>
        ) : (
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-end', 
              height: '140px', 
              paddingTop: '20px',
              borderBottom: '1px solid var(--color-border)'
            }}
          >
            {[...peakHours]
              .sort((a, b) => a.hour - b.hour)
              .map((item) => {
                const barHeight = `${Math.min(Math.max((item.count / maxCount) * 100, 8), 100)}%`;
                const displayHour = item.hour >= 12 
                  ? `${item.hour === 12 ? 12 : item.hour - 12}pm` 
                  : `${item.hour}am`;
                console.log(`Hour: ${item.hour}, Count: ${item.count}, Max: ${maxCount}, Height: ${barHeight}`);
                return (
                  <div key={item.hour} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '10px', color: 'var(--color-text-primary)', fontWeight: '600', marginBottom: '4px' }}>
                      {item.count}
                    </span>
                    <div style={{ width: '65%', height: barHeight, backgroundColor: '#4095F6', borderRadius: '4px 4px 0 0', transition: 'height 0.3s ease', minHeight: '8px', flexShrink: 0 }} title={`${item.count} reservations at ${displayHour}`} />
                    <span className="text-muted" style={{ fontSize: '10px', marginTop: '8px', whiteSpace: 'nowrap' }}>
                      {displayHour}
                    </span>
                  </div>
                );
              })}
          </div>
        )}
      </div>
      </div>

    </div>
  );
}