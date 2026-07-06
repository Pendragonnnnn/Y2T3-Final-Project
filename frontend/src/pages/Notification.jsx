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
      return `${mins} mn${mins > 1 ? "s" : ""} ago`;
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

      {/* Header */}
      <div className="notif-page-header">
        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        > ← Back
        </button>
        <h2 className="screen-title"> Notifications </h2>
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
          {notifications.map((item) => (
            <div
              key={item.notification_id}
              className={`notif-item ${
                item.is_read ? "" : "unread"
              }`}
              onClick={() =>
                markAsRead(item.notification_id)
              }
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }} >
                <h4 style={{ margin: 0 }}>
                  {item.title}
                </h4>

                {!item.is_read && (
                  <span style={{ color: "red", fontWeight: "bold"}} >
                    ●
                  </span>
                )}
                
              </div>

              {item.seat_id && (
                <p>
                  <strong>Seat:</strong> {item.seat_id}
                </p>
              )}
              {item.reservation_id && (
                <p>
                  <strong>Reservation:</strong> #
                  {item.reservation_id}
                </p>
              )}
              
              <hr />
              <p style={{fontSize: 13}}>{item.message_body}</p>

              <p
                title={new Date(
                  item.created_at
                ).toLocaleString()}
                style={{
                  color: "#161313",
                  fontSize: 13,
                  marginTop: 10,
                  position: "relative",
                  right: -145,
                }}
              >
                {formatTime(item.created_at)}
              </p>
            </div>
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
}