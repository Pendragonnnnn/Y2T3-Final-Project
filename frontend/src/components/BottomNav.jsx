import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const STUDENT_TABS = [
  { to: '/home', icon: '🏠︎', label: 'Home' },
  { to: '/map', icon: '🕮', label: 'Library Map' },
  { to: '/reservations', icon: '✧', label: 'Reservation' },
  { to: '/profile', icon: '☺', label: 'Profile' },
];

const MANAGER_TABS = [
  { to: '/manager', icon: '🖳', label: 'Reservations' },
  { to: '/manager/students', icon: '⫶☰', label: 'Students' },
  { to: '/manager/map', icon: '❒', label: 'Map' },
  { to: '/manager/report', icon: '◔', label: 'Analytics' },
  { to: '/profile', icon: '☺', label: 'Profile' },
];

export default function BottomNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const tabs = user?.role?.toLowerCase() === 'manager' ? MANAGER_TABS : STUDENT_TABS;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          <span className="nav-icon">{tab.icon}</span>
          <span>{tab.label}</span>
        </NavLink>
      ))}

      {/* Logout button for desktop sidebar */}
      <div className="logout-item" role="button" tabIndex={0} onClick={handleLogout} onKeyDown={e => { if (e.key === 'Enter') handleLogout(); }}>
        <span className="nav-icon">]➜</span>
        <span>Log out</span>
      </div>
    </nav>
  );
}
