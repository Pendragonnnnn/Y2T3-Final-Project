import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import Button from '../components/Button';
import Toast from '../components/Toast';
import { useToast } from '../components/useToast';

export default function ManagerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { message, showToast } = useToast();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    api.get('/reservations/active-and-pending')
      .then(({ data }) => setReservations(data.reservations))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleReject = async (id) => {
    setBusyId(id);
    try {
      await api.patch(`/reservations/${id}/reject`);
      showToast('Reservation rejected');
      load();
    } catch (err) {
      showToast(err.response?.data?.error || 'Action failed');
    } finally {
      setBusyId(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="screen">
      <div className="faq-screen-header">
        <div>
          <p className="text-muted">Manager Dashboard</p>
          <h2 className="screen-title">Reservations</h2>
        </div>
        <button onClick={handleLogout} style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Log out</button>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Button variant="outline" size="sm" onClick={() => navigate('/manager/scan')}>Scan QR</Button>
          
        </div>
      </div>

      <div style={{ alignSelf: "center", marginTop: '20px', fontWeight: 800 }}>
        Reservations List
      </div>
      <div className='screen-header' style={{ alignSelf: "center", paddingTop: '0px'}}>__________________________________</div>

      {loading ? (
        <div className="text-center mt-24"><div className="spinner" style={{ margin: '0 auto' }} /></div>
      ) : reservations.length === 0 ? (
        <div className="empty-state">
          <p style={{ fontSize: 32 }}>✓</p>
          <p style={{ fontWeight: 600 }}>All caught up</p>
          <p className="text-muted">No active reservations right now</p>
        </div>
      ) : (
        <div className="stack">
          {reservations.map((r) => {
            const isPending = r.outcome === 'Pending';
            return (
              <div key={r.reservation_id} className="card" style={{ padding: '10px 5px 8px 14px', borderRadius:'2px' }}>
                <div  style={{display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ display:'flex', flexDirection: 'column'}}>
                    <span  style={{ color: '#9a9a9a', fontWeight: '600', fontSize: '10px', marginBottom: '3px'}}>Seat {r.seat_id}</span>
                    <p style={{ fontWeight: 600, fontSize: '18px'}}>{r.full_name}</p>
                    <p className="text-muted" style={{ fontSize: '10px' }}>{r.email}</p>
                  </div>
                  <div style={{ alignSelf: 'flex-start', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, paddingRight: 12 }}>
                    <span style={{ borderRadius: '4px', padding: "4px 22px", fontSize: '10px' }}  className={`badge-manager ${isPending ? 'badge-pending' : 'badge-accepted'}`}>
                      {isPending ? 'Pending' : 'Active'}
                    </span>
                    {isPending && (
                      <button
                        className='mt-8 btn-primary reject-action-btn'
                        style={{ borderRadius: "20px", padding: '6px 10px', background: '#d30707', fontSize: '10px'}}
                        
                        onClick={() => handleReject(r.reservation_id)}
                        loading={busyId === r.reservation_id}
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Toast message={message} />
      <BottomNav />
    </div>
  );
}