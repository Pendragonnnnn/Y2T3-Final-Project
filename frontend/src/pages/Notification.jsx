import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import BottomNav from "../components/BottomNav";
import s2 from "../assets/s2.png";

export default function Notification() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("sl_user"));

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // Relative Time
  // =========================
  const formatTime = (date) => {
    const now = new Date();
    const created = new Date(date);

    const diff = Math.floor((now - created) / 1000);

    if (diff < 60) return "Just now";

    if (diff < 3600) {
      const mins = Math.floor(diff / 60);
      return `${mins} min${mins > 1 ? "s" : ""} ago`;
    }

    if (diff < 86400) {
      const hours = Math.floor(diff / 3600);
      return `${hours} h${hours > 1 ? "s" : ""} ago`;
    }

    if (diff < 172800) {
      return "Yesterday";
    }

    return created.toLocaleDateString();
  };

  const formatDateHeading = (isoDate) => {
    const d = new Date(isoDate);
    const day = String(d.getDate()).padStart(2, '0');
    const month = d.toLocaleString(undefined, { month: 'short' }).toUpperCase();
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const groupByDate = (items) => {
    return items.reduce((acc, it) => {
      const key = new Date(it.created_at).toISOString().slice(0, 10);
      if (!acc[key]) acc[key] = [];
      acc[key].push(it);
      return acc;
    }, {});
  };

  const formatTimeOnly = (date) => {
    try {
      return new Date(date).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  // =========================
  // Load Notifications
  // =========================
  const fetchNotifications = async () => {
    try {
      if (!user) {
        setError("User not found.");
        setLoading(false);
        return;
      }

      const { data } = await api.get(`/notifications/${user.userId}`);

      if (Array.isArray(data)) {
        setNotifications(data);
      } else if (Array.isArray(data.notifications)) {
        setNotifications(data.notifications);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // =========================
  // Mark One as Read
  // =========================
  const markAsRead = async (notificationId) => {
    const selected = notifications.find(
      (n) => n.notification_id === notificationId
    );

    if (selected?.is_read) return;

    try {
      await api.put(
        `/notifications/${user.userId}/read/${notificationId}`
      );

      setNotifications((prev) =>
        prev.map((n) =>
          n.notification_id === notificationId
            ? { ...n, is_read: true }
            : n
        )
      );

      // Tell Home.jsx to refresh badge
      window.dispatchEvent(new Event("notificationUpdated"));
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // Mark All
  // =========================
  const markAllAsRead = async () => {
    try {
      await api.put(`/notifications/${user.userId}/read-all`);

      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          is_read: true,
        }))
      );

      window.dispatchEvent(new Event("notificationUpdated"));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="screen">

      <div className="faq-screen-header">
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 18,
            cursor: 'pointer',
            padding: 0,
            lineHeight: 2,
            alignSelf: 'flex-start',
            color: 'var(--color-primary)',
          }}
          aria-label="Go back"
        >
          く
        </button>

        <h2 className="screen-title">Notifications</h2>

        <div style={{ width: 22 }} />
      </div>

      {/* Mark All Button */}
      {!loading && notifications.length > 0 && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 15}} >

          <button onClick={markAllAsRead} style={{ padding: "8px 14px", border: "none", borderRadius: 8, background: "#0d6efd", color: "#fff", cursor: "pointer"}}>
            Mark all as read
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <p style={{ color: "red", textAlign: "center", marginTop: 20}}>
          {error}
        </p>
      )}

      {/* Loading */}
      {loading && (
        <p style={{ textAlign: "center", marginTop: 40}}>
          Loading...
        </p>
      )}

      {/* Empty */}
      {!loading && notifications.length === 0 && (
        <div className="notif-empty" style={{ textAlign: "center", marginTop: 80 }}>
          <img src={s2} alt="No Notification" width={180}/>
          <h3>No Notifications</h3>
          <p>You don't have any notifications yet.</p>
        </div>
      )}

      {/* Notification List */}
      {!loading && notifications.length > 0 && (
        <div className="notif-list">
          {(() => {
            const grouped = groupByDate(notifications);
            const keys = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));
            return keys.map((dateKey) => (
              <div key={dateKey} className="notif-date-section">
                <div className="notif-date-heading">{formatDateHeading(dateKey)}</div>
                {grouped[dateKey].map((item) => (
                  <div
                    key={item.notification_id}
                    className={`notif-item ${item.is_read ? 'read' : 'unread'}`}
                    onClick={() => markAsRead(item.notification_id)}
                  >
                    <div className="notif-item-header">
                      <div className="notif-item-title-group">
                        <h4 style={{ margin: 0 }}>{item.title}</h4>

                        {!item.is_read && (
                          <span className="notif-unread-dot">●</span>
                        )}
                      </div>

                      <span className="notif-time" title={new Date(item.created_at).toLocaleString()}>
                        {formatTimeOnly(item.created_at)}
                      </span>
                    </div>

                    {item.seat_id && (
                      <p>
                        <strong>Seat:</strong> {item.seat_id}
                      </p>
                    )}
                    {item.reservation_id && (
                      <p>
                        <strong>Reservation:</strong> #{item.reservation_id}
                      </p>
                    )}
                    
                    <hr />
                    <p style={{fontSize: 13}}>{item.message_body}</p>

                  </div>
                ))}
              </div>
            ));
          })()}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
