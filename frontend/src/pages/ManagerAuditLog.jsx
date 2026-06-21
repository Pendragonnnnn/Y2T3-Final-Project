import { useEffect, useState } from 'react';
import api from '../services/api';
import BottomNav from '../components/BottomNav';

export default function ManagerAuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/manager/audit-log').then(({ data }) => setLogs(data.logs)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="screen">
      <div className="screen-header">
        <h2 className="screen-title">Audit log</h2>
      </div>

      {loading ? (
        <div className="text-center mt-24"><div className="spinner" style={{ margin: '0 auto' }} /></div>
      ) : (
        <div className="stack">
          {logs.map((log) => (
            <div key={log.log_id} className="card">
              <div className="flex-between">
                <p style={{ fontWeight: 600, fontSize: 13 }}>{log.action_taken.replace(/_/g, ' ')}</p>
                <p className="text-muted" style={{ fontSize: 11 }}>{new Date(log.timestamp).toLocaleString()}</p>
              </div>
              <p className="text-muted mt-8">By {log.performer_name}{log.target_id ? ` · target #${log.target_id}` : ''}</p>
            </div>
          ))}
          {logs.length === 0 && <p className="text-muted text-center mt-16">No activity recorded yet</p>}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
