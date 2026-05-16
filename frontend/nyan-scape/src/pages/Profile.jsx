import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { getPosts, deletePost } from "../lib/api";
import Sidebar from "../components/Sidebar";
import "../App.css";
import cover from "../assets/cover.jpg";

function Profile({ session }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchProfile();
    fetchMyPosts();
  }, [session]);

  async function fetchProfile() {
    const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
    if (data) setProfile(data);
  }

  async function fetchMyPosts() {
    try {
      const res = await getPosts();
      setPosts(res.data.filter((p) => p.user_id === session.user.id));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this post?")) return;
    try {
      await deletePost(id);
      setPosts(prev => prev.filter((p) => p.id !== id));
    } catch (err) { console.error(err); }
  }

  async function handleEditProfile() {
    const newName = window.prompt("Display name:", profile?.username || "");
    const newBio = window.prompt("Bio:", profile?.bio || "");
    if (!newName) return;
    const { error } = await supabase.from("profiles").update({ username: newName, bio: newBio }).eq("id", session.user.id);
    if (!error) setProfile(prev => ({ ...prev, username: newName, bio: newBio }));
  }

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="page-main">
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
            <button className="edit-profile-btn" onClick={handleEditProfile}>👤 Edit Profile</button>
          </div>
          <div className="profile-tabs">
            <button className="active">▦ Posts</button>
          </div>
        </section>

        <section className="profile-post-grid">
          {loading ? (
            <div className="profile-empty"><h3>Loading... 🐱</h3></div>
          ) : posts.length === 0 ? (
            <div className="profile-empty">
              <h3>No posts yet 🐾</h3>
              <button onClick={() => navigate("/create-post")}>Create Post</button>
            </div>
          ) : (
            posts.map((post) => (
              <article className="profile-post-card" key={post.id}>
                <img src={post.image_url} alt={post.caption}
                  onClick={() => setSelectedImage(post.image_url)} />
                <div className="profile-post-content">
                  <h3>{post.caption}</h3>
                  <div className="profile-post-actions">
                    <button onClick={() => handleDelete(post.id)}>🗑️ Delete</button>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>

        {selectedImage && (
          <div className="profile-image-modal" onClick={() => setSelectedImage(null)}>
            <img src={selectedImage} alt="Preview" />
          </div>
        )}
      </main>
    </div>
  );
}

export default Profile;
