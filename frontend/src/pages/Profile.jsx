import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import Button from '../components/Button';

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  // Edit name state
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState('');
  const [nameLoading, setNameLoading] = useState(false);
  const [nameError, setNameError] = useState('');

  // Change password state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('sl_dark_mode');
    if (stored !== null) return stored === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    api.get('/auth/me').then(({ data }) => setProfile(data.user));
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('sl_dark_mode', String(darkMode));
  }, [darkMode]);

  const handleEditName = () => {
    setNameValue(user?.fullName || '');
    setNameError('');
    setEditingName(true);
  };

  const handleSaveName = async () => {
    if (!nameValue.trim()) { setNameError('Name cannot be empty.'); return; }
    setNameLoading(true);
    setNameError('');
    try {
      await api.patch('/auth/update-name', { fullName: nameValue.trim() });
      // Update the auth context so the name changes everywhere instantly
      updateUser({ fullName: nameValue.trim() });
      setEditingName(false);
    } catch (err) {
      setNameError(err.response?.data?.error || 'Failed to update name.');
    } finally {
      setNameLoading(false);
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const handlePasswordUpdate = async () => {
    setPasswordError(''); setPasswordSuccess('');
    if (!passwordForm.current || !passwordForm.next) { setPasswordError('Both fields are required.'); return; }
    if (passwordForm.next.length < 6) { setPasswordError('New password must be at least 6 characters.'); return; }
    setPasswordLoading(true);
    try {
      await api.post('/auth/change-password', { currentPassword: passwordForm.current, newPassword: passwordForm.next });
      setPasswordSuccess('Password updated successfully.');
      setPasswordForm({ current: '', next: '' });
      setTimeout(() => { setShowPasswordForm(false); setPasswordSuccess(''); }, 2000);
    } catch (err) {
      setPasswordError(err.response?.data?.error || 'Failed to update password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const displayName = user?.fullName || profile?.full_name || '';
  const accentColor = 'var(--color-primary)';

  return (
    <div className="screen">
      <div className="screen-header">
        <h2 className="screen-title" style={{ marginBottom: '24px' }}>My Profile</h2>
      </div>

      {/* ── Avatar + name ── */}
      <div className="text-center">
        <div style={{
          width: 100, height: 100, borderRadius: '50%',
          background: '#4095f6d2', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 48, fontWeight: 500, margin: '0 auto 12px',
        }}>
          {displayName?.[0]?.toUpperCase()}
        </div>

        {/* Name — inline edit */}
        {editingName ? (
          <div className="profile-edit-container" style={{ marginTop: 4 }}>
            <input
              type="text"
              value={nameValue}
              onChange={e => setNameValue(e.target.value)}
              autoFocus
              onKeyDown={e => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') setEditingName(false); }}
              style={{
                fontSize: 18, fontWeight: 600, textAlign: 'center',
                border: '1.5px solid var(--color-primary)',
                borderRadius: 8, padding: '6px 14px',
                color: 'var(--color-text-primary)',
                background: 'var(--color-surface)',
                outline: 'none', width: '100%', maxWidth: 320,
              }}
            />
            {nameError && <p style={{ color: 'var(--color-danger)', fontSize: 12 }}>{nameError}</p>}
            <div className="profile-actions">
              <Button onClick={handleSaveName} loading={nameLoading}>{nameLoading ? 'Saving…' : 'Save'}</Button>
              <Button variant="outline" onClick={() => setEditingName(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4, paddingLeft: '24px' }}>
            <p style={{ fontWeight: 500, fontSize: 22, color: accentColor }}>{displayName}</p>
            <button
              onClick={handleEditName}
              title="Edit name"
              style={{ color: accentColor, fontSize: 20, lineHeight: 1, padding: 2 }}
            >
              ✎
            </button>
          </div>
        )}

        <p className="text-muted" style={{ fontSize: 14, marginTop: 2 }}>{user?.email}</p>
      </div>

      <div className='card profile-card mt-16' style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', marginLeft: 'auto' }}>
        {/* ── Change password ── */}
        <div style={{ alignItems: 'center', padding: '0px 0 8px 0' }}>
          <div className="flex-between" style={{ cursor: 'pointer' }}
            onClick={() => { setShowPasswordForm(v => !v); setPasswordError(''); setPasswordSuccess(''); setPasswordForm({ current: '', next: '' }); }}>
            <div className="flex-row" style={{ gap: 10 }}>
              <span style={{ fontSize: 20, marginRight: '4px', color: accentColor }}>🔒︎</span>
              <p style={{ fontWeight: 600 }}>Change password</p>
            </div>
            <span style={{ fontSize: 18, color: 'var(--color-text-secondary)', transform: showPasswordForm ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', display: 'inline-block' }}>›</span>
          </div>

          {showPasswordForm && (
            <div style={{ marginTop: 16, borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
              <div className="field">
                <label>Current password</label>
                <input type="password" placeholder="Enter current password" value={passwordForm.current} onChange={e => setPasswordForm(f => ({ ...f, current: e.target.value }))} />
              </div>
              <div className="field">
                <label>New password</label>
                <input type="password" placeholder="At least 6 characters" value={passwordForm.next} onChange={e => setPasswordForm(f => ({ ...f, next: e.target.value }))} />
              </div>
              {passwordError && <p style={{ color: 'var(--color-danger)', fontSize: 13, marginBottom: 10 }}>{passwordError}</p>}
              {passwordSuccess && <p style={{ color: 'var(--color-success)', fontSize: 13, marginBottom: 10 }}>{passwordSuccess}</p>}
              <Button onClick={handlePasswordUpdate} loading={passwordLoading}>Update password</Button>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}><span style={{ color: '#b7b7b7ad' }}>‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾</span></div>

        {/* ── FAQ ── */}
        <div style={{ cursor: 'pointer', padding: '0px 0 8px 0' }} onClick={() => navigate('/faq')}>
          <div className="flex-between">
            <div className="flex-row" style={{ gap: 10 }}>
              <span style={{ fontSize: 20, marginRight: '4px', color: accentColor }}>ⓘ</span>
              <p style={{ fontWeight: 600 }}>FAQs</p>
            </div>
            <span style={{ fontSize: 18, color: 'var(--color-text-secondary)' }}>›</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}><span style={{ color: '#b7b7b7ad' }}>‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾</span></div>

        {/* ── Dark mode ── */}
        <div>
          <div className="flex-between" style={{ alignItems: 'center' }}>
            <div className="flex-row" style={{ gap: 10, padding: '0px 0 8px 0' }}>
              <span style={{ fontSize: 20, marginRight: '4px', color: accentColor }}>{darkMode ? '⏾' : '☼'}</span>
              <p style={{ fontWeight: 600 }}>Dark mode</p>
            </div>
            <div onClick={() => setDarkMode(v => !v)} style={{ width: 48, height: 28, borderRadius: 999, background: darkMode ? 'var(--color-primary)' : 'var(--color-border)', position: 'relative', cursor: 'pointer', transition: 'background 0.2s ease', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: 3, left: darkMode ? 23 : 3, width: 22, height: 22, borderRadius: '50%', background: 'var(--color-surface)', boxShadow: '0 1px 4px rgba(0,0,0,0.18)', transition: 'left 0.2s ease' }} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}><span style={{ color: '#b7b7b7ad' }}>‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾</span></div>

        {/* ── Feedback ── */}
        <div style={{ cursor: 'pointer', padding: '0px 0 8px 0' }} onClick={() => navigate('/feedback')}>
          <div className="flex-between">
            <div className="flex-row" style={{ gap: 10 }}>
              <span style={{ fontSize: 20, marginRight: '4px', color: accentColor }}>🗨</span>
              <p style={{ fontWeight: 600 }}>Feedback</p>
            </div>
            <span style={{ fontSize: 18, color: 'var(--color-text-secondary)' }}>›</span>
          </div>
        </div>
      </div>

      <div className="profile-logout mt-16" style={{ margin: 'auto'}}>
        <button onClick={handleLogout} className="logout-button">Log out</button>
      </div>

      <BottomNav />
    </div>
  );
}