import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getPosts, deletePost, getProfile, updateProfile, uploadAvatar } from "../lib/api";
import Sidebar from "../components/Sidebar";
import "../App.css";
import cover from "../assets/cover.jpg";

function Profile({ session }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
    fetchMyPosts();
  }, [session]);

  async function fetchProfile() {
    try {
      const res = await getProfile(session.user.id);
      const data = res.data;
      setProfile(data);
      setEditName(data.username || "");
      setEditBio(data.bio || "");
      if (data.avatar_url) setAvatarUrl(data.avatar_url);
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
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

  async function handleSaveProfile() {
    setSaving(true);
    try {
      const res = await updateProfile({
        user_id: session.user.id,
        username: editName,
        bio: editBio,
      });
      setProfile(res.data.profile);
      setEditMode(false);
    } catch (err) {
      alert("Failed to save profile: " + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview immediately
    setAvatarUrl(URL.createObjectURL(file));
    setAvatarUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("user_id", session.user.id);
      const res = await uploadAvatar(formData);
      setAvatarUrl(res.data.avatar_url);
    } catch (err) {
      alert("Failed to upload avatar: " + (err.response?.data?.error || err.message));
    } finally {
      setAvatarUploading(false);
    }
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
            {/* Avatar */}
            <div className="profile-avatar-wrap">
              <div
                className="profile-avatar-placeholder"
                style={{ cursor: "pointer", position: "relative", overflow: "hidden" }}
                onClick={() => avatarInputRef.current?.click()}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                  />
                ) : (
                  <span style={{ fontSize: "3.5rem" }}>🐱</span>
                )}
                <div style={{
                  position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)",
                  borderRadius: "50%", display: "flex", alignItems: "center",
                  justifyContent: "center", opacity: 0, transition: "opacity 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 1}
                  onMouseLeave={e => e.currentTarget.style.opacity = 0}
                >
                  <span style={{ color: "white", fontSize: "1.5rem" }}>📷</span>
                </div>
              </div>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleAvatarChange}
              />
              {avatarUploading && (
                <p style={{ fontSize: "11px", color: "#7c3aed", textAlign: "center", marginTop: "4px" }}>
                  Uploading...
                </p>
              )}
            </div>

            {/* Profile info */}
            <div className="profile-text">
              {editMode ? (
                <>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Display name"
                    style={{ fontSize: "1.3rem", fontWeight: "700", border: "1.5px solid #ede9ff", borderRadius: "10px", padding: "8px 12px", width: "100%", marginBottom: "10px", outline: "none" }}
                  />
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Write your bio..."
                    maxLength={150}
                    rows={3}
                    style={{ width: "100%", border: "1.5px solid #ede9ff", borderRadius: "10px", padding: "8px 12px", fontSize: "14px", resize: "none", outline: "none", fontFamily: "inherit" }}
                  />
                  <p style={{ fontSize: "12px", color: "#aaa", textAlign: "right" }}>{editBio.length}/150</p>
                </>
              ) : (
                <>
                  <h2>{profile?.username || "Loading..."}</h2>
                  <p className="handle">@{profile?.username?.toLowerCase().replace(/\s/g, "") || ""}</p>
                  <span className="badge">Cat Enthusiast 🐱</span>
                  <p className="bio">{profile?.bio || "No bio yet. Click Edit Profile to add one!"}</p>
                </>
              )}

              <div className="stats">
                <div><strong>{posts.length}</strong><span>Posts</span></div>
                <div><strong>0</strong><span>Followers</span></div>
                <div><strong>0</strong><span>Following</span></div>
              </div>
            </div>

            {/* Edit / Save buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignSelf: "start", marginTop: "24px" }}>
              {editMode ? (
                <>
                  <button className="edit-profile-btn" onClick={handleSaveProfile} disabled={saving}
                    style={{ background: "#7c3aed", color: "white", border: "none" }}>
                    {saving ? "Saving..." : "✅ Save"}
                  </button>
                  <button className="edit-profile-btn" onClick={() => setEditMode(false)}>
                    Cancel
                  </button>
                </>
              ) : (
                <button className="edit-profile-btn" onClick={() => setEditMode(true)}>
                  👤 Edit Profile
                </button>
              )}
            </div>
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
