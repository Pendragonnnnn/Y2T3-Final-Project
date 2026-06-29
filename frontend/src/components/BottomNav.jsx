import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const STUDENT_TABS = [
  { to: '/home', icon: '🏠︎', label: 'Home' },
  { to: '/map', icon: '🕮', label: 'Library Map' },
  { to: '/reservations', icon: '✧', label: 'Reservation' },
  { to: '/profile', icon: '☺', label: 'Profile' },
];

const MANAGER_TABS = [
  { to: '/manager', icon: '🖳', label: 'Dashboard' },
  { to: '/manager/students', icon: '☺', label: 'Students' },
  { to: '/manager/report', icon: '◔', label: 'Report' },
  { to: '/profile', icon: '☺', label: 'Profile' },
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
