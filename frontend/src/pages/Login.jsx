import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  return (
    <div
      className="screen"
      style={{
        background: 'linear-gradient(160deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
        color: 'white',
        justifyContent: 'center',
        paddingBottom: 20,
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div
          style={{
            width: 64, height: 64, borderRadius: 20, background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', fontSize: 28,
          }}
        >
          📖
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Library Seat Finder</h1>
        <p style={{ opacity: 0.8, fontSize: 13, marginTop: 4 }}>Reserve your study space in seconds</p>
      </div>

      <form onSubmit={handleSubmit} className="stack">
        <div className="field" style={{ marginBottom: 0 }}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.25)', color: 'white' }}
          />
        </div>
        <div className="field" style={{ marginBottom: 0 }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.25)', color: 'white' }}
          />
        </div>

        {error && (
          <p style={{ color: '#FFD3D0', fontSize: 13, textAlign: 'center' }}>{error}</p>
        )}

        <Button type="submit" variant="primary" loading={loading} className="mt-8" style={{ background: 'white', color: 'var(--color-primary)' }}>
          Log In
        </Button>
      </form>

      <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, opacity: 0.85 }}>
        Don&apos;t have an account? <Link to="/register" style={{ fontWeight: 600, textDecoration: 'underline' }}>Sign up</Link>
      </p>

      <div style={{ marginTop: 'auto', paddingTop: 30, fontSize: 11, opacity: 0.6, textAlign: 'center' }}>
        Demo accounts — student: miguel@student.edu · manager: manager@library.edu<br />
        Password: password123
      </div>
    </div>
  );
}
