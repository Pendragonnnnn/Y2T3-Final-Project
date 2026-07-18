import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await register(form);
      navigate(user.role?.toLowerCase() === 'manager' ? '/manager' : '/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-wrapper">
      {/* ── MOBILE VIEW ── */}
      <div className="register-mobile">
        <div className="register-header">
          <h2 className="register-title">Create account</h2>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="register-field">
            <label>Full name</label>
            <input 
              value={form.fullName} 
              onChange={update('fullName')} 
              required 
              placeholder="e.g. Miguel Santos" 
            />
          </div>

          <div className="register-field">
            <label>Email</label>
            <input 
              type="email" 
              value={form.email} 
              onChange={update('email')} 
              required 
              placeholder="you@university.edu" 
            />
          </div>

          <div className="register-field">
            <label>Password</label>
            <div className="register-password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={update("password")}
                placeholder="Password"
                required
                minLength={6}
              />
              <button
                type="button"
                className="register-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
              </button>
            </div>
          </div>

          <div className="register-field">
            <label>Role</label>
            <select value={form.role} onChange={update('role')}>
              <option value="student">Student</option>
            </select>
          </div>

          {error && <p className="register-error">{error}</p>}

          <button type="submit" className="register-submit-btn" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Sign up'}
          </button>
        </form>

        <p className="register-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>

      {/* ── DESKTOP/TABLET VIEW ── */}
      <div className="register-desktop">
        <div className="register-card">
          <div className="register-header-desktop">
            <h2 className="register-title-desktop">Create account</h2>
          </div>

          <form onSubmit={handleSubmit} className="register-form-desktop">
            <div className="register-field-desktop">
              <label>Full name</label>
              <input 
                value={form.fullName} 
                onChange={update('fullName')} 
                required 
                placeholder="e.g. Miguel Santos" 
              />
            </div>

            <div className="register-field-desktop">
              <label>Email</label>
              <input 
                type="email" 
                value={form.email} 
                onChange={update('email')} 
                required 
                placeholder="you@university.edu" 
              />
            </div>

            <div className="register-field-desktop">
              <label>Password</label>
              <div className="register-password-wrapper-desktop">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={update("password")}
                  placeholder="Password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="register-password-toggle-desktop"
                  onClick={() => setShowPassword(!showPassword)}
                >
                </button>
              </div>
            </div>

            <div className="register-field-desktop">
              <label>Role</label>
              <select value={form.role} onChange={update('role')}>
                <option value="student">Student</option>
              </select>
            </div>

            {error && <p className="register-error-desktop">{error}</p>}

            <button type="submit" className="register-submit-btn-desktop" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Sign up'}
            </button>
          </form>

          <p className="register-footer-desktop">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}