import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import s1 from '../assets/s1.png';
import person from '../assets/person.svg';
import closeEye from '../assets/closeEye.png';
import openEye from '../assets/open_eye.png';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        background: 'linear-gradient(160deg,rgba(209, 226, 243, 1) 7%,rgba(204, 222, 241, 1) 10%,rgba(0, 62, 195, 1) 100%',
        color: 'white',
        justifyContent: 'center',
        paddingBottom: 20,
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        
        <div className='logo-container'>
          <img src={s1} alt="Logo" className='logo' />
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Library Seat Finder</h1>
        <p style={{ opacity: 0.8, fontSize: 13, marginTop: 4 }}>Reserve your study space in seconds</p>
      </div>


      <form onSubmit={handleSubmit} className="stack">

        {/* Email */}
        <div
          className="field"
          style={{
            marginBottom: 15,
            position: "relative",
          }}
        >
          <label style={{color: 'white'}}>Email</label>
          <input
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ background: 'rgba(255, 255, 255, 0.12)', border: '1.5px solid rgba(255,255,255,0.25)', color: 'white' }}
          />
        </div>

        {/* Password */}
        <div
          className="field"
          style={{
            marginBottom: 15,
            position: "relative",
          }}
        >
          <label style={{color: 'white'}} >Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              background: 'white',
              border: '1.5px solid rgba(255,255,255,0.25)',
              color: 'silver',
              width: '100%',
              paddingRight: '45px',
            }}
          />

          <img
            src={showPassword ? openEye : closeEye}
            alt="Toggle Password"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '15px',
              top: '65%',
              transform: 'translateY(-50%)',
              width: 20,
              height: 20,
              cursor: 'pointer',
            }}
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
