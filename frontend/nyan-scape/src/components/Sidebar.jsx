import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import logoImg from "../assets/logo.png";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  const navLinks = [
    { path: "/fyp", icon: "🏠", label: "FYP" },
    { path: "/explore", icon: "🔍", label: "Explore" },
    { path: "/create-post", icon: "➕", label: "Create Post" },
    { path: "/profile", icon: "👤", label: "My Profile" },
    { path: "/notifications", icon: "🔔", label: "Notifications" },
    { path: "/messages", icon: "💬", label: "Messages" },
    { path: "/settings", icon: "⚙️", label: "Settings" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand" onClick={() => navigate("/fyp")}>
        <img src={logoImg} alt="NyanScape Logo" className="sidebar-logo" />
        <h1 className="sidebar-title">NyanScape</h1>
      </div>

      <nav className="sidebar-nav">
        {navLinks.map((link) => (
          <button
            key={link.path}
            className={`sidebar-link ${isActive(link.path) ? "active" : ""}`}
            onClick={() => navigate(link.path)}
          >
            {link.icon} {link.label}
          </button>
        ))}
      </nav>

      <button className="sidebar-create-btn" onClick={() => navigate("/create-post")}>
        + Create Post
      </button>

      <div className="sidebar-card">
        <img src={logoImg} alt="Cat mascot" />
        <h3>Join NyanScape Community!</h3>
        <p>Share your cat stories, photos, and moments with fellow cat lovers!</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </aside>
  );
}

export default Sidebar;
