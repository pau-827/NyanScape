import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import logoImg from "../assets/logo.png";

function Notifications({ session }) {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [notifications, setNotifications] = useState([
    { id: 1, type: "likes", user: "WhiskerMom", message: "liked your post.", detail: "", time: "2 minutes ago", unread: true },
    { id: 2, type: "comments", user: "PawHunter", message: "commented on your post:", detail: "So adorable! 😻", time: "5 minutes ago", unread: true },
    { id: 3, type: "follows", user: "MeowMagic", message: "started following you.", detail: "", time: "10 minutes ago", unread: true },
    { id: 4, type: "shares", user: "PurrfectShots", message: "shared your post.", detail: "", time: "15 minutes ago", unread: true },
    { id: 5, type: "mentions", user: "CatLover_23", message: "mentioned you in a comment.", detail: "@CatLover_23 check this out!", time: "20 minutes ago", unread: true },
    { id: 6, type: "likes", user: "FluffyPaws", message: "liked your post.", detail: "", time: "1 hour ago", unread: false },
    { id: 7, type: "comments", user: "TheCatDaily", message: "commented on your post:", detail: "What a cutie! ❤️", time: "2 hours ago", unread: false },
    { id: 8, type: "follows", user: "MeowWorld", message: "started following you.", detail: "", time: "3 hours ago", unread: false },
  ]);

  const filters = [
    { key: "all", label: "All", icon: "🔔" },
    { key: "likes", label: "Likes", icon: "♡" },
    { key: "comments", label: "Comments", icon: "💬" },
    { key: "follows", label: "Follows", icon: "👤" },
    { key: "mentions", label: "Mentions", icon: "@" },
    { key: "shares", label: "Shares", icon: "↗" },
  ];

  const filteredNotifications = useMemo(() => {
    let result = notifications;
    if (activeFilter !== "all") result = result.filter((item) => item.type === activeFilter);
    if (search.trim()) result = result.filter((item) =>
      `${item.user} ${item.message} ${item.detail}`.toLowerCase().includes(search.toLowerCase())
    );
    return result;
  }, [notifications, activeFilter, search]);

  const perPage = 5;
  const totalPages = Math.ceil(filteredNotifications.length / perPage) || 1;
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * perPage, currentPage * perPage
  );

  const todayStats = {
    likes: notifications.filter((n) => n.type === "likes").length,
    comments: notifications.filter((n) => n.type === "comments").length,
    follows: notifications.filter((n) => n.type === "follows").length,
    shares: notifications.filter((n) => n.type === "shares").length,
  };

  function markAllAsRead() {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  }

  function deleteNotification(id) {
    if (!window.confirm("Remove this notification?")) return;
    setNotifications(notifications.filter((n) => n.id !== id));
  }

  function getNotificationIcon(type) {
    if (type === "likes") return "💜";
    if (type === "comments") return "💬";
    if (type === "follows") return "👤";
    if (type === "mentions") return "@";
    if (type === "shares") return "↗";
    return "🔔";
  }

  return (
    <div className="notifications-page">
      <aside className="notif-sidebar">
        <div className="notif-brand" onClick={() => navigate("/fyp")}>
          <img src={logoImg} alt="NyanScape Logo" />
          <h1>NyanScape</h1>
        </div>
        <button onClick={() => navigate("/fyp")}>🏠 FYP</button>
        <button onClick={() => navigate("/explore")}>🔍 Explore</button>
        <button onClick={() => navigate("/create-post")}>➕ Create Post</button>
        <button onClick={() => navigate("/profile")}>👤 My Profile</button>
        <button className="active">🔔 Notifications <span>{notifications.filter((n) => n.unread).length}</span></button>
        <button onClick={() => navigate("/messages")}>💬 Messages</button>
        <button onClick={() => navigate("/settings")}>⚙️ Settings</button>
        <div className="notif-join-card">
          <img src={logoImg} alt="Mascot" />
          <h3>Join NyanScape Community!</h3>
          <p>Share your cat stories, photos, and moments with fellow cat lovers!</p>
        </div>
      </aside>

      <main className="notif-main">
        <div className="notif-topbar">
          <input type="text" placeholder="Search notifications..." value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} />
          <strong>{session?.user?.email?.split("@")[0] || "You"}</strong>
        </div>

        <header className="notif-header">
          <div>
            <h2>Notifications 🔔</h2>
            <p>Stay updated with everything happening in your NyanScape world! 🐾</p>
          </div>
          <button onClick={markAllAsRead}>Mark all as read</button>
        </header>

        <div className="notif-filters">
          {filters.map((filter) => (
            <button key={filter.key} className={activeFilter === filter.key ? "active" : ""}
              onClick={() => { setActiveFilter(filter.key); setCurrentPage(1); }}>
              {filter.icon} {filter.label}
            </button>
          ))}
        </div>

        <section className="notif-list-section">
          <h3>{currentPage === 1 ? "Recent" : "Earlier"}</h3>
          {paginatedNotifications.length === 0 ? (
            <div className="notif-empty">
              <h3>No notifications found 🐾</h3>
              <p>Try another filter or search term.</p>
            </div>
          ) : (
            <div className="notif-list">
              {paginatedNotifications.map((notification) => (
                <article className={`notif-item ${notification.unread ? "unread" : ""}`} key={notification.id}>
                  <div className="notif-avatar" style={{ fontSize: "2rem", display: "flex", alignItems: "center", justifyContent: "center" }}>🐱</div>
                  <div className="notif-content">
                    <p><strong>{notification.user}</strong> {notification.message}</p>
                    {notification.detail && <p className="notif-detail">"{notification.detail}"</p>}
                    <span>{notification.time}</span>
                  </div>
                  <span style={{ fontSize: "1.2rem" }}>{getNotificationIcon(notification.type)}</span>
                  {notification.unread && <span className="unread-dot"></span>}
                  <button className="delete-notif" onClick={() => deleteNotification(notification.id)}>×</button>
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>‹</button>
          {[...Array(totalPages)].map((_, index) => (
            <button key={index + 1} className={currentPage === index + 1 ? "active" : ""}
              onClick={() => setCurrentPage(index + 1)}>{index + 1}</button>
          ))}
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>›</button>
        </div>
      </main>

      <aside className="notif-right">
        <div className="notif-right-card">
          <h3>📈 Today's Highlights</h3>
          <div className="highlight-row"><span>♡</span><strong>{todayStats.likes}</strong><p>Likes</p></div>
          <div className="highlight-row"><span>💬</span><strong>{todayStats.comments}</strong><p>Comments</p></div>
          <div className="highlight-row"><span>👤</span><strong>{todayStats.follows}</strong><p>New Followers</p></div>
          <div className="highlight-row"><span>↗</span><strong>{todayStats.shares}</strong><p>Shares</p></div>
        </div>
        <div className="notif-right-card quote-card">
          <h3>💬 Purrspiration</h3>
          <p>"A happy cat makes for a happy human."</p>
        </div>
      </aside>
    </div>
  );
}

export default Notifications;
