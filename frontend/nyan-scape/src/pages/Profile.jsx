import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { getPosts, deletePost } from "../lib/api";
import "../App.css";
import logoImg from "../assets/logo.png";
import cover from "../assets/cover.jpg";

function Profile({ session }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("posts");
  const [selectedImage, setSelectedImage] = useState(null);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchMyPosts();
  }, [session]);

  async function fetchProfile() {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();
    if (!error) setProfile(data);
  }

  async function fetchMyPosts() {
    try {
      const res = await getPosts();
      const mine = res.data.filter((p) => p.user_id === session.user.id);
      setPosts(mine);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletePost(id) {
    if (!window.confirm("Delete this post?")) return;
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  async function handleEditProfile() {
    const newName = window.prompt("Enter your display name:", profile?.username || "");
    const newBio = window.prompt("Enter your bio:", profile?.bio || "");
    if (!newName) return;
    const { error } = await supabase
      .from("profiles")
      .update({ username: newName, bio: newBio })
      .eq("id", session.user.id);
    if (!error) setProfile((prev) => ({ ...prev, username: newName, bio: newBio }));
  }

  const displayedPosts = activeTab === "posts" ? posts : [];

  return (
    <div className="profile-page">
      <aside className="profile-sidebar">
        <div className="profile-brand" onClick={() => navigate("/fyp")}>
          <img src={logoImg} alt="NyanScape Logo" />
          <h1>NyanScape</h1>
        </div>
        <button onClick={() => navigate("/fyp")}>🏠 FYP</button>
        <button onClick={() => navigate("/explore")}>🔍 Explore</button>
        <button onClick={() => navigate("/create-post")}>➕ Create Post</button>
        <button className="active">👤 My Profile</button>
        <button onClick={() => navigate("/notifications")}>🔔 Notifications</button>
        <button onClick={() => navigate("/messages")}>💬 Messages</button>
        <button onClick={() => navigate("/settings")}>⚙️ Settings</button>
        <div className="profile-join-card">
          <img src={logoImg} alt="Mascot" />
          <h3>Join NyanScape Community!</h3>
          <p>Share your cat stories, photos, and moments with fellow cat lovers!</p>
          <button onClick={async () => { await supabase.auth.signOut(); navigate("/login"); }}>Logout</button>
        </div>
      </aside>

      <main className="profile-main">
        <div className="profile-topbar">
          <input type="text" placeholder="Search cats, users, or tags..." />
          <strong>{profile?.username || "..."}</strong>
        </div>

        <section className="profile-card">
          <div className="cover-photo">
            <img src={cover} alt="Cover" />
          </div>

          <div className="profile-info">
            <div className="profile-avatar-wrap">
              <div className="profile-avatar-placeholder">🐱</div>
            </div>
            <div className="profile-text">
              <h2>{profile?.username || "Loading..."}</h2>
              <p className="handle">@{profile?.username?.toLowerCase().replace(/\s/g, "") || ""}</p>
              <span className="badge">Cat Enthusiast 🐱</span>
              <p className="bio">{profile?.bio || "No bio yet."}</p>
              <div className="stats">
                <div><strong>{posts.length}</strong><span>Posts</span></div>
                <div><strong>0</strong><span>Followers</span></div>
                <div><strong>0</strong><span>Following</span></div>
              </div>
            </div>
            <button className="edit-profile-btn" onClick={handleEditProfile}>
              👤 Edit Profile
            </button>
          </div>

          <div className="profile-tabs">
            <button className={activeTab === "posts" ? "active" : ""} onClick={() => setActiveTab("posts")}>▦ Posts</button>
          </div>
        </section>

        <section className="profile-post-grid">
          {loading ? (
            <div className="profile-empty"><h3>Loading... 🐱</h3></div>
          ) : displayedPosts.length === 0 ? (
            <div className="profile-empty">
              <h3>No posts yet 🐾</h3>
              <p>Share your first cat moment!</p>
              <button onClick={() => navigate("/create-post")}>Create Post</button>
            </div>
          ) : (
            displayedPosts.map((post) => (
              <article className="profile-post-card" key={post.id}>
                <img
                  src={post.image_url}
                  alt={post.caption}
                  onClick={() => setSelectedImage(post.image_url)}
                />
                <div className="profile-post-content">
                  <h3>{post.caption}</h3>
                  <div className="profile-post-actions">
                    <button onClick={() => handleDeletePost(post.id)}>🗑️ Delete</button>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </main>

      <aside className="profile-right">
        <div className="right-profile-card">
          <h3>👤 About Me</h3>
          <p>📅 Joined {profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "..."}</p>
          <p>📧 {session.user.email}</p>
          <button onClick={handleEditProfile}>Edit Details</button>
        </div>
        <div className="right-profile-card quote-card">
          <h3>Daily Purrspiration</h3>
          <p>"Time spent with cats is never wasted."</p>
          <span>– Sigmund Freud</span>
        </div>
      </aside>

      {selectedImage && (
        <div className="profile-image-modal" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Preview" />
        </div>
      )}
    </div>
  );
}

export default Profile;
