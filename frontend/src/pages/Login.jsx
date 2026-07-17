import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import s1 from '../assets/s1.png';
import s3 from '../assets/s3.png';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    setDarkMode(isDark);

    const observer = new MutationObserver(() => {
      const isDarkNow = document.documentElement.getAttribute('data-theme') === 'dark';
      setDarkMode(isDarkNow);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(user.role?.toLowerCase() === 'manager' ? '/manager' : '/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logoImage = darkMode ? s3 : s1;

  return (
    <div className="login-wrapper">
      {/* ── MOBILE VIEW ── */}
      <div className="login-mobile">
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div className='logo-container'>
            <img src={logoImage} alt="Logo" className='logo' />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text-primary)' }}>Library Seat Finder</h1>
          <p style={{ opacity: 0.8, fontSize: 13, marginTop: 4, color: 'var(--color-text-secondary)' }}>Reserve your study space in seconds</p>
        </div>

        <form onSubmit={handleSubmit} className="stack">
          <div className="field">
            <label style={{ color: 'var(--color-text-secondary)' }}>Email</label>
            <input
              type="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label style={{ color: 'var(--color-text-secondary)' }}>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
              </button>
            </div>
          </div>

          {error && (
            <p style={{ color: 'var(--color-danger)', fontSize: 13, textAlign: 'center' }}>{error}</p>
          )}

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Log In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--color-text-secondary)' }}>
          Don&apos;t have an account? <Link to="/register" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Sign up</Link>
        </p>

        <div style={{ flex: 1 }}></div>

        <div className="login-demo-mobile">
          <p className="login-demo-title">DEMO ACCOUNTS</p>
          <div className="login-demo-item">
            <span className="login-demo-role">Student:</span>
            <span className="login-demo-email">alice@university.edu</span>
            <span className="login-demo-divider">-</span>
            <span className="login-demo-pass">pass1</span>
          </div>
          <div className="login-demo-item">
            <span className="login-demo-role">Manager:</span>
            <span className="login-demo-email">bob@library.edu</span>
            <span className="login-demo-divider">-</span>
            <span className="login-demo-pass">pass2</span>
          </div>
        </div>
      </div>

      {/* ── DESKTOP/TABLET VIEW ── */}
      <div className="login-desktop">
        <div className="login-card">
          <div className="logo-container">
            <img src={logoImage} alt="Logo" className="logo" />
          </div>

          <h1 className="login-title">Library Seat Finder</h1>
          <p className="login-subtitle">Reserve your study space in seconds</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="login-field">
              <label>Password</label>
              <div className="login-password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                </button>
              </div>
            </div>

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Log In'}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Don't have an account? <Link to="/register">Sign up</Link>
            </p>
          </div>

          <div style={{ flex: 1 }}></div>

          <div className="login-demo">
            <p className="login-demo-title">DEMO ACCOUNTS</p>
            <div className="login-demo-item">
              <span className="login-demo-role">Student:</span>
              <span className="login-demo-email">alice@university.edu</span>
              <span className="login-demo-divider">-</span>
              <span className="login-demo-pass">pass1</span>
            </div>
            <div className="login-demo-item">
              <span className="login-demo-role">Manager:</span>
              <span className="login-demo-email">bob@library.edu</span>
              <span className="login-demo-divider">-</span>
              <span className="login-demo-pass">pass2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}