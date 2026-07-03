import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import BottomNav from '../components/BottomNav';
import s2 from '../assets/s2.png';

const FALLBACK_NOTIFICATIONS = [
    { id: 1, title: 'Message from John', body: 'Hello, nice to meet you...' },
    { id: 2, title: 'System alert', body: 'Your seat has successfully been reserved.' },
    { id: 3, title: 'System alert', body: 'A problem occurred.' },
];

export default function Notification() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

    api.get('/notifications')
        .then(({ data }) => {
        if (!isMounted) return;
        console.log('Notifications loaded:', data);
        setNotifications(Array.isArray(data) ? data : []);
    })
        .catch((err) => {
        if (!isMounted) return;
        console.error('Failed to load notifications:', err);
        setError('Could not load notifications from server. Showing sample data.');
        setNotifications(FALLBACK_NOTIFICATIONS);
        })
        .finally(() => {
        if (isMounted) setLoading(false);
        });

    return () => { isMounted = false; };
    }, []);

    return (
        <div className="screen">
            <div className="notif-page-header">
                <button className="back-btn" aria-label="Go back" onClick={() => navigate(-1)}>
                ← <span className='helo'>back</span>
                </button>
                <h2 className="screen-title">Notifications</h2>
            </div>

            {error && <p className="notif-error">{error}</p>}

            <div className="notif-list">

            <div className="notif-empty" style ={{ display: loading || notifications.length > 0 ? 'none' : 'block', top: '30%' }}>
                <img src={s2} alt='Emoji' />
            </div>

            {loading && <p className="notif-empty">Loading...</p>}

            {!loading && notifications.length === 0 && (
                <p className="notif-empty">No notifications yet.</p>
            )}

            {!loading &&
            notifications.map((n) => (
            <div className="notif-item" key={n.id}>
                <p className="notif-title">{n.title}</p>
                <p className="notif-body">{n.body || n.message}</p>
            </div>
            ))}
            </div>

        <BottomNav />
        </div>
    );
}