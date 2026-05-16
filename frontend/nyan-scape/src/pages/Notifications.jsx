import React, { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../App.css";

function Notifications({ session }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState([
    { id: 1, type: "likes", user: "WhiskerMom", message: "liked your post.", time: "2 minutes ago", unread: true },
    { id: 2, type: "comments", user: "PawHunter", message: "commented: \"So adorable! 😻\"", time: "5 minutes ago", unread: true },
    { id: 3, type: "follows", user: "MeowMagic", message: "started following you.", time: "10 minutes ago", unread: true },
    { id: 4, type: "shares", user: "PurrfectShots", message: "shared your post.", time: "15 minutes ago", unread: false },
    { id: 5, type: "likes", user: "FluffyPaws", message: "liked your post.", time: "1 hour ago", unread: false },
    { id: 6, type: "comments", user: "TheCatDaily", message: "commented: \"What a cutie! ❤️\"", time: "2 hours ago", unread: false },
  ]);

  const filters = [
    { key: "all", label: "All", icon: "🔔" },
    { key: "likes", label: "Likes", icon: "♡" },
    { key: "comments", label: "Comments", icon: "💬" },
    { key: "follows", label: "Follows", icon: "👤" },
    { key: "shares", label: "Shares", icon: "↗" },
  ];

  const filtered = useMemo(() => {
    let result = notifications;
    if (activeFilter !== "all") result = result.filter((n) => n.type === activeFilter);
    if (search.trim()) result = result.filter((n) =>
      `${n.user} ${n.message}`.toLowerCase().includes(search.toLowerCase()));
    return result;
  }, [notifications, activeFilter, search]);

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="page-main">
        <div className="page-topbar">
          <input type="text" placeholder="Search notifications..." value={search}
            onChange={(e) => setSearch(e.target.value)} />
        </div>
        <header className="page-header">
          <h2>Notifications 🔔</h2>
          <p>Stay updated with your NyanScape world! 🐾</p>
        </header>
        <div className="notif-filters">
          {filters.map((f) => (
            <button key={f.key} className={activeFilter === f.key ? "active" : ""}
              onClick={() => setActiveFilter(f.key)}>{f.icon} {f.label}</button>
          ))}
        </div>
        <div className="notif-list">
          {filtered.length === 0 ? (
            <div className="notif-empty"><h3>No notifications 🐾</h3></div>
          ) : filtered.map((n) => (
            <article key={n.id} className={`notif-item ${n.unread ? "unread" : ""}`}>
              <div style={{ fontSize: "2rem" }}>🐱</div>
              <div className="notif-content">
                <p><strong>{n.user}</strong> {n.message}</p>
                <span>{n.time}</span>
              </div>
              {n.unread && <span className="unread-dot"></span>}
              <button className="delete-notif"
                onClick={() => setNotifications(prev => prev.filter((x) => x.id !== n.id))}>×</button>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Notifications;
