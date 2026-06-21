import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const STUDENT_TABS = [
  { to: '/home', icon: '⌂', label: 'Home' },
  { to: '/map', icon: '▦', label: 'Seat Map' },
  { to: '/reservations', icon: '☰', label: 'Reservations' },
  { to: '/profile', icon: '☺', label: 'Profile' },
];

const MANAGER_TABS = [
  { to: '/manager', icon: '⌂', label: 'Dashboard' },
  { to: '/manager/students', icon: '☺', label: 'Students' },
  { to: '/manager/report', icon: '◔', label: 'Report' },
];

export default function BottomNav() {
  const { user } = useAuth();
  const tabs = user?.role?.toLowerCase() === 'manager' ? MANAGER_TABS : STUDENT_TABS;

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
    </nav>
  );
}
