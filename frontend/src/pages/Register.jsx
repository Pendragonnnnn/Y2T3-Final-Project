import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import closeEye from "../assets/closeEye.png";
import openEye from "../assets/open_eye.png";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="screen" style={{ justifyContent: 'center', background: 'white' }}>
      <div className="screen-header">
        <h2 className="screen-title">Create account</h2>
      </div>

      <form onSubmit={handleSubmit} className="stack">
        <div className="field">
          <label>Full name</label>
          <input value={form.fullName} onChange={update('fullName')} required placeholder="e.g. Miguel Santos" />
        </div>
        <div className="field">
          <label>Email</label>
          <input type="email" value={form.email} onChange={update('email')} required placeholder="you@student.edu" />
        </div>
        <div
  className="field"
  style={{ position: "relative" }}
>
  <label>Password</label>

  <input
    type={showPassword ? "text" : "password"}
    value={form.password}
    onChange={update("password")}
    placeholder="Password"
    required
    minLength={6}
    style={{
      width: "100%",
      paddingRight: "45px",
    }}
  />

  <img
    src={showPassword ? openEye : closeEye}
    alt="Toggle Password"
    onClick={() => setShowPassword(!showPassword)}
    style={{
      position: "absolute",
      right: "15px",
      top: "70%",
      transform: "translateY(-50%)",
      width: 20,
      height: 20,
      cursor: "pointer",
    }}
  />
</div>
        <div className="field">
          <label>Role</label>
          <select value={form.role} onChange={update('role')}>
            <option value="student">Student</option>
            <option value="manager">Library Manager</option>
          </select>
        </div>

        {error && <p style={{ color: 'var(--color-danger)', fontSize: 13 }}>{error}</p>}

        <Button type="submit" loading={loading}>Sign up</Button>
      </form>

      <p className="text-center text-muted mt-16">
        Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Log in</Link>
      </p>
    </div>
  );
}
