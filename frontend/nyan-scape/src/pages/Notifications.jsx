import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Notifications.css";

function Notifications() {
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState({
    push: true,
    email: false,
    likes: true,
    comments: true,
    follows: true,
    mentions: true,
    shares: true,
  });

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "likes",
      user: "WhiskerMom",
      message: "liked your post.",
      detail: "",
      time: "2 minutes ago",
      avatar: "/cat.webp",
      image: "/luna.webp",
      unread: true,
    },
    {
      id: 2,
      type: "comments",
      user: "PawHunter",
      message: "commented on your post:",
      detail: "So adorable! 😻",
      time: "5 minutes ago",
      avatar: "/luna.webp",
      image: "/cat.webp",
      unread: true,
    },
    {
      id: 3,
      type: "follows",
      user: "MeowMagic",
      message: "started following you.",
      detail: "",
      time: "10 minutes ago",
      avatar: "/play.jpg",
      image: null,
      unread: true,
    },
    {
      id: 4,
      type: "shares",
      user: "PurrfectShots",
      message: "shared your post.",
      detail: "",
      time: "15 minutes ago",
      avatar: "/cat.webp",
      image: "/play.jpg",
      unread: true,
    },
    {
      id: 5,
      type: "mentions",
      user: "CatLover_23",
      message: "mentioned you in a comment.",
      detail: "@CatLover_23 check this out!",
      time: "20 minutes ago",
      avatar: "/luna.webp",
      image: "/cat.webp",
      unread: true,
    },
    {
      id: 6,
      type: "likes",
      user: "FluffyPaws",
      message: "liked your post.",
      detail: "",
      time: "1 hour ago",
      avatar: "/play.jpg",
      image: "/luna.webp",
      unread: false,
    },
    {
      id: 7,
      type: "comments",
      user: "TheCatDaily",
      message: "commented on your post:",
      detail: "What a cutie! ❤️",
      time: "2 hours ago",
      avatar: "/cat.webp",
      image: "/play.jpg",
      unread: false,
    },
    {
      id: 8,
      type: "follows",
      user: "MeowWorld",
      message: "started following you.",
      detail: "",
      time: "3 hours ago",
      avatar: "/luna.webp",
      image: null,
      unread: false,
    },
    {
      id: 9,
      type: "likes",
      user: "KittyChronicles",
      message: "liked your comment.",
      detail: "",
      time: "5 hours ago",
      avatar: "/play.jpg",
      image: "/cat.webp",
      unread: false,
    },
    {
      id: 10,
      type: "shares",
      user: "CatLover_23",
      message: "shared your post.",
      detail: "",
      time: "1 day ago",
      avatar: "/cat.webp",
      image: "/luna.webp",
      unread: false,
    },
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

    if (activeFilter !== "all") {
      result = result.filter((item) => item.type === activeFilter);
    }

    if (search.trim()) {
      result = result.filter((item) => {
        const text = `${item.user} ${item.message} ${item.detail}`.toLowerCase();
        return text.includes(search.toLowerCase());
      });
    }

    return result;
  }, [notifications, activeFilter, search]);

  const perPage = 5;
  const totalPages = Math.ceil(filteredNotifications.length / perPage) || 1;
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const todayStats = {
    likes: notifications.filter((item) => item.type === "likes").length,
    comments: notifications.filter((item) => item.type === "comments").length,
    follows: notifications.filter((item) => item.type === "follows").length,
    shares: notifications.filter((item) => item.type === "shares").length,
  };

  function markAllAsRead() {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  }

  function markOneAsRead(id) {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, unread: false } : notification
      )
    );
  }

  function deleteNotification(id) {
    const confirmDelete = window.confirm("Remove this notification?");
    if (!confirmDelete) return;

    setNotifications(notifications.filter((notification) => notification.id !== id));
  }

  function followBack(user) {
    if (followedUsers.includes(user)) {
      setFollowedUsers(followedUsers.filter((item) => item !== user));
    } else {
      setFollowedUsers([...followedUsers, user]);
    }
  }

  function openNotification(notification) {
    markOneAsRead(notification.id);

    if (notification.type === "follows") {
      navigate("/profile");
      return;
    }

    alert(`${notification.user} ${notification.message} ${notification.detail}`);
  }

  function toggleSetting(key) {
    setSettingsOpen({
      ...settingsOpen,
      [key]: !settingsOpen[key],
    });
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
          <img src="/logo.png" alt="NyanScape Logo" />
          <h1>NyanScape</h1>
        </div>

        <button onClick={() => navigate("/fyp")}>🏠 FYP</button>
        <button onClick={() => navigate("/explore")}>🔍 Explore</button>
        <button onClick={() => navigate("/create-post")}>➕ Create Post</button>
        <button onClick={() => alert("Bookmarks opened!")}>🔖 Bookmarks</button>
        <button onClick={() => navigate("/profile")}>👤 My Profile</button>
        <button className="active">
          🔔 Notifications <span>{notifications.filter((item) => item.unread).length}</span>
        </button>
        <button onClick={() => alert("Messages coming soon!")}>💬 Messages</button>
        <button onClick={() => alert("Settings coming soon!")}>⚙️ Settings</button>

        <button className="invite-btn" onClick={() => alert("Invite link copied!")}>
          🐾 Invite Friends
        </button>

        <div className="notif-join-card">
          <img src="/logo.png" alt="Mascot" />
          <h3>Join NyanScape Community!</h3>
          <p>Share your cat stories, photos, and moments with fellow cat lovers!</p>
          <button onClick={() => alert("Invite link copied!")}>Invite Friends</button>
        </div>
      </aside>

      <main className="notif-main">
        <div className="notif-topbar">
          <input
            type="text"
            placeholder="Search cats, users, or tags..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
          <button onClick={() => alert("Notifications refreshed!")}>🔔</button>
          <img src="/cat.webp" alt="User avatar" />
          <strong>CatLover_23</strong>
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
            <button
              key={filter.key}
              className={activeFilter === filter.key ? "active" : ""}
              onClick={() => {
                setActiveFilter(filter.key);
                setCurrentPage(1);
              }}
            >
              {filter.icon} {filter.label}
            </button>
          ))}
        </div>

        <section className="notif-list-section">
          <h3>{currentPage === 1 ? "New" : "Earlier"}</h3>

          {paginatedNotifications.length === 0 ? (
            <div className="notif-empty">
              <h3>No notifications found 🐾</h3>
              <p>Try another filter or search term.</p>
            </div>
          ) : (
            <div className="notif-list">
              {paginatedNotifications.map((notification) => (
                <article
                  className={`notif-item ${notification.unread ? "unread" : ""}`}
                  key={notification.id}
                >
                  <img
                    src={notification.avatar}
                    alt={notification.user}
                    className="notif-avatar"
                    onClick={() => navigate("/profile")}
                  />

                  <div
                    className="notif-content"
                    onClick={() => openNotification(notification)}
                  >
                    <p>
                      <strong>{notification.user}</strong> {notification.message}
                    </p>

                    {notification.detail && <p className="notif-detail">“{notification.detail}”</p>}

                    <span>{notification.time}</span>
                  </div>

                  {notification.type === "follows" ? (
                    <button
                      className="follow-back"
                      onClick={() => followBack(notification.user)}
                    >
                      {followedUsers.includes(notification.user)
                        ? "Following"
                        : "Follow back"}
                    </button>
                  ) : notification.image ? (
                    <div className="notif-post-preview">
                      <img
                        src={notification.image}
                        alt="Post preview"
                        onClick={() => openNotification(notification)}
                      />
                      <span>{getNotificationIcon(notification.type)}</span>
                    </div>
                  ) : null}

                  {notification.unread && <span className="unread-dot"></span>}

                  <button
                    className="delete-notif"
                    onClick={() => deleteNotification(notification.id)}
                  >
                    ×
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            ‹
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              className={currentPage === index + 1 ? "active" : ""}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            ›
          </button>
        </div>
      </main>

      <aside className="notif-right">
        <div className="notif-right-card">
          <h3>⚙️ Notification Settings</h3>

          {[
            ["push", "🔔 Push Notifications"],
            ["email", "✉️ Email Notifications"],
            ["likes", "♡ Like Notifications"],
            ["comments", "💬 Comment Notifications"],
            ["follows", "👤 Follow Notifications"],
            ["mentions", "@ Mention Notifications"],
            ["shares", "↗ Share Notifications"],
          ].map(([key, label]) => (
            <button key={key} onClick={() => toggleSetting(key)}>
              <span>{label}</span>
              <strong>{settingsOpen[key] ? "On" : "Off"}</strong>
            </button>
          ))}
        </div>

        <div className="notif-right-card">
          <h3>📈 Today&apos;s Highlights</h3>

          <div className="highlight-row">
            <span>♡</span>
            <strong>{todayStats.likes}</strong>
            <p>Likes</p>
          </div>

          <div className="highlight-row">
            <span>💬</span>
            <strong>{todayStats.comments}</strong>
            <p>Comments</p>
          </div>

          <div className="highlight-row">
            <span>👤</span>
            <strong>{todayStats.follows}</strong>
            <p>New Followers</p>
          </div>

          <div className="highlight-row">
            <span>↗</span>
            <strong>{todayStats.shares}</strong>
            <p>Shares</p>
          </div>
        </div>

        <div className="notif-right-card quote-card">
          <h3>💬 Purrspiration</h3>
          <p>“A happy cat makes for a happy human.”</p>
          <img src="/logo.png" alt="Cat" />
        </div>
      </aside>
    </div>
  );
}

export default Notifications;