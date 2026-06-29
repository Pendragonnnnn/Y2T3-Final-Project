import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import Button from '../components/Button';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);

  // Change password state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Dark mode state — persisted to localStorage
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('sl_dark_mode') === 'true';
  });

  useEffect(() => {
    api.get('/auth/me').then(({ data }) => setProfile(data.user));
    api.get('/reservations/history').then(({ data }) => setHistory(data.history));
  }, []);

  // Apply/remove dark mode class on root element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('sl_dark_mode', darkMode);
  }, [darkMode]);

  const penaltyScore = profile?.current_penalty_score ?? 0;
  const penaltyColor =
    penaltyScore <= 100
      ? 'var(--color-success)'
      : penaltyScore < 130
      ? 'var(--color-warning)'
      : 'var(--color-danger)';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePasswordUpdate = async () => {
    setPasswordError('');
    setPasswordSuccess('');
    if (!passwordForm.current || !passwordForm.next) {
      setPasswordError('Both fields are required.');
      return;
    }
    if (passwordForm.next.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    setPasswordLoading(true);
    try {
      await api.post('/auth/change-password', {
        currentPassword: passwordForm.current,
        newPassword: passwordForm.next,
      });
      setPasswordSuccess('Password updated successfully.');
      setPasswordForm({ current: '', next: '' });
      setTimeout(() => {
        setShowPasswordForm(false);
        setPasswordSuccess('');
      }, 2000);
    } catch (err) {
      setPasswordError(err.response?.data?.error || 'Failed to update password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="screen">
      <div className="screen-header">
        <h2 className="screen-title" style={{ marginBottom: '24px' }}>My Profile</h2>
      </div>

      {/* Avatar + name */}
      <div className="text-center">
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: '#4095f6d2',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 48,
            fontWeight: 500,
            margin: '0 auto 12px',
          }}
        >
          {user?.fullName?.[0]}
        </div>
        <p style={{ fontWeight: '500', fontSize: 25 , color: '#0B56A4' }}>{user?.fullName}</p>
        <p className="text-muted" style={{  fontSize: 14 }}>{user?.email}</p>
      </div>

      {/* Penalty score */}
      

      

      <div className='card mt-16'>
          {/* ── Change password ── */}
      <div style={{ alignItems: 'center', padding: '0px 0 8px 0' }}>
        <div
          className="flex-between"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setShowPasswordForm((v) => !v);
            setPasswordError('');
            setPasswordSuccess('');
            setPasswordForm({ current: '', next: '' });
          }}
        >
          <div className="flex-row" style={{ gap: 10 }}>
            <span style={{ fontSize: 20 , marginRight: '4px', color: '#0B56A4' }}>🔒︎</span>
            <p style={{ fontWeight: 600 }}>Change password</p>
          </div>
          <span
            style={{
              fontSize: 18,
              color: 'var(--color-text-secondary)',
              transform: showPasswordForm ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
              display: 'inline-block',
            }}
          >
            ›
          </span>
        </div>

        {showPasswordForm && (
          <div style={{ marginTop: 16, borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
            <div className="field">
              <label>Current password</label>
              <input
                type="password"
                placeholder="Enter current password"
                value={passwordForm.current}
                onChange={(e) => setPasswordForm((f) => ({ ...f, current: e.target.value }))}
              />
            </div>
            <div className="field">
              <label>New password</label>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={passwordForm.next}
                onChange={(e) => setPasswordForm((f) => ({ ...f, next: e.target.value }))}
              />
            </div>

            {passwordError && (
              <p style={{ color: 'var(--color-danger)', fontSize: 13, marginBottom: 10 }}>
                {passwordError}
              </p>
            )}
            {passwordSuccess && (
              <p style={{ color: 'var(--color-success)', fontSize: 13, marginBottom: 10 }}>
                {passwordSuccess}
              </p>
            )}

            <Button onClick={handlePasswordUpdate} loading={passwordLoading}>
              Update password
            </Button>
          </div>
        )}
        
      </div>
        
        <div style={{ display: 'flex' , justifyContent: 'flex-end'}}><span style={{ color: '#b7b7b7ad'  }}>‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾</span></div>
      
      

      {/* ── FAQ ── */}
      <div
       
        style={{ cursor: 'pointer', padding: '0px 0 8px 0', alignItems: 'center'}}
        onClick={() => navigate('/faq')}
      >
        <div className="flex-between">
          <div className="flex-row" style={{ gap: 10 }}>
            <span style={{ fontSize: 20, marginRight: '4px', color: '#0B56A4' }}>ⓘ</span>
            <p style={{ fontWeight: 600 }}>FAQs</p>
          </div>
          <span style={{ fontSize: 18, color: 'var(--color-text-secondary)' }}>›</span>
        </div>
        
      </div>

      <div style={{ display: 'flex' , justifyContent: 'flex-end'}}><span style={{ color: '#b7b7b7ad'  }}>‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾</span></div>
      

      {/* ── Dark mode ── */}
      <div >
        <div className="flex-between" style={{ alignItems: 'center' }}>
          <div className="flex-row" style={{ gap: 10,padding: '0px 0 8px 0'  }}>
            <span style={{ fontSize: 20, paddingBottom: '0px', marginRight: '4px', color: '#0B56A4'}}>{darkMode ? '⏾' : '☼'}</span>
            <div>
              <p style={{ fontWeight: 600 }}>Dark mode</p>
              
            </div>
          </div>

          {/* Toggle switch */}
          <div
            onClick={() => setDarkMode((v) => !v)}
            style={{
              width: 48,
              height: 28,
              borderRadius: 999,
              background: darkMode ? 'var(--color-primary)' : 'var(--color-border)',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 3,
                left: darkMode ? 23 : 3,
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: 'white',
                boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
                transition: 'left 0.2s ease',
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex' , justifyContent: 'flex-end'}}><span style={{ color: '#b7b7b7ad'  }}>‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾</span></div>

      {/* ── Feedback ── */}
      <div
        style={{ cursor: 'pointer', padding: '0px 0 8px 0', alignItems: 'center'}}
        onClick={() => navigate('/feedback')}
      >
        <div className="flex-between">
          <div className="flex-row" style={{ gap: 10 }}>
            <span style={{ fontSize: 20, marginRight: '4px', color: '#0B56A4' }}>🗨</span>
            <p style={{ fontWeight: 600 }}>Feedback</p>
          </div>
          <span style={{ fontSize: 18, color: 'var(--color-text-secondary)' }}>›</span>
        </div>
      </div>

      </div>


      
      <div style={{border: '1px solid', marginTop: '32px', borderRadius: "16px", color: '#b7b7b7ad', backgroundColor: '#ffffff'}}>
        <button onClick={handleLogout} className="logout-button " >
        Log out
      </button>
      </div>
      

      <BottomNav />
    </div>
  );
}