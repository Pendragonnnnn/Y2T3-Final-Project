import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import BottomNav from '../components/BottomNav';

export default function ManagerStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/manager/students').then(({ data }) => setStudents(data.students)).finally(() => setLoading(false));
  }, []);

  const filtered = students.filter((s) =>
    s.full_name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="screen">
      <div className="screen-header">
        <h2 className="screen-title">All students</h2>
      </div>

      <div className="field">
        <input placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="text-center mt-24"><div className="spinner" style={{ margin: '0 auto' }} /></div>
      ) : (
        <div className="stack">
          {filtered.map((s) => (
            <div
              key={s.user_id}
              className="card flex-between"
              onClick={() => navigate(`/manager/students/${s.user_id}/history`, { state: { student: s } })}
              style={{ cursor: 'pointer' }}
            >
              <div>
                <p style={{ fontWeight: 600 }}>{s.full_name}</p>
                <p className="text-muted">{s.email}</p>
              </div>
              
            </div>
          ))}
          {filtered.length === 0 && <p className="text-muted text-center mt-16">No students found</p>}
        </div>
      )}

      <BottomNav />
    </div>
  );
}