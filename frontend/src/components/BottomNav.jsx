import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import s1 from '../assets/s1.png';
import s3 from '../assets/s3.png';

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

  const logoImage = s1;

  return (
    <nav className="bottom-nav">
      <div style={{ marginBottom: 18 }}>
        <div className='logo-nav' style={{ width: 'auto',  }}>
            <img src={logoImage} alt="Logo" className='logo' style={{ width: '80px', height: '50px' }} />
            
          </div>
        <div className='logo-name-nav' style={{ color: 'black', fontFamily: 'sans' }}>Pocket Library</div>
      </div>
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end || false}
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          <span className="nav-icon">{tab.icon}</span>
          <span>{tab.label}</span>
        </NavLink>
      ))}
      
      <div 
        className="logout-item" 
        role="button" 
        tabIndex={0} 
        onClick={handleLogout} 
        onKeyDown={e => { if (e.key === 'Enter') handleLogout(); }}
      >
        <span className="nav-icon">]➜</span>
        <span>Log out</span>
      </div>
    </nav>
  );
}