import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { getPosts, likePost, unlikePost } from "../lib/api";
import "../App.css";
import logoImg from "../assets/logo.png";

function Home({ session }) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("forYou");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState({});

  async function fetchPosts() {
    try {
      setLoading(true);
      const res = await getPosts();
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  async function handleLike(postId) {
    const alreadyLiked = likedPosts[postId];
    try {
      if (alreadyLiked) {
        await unlikePost({ user_id: session.user.id, post_id: postId });
        setLikedPosts(prev => ({ ...prev, [postId]: false }));
      } else {
        await likePost({ user_id: session.user.id, post_id: postId });
        setLikedPosts(prev => ({ ...prev, [postId]: true }));
      }
    } catch (err) {
      console.error("Like error:", err);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  function handleShare(postId) {
    const link = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(link);
    alert("Post link copied!");
  }

  function getFilteredPosts() {
    return posts.filter((post) => {
      const searchText = `${post.caption} ${post.profiles?.username}`.toLowerCase();
      return searchText.includes(search.toLowerCase());
    });
  }

  const filteredPosts = getFilteredPosts();

  return (
    <div className="home-page">
      <aside className="sidebar">
        <div className="brand">
          <img src={logoImg} alt="NyanScape Logo" className="logo-img" />
          <h1>NyanScape</h1>
        </div>

        <nav>
          <button className="nav-link active">🏠 FYP</button>
          <button className="nav-link" onClick={() => navigate("/explore")}>🔍 Explore</button>
          <button className="nav-link" onClick={() => navigate("/create-post")}>➕ Create Post</button>
          <button className="nav-link" onClick={() => navigate("/profile")}>👤 My Profile</button>
          <button className="nav-link" onClick={() => navigate("/notifications")}>🔔 Notifications</button>
          <button className="nav-link" onClick={() => navigate("/messages")}>💬 Messages</button>
          <button className="nav-link" onClick={() => navigate("/settings")}>⚙️ Settings</button>
        </nav>

        <button className="create-btn" onClick={() => navigate("/create-post")}>
          + Create Post
        </button>

        <div className="join-card">
          <img src={logoImg} alt="Cat mascot" />
          <h3>Join NyanScape Community!</h3>
          <p>Share your cat stories, photos, and moments with fellow cat lovers!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      <main className="feed">
        <div className="top-bar">
          <input
            type="text"
            placeholder="Search posts or users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="bell">🔔</span>
        </div>

        <section className="feed-header">
          <div>
            <h2>FYP ✨</h2>
            <p>For You, Purrfectly curated cat content 🐾</p>
          </div>
          <div className="tabs">
            <button className={activeTab === "forYou" ? "active-tab" : ""} onClick={() => setActiveTab("forYou")}>For You</button>
            <button className={activeTab === "latest" ? "active-tab" : ""} onClick={() => setActiveTab("latest")}>Latest</button>
          </div>
        </section>

        {loading ? (
          <div className="empty-state"><h3>Loading posts... 🐱</h3></div>
        ) : filteredPosts.length === 0 ? (
          <div className="empty-state">
            <h3>No posts yet 🐾</h3>
            <p>Be the first to share a cat moment!</p>
            <button onClick={() => navigate("/create-post")}>Create Post</button>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <article className="post-card" key={post.id}>
              <div className="post-user">
                <div className="user-avatar-placeholder">🐱</div>
                <div>
                  <h3>{post.profiles?.username || "Unknown"}</h3>
                  <p>{new Date(post.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <p className="post-title">{post.caption}</p>

              <img
                src={post.image_url}
                alt="Cat post"
                className="post-image"
                onClick={() => setSelectedImage(post.image_url)}
              />

              <div className="post-actions">
                <button onClick={() => handleLike(post.id)}>
                  {likedPosts[post.id] ? "❤️" : "🤍"}
                </button>
                <button onClick={() => handleShare(post.id)}>↗️ Share</button>
                {session.user.id === post.user_id && (
                  <button onClick={async () => {
                    if (window.confirm("Delete this post?")) {
                      try {
                        const { deletePost } = await import("../lib/api");
                        await deletePost(post.id);
                        fetchPosts();
                      } catch (err) {
                        console.error("Delete error:", err);
                      }
                    }
                  }}>🗑️</button>
                )}
              </div>
            </article>
          ))
        )}
      </main>

      <aside className="right-panel">
        <div className="panel-card">
          <h3>📈 Trending Tags</h3>
          <p>#Caturday <span>2.1K posts</span></p>
          <p>#CatLife <span>1.8K posts</span></p>
          <p>#NyanScape <span>1.5K posts</span></p>
          <p>#WhiskerWednesday <span>980 posts</span></p>
        </div>
        <div className="panel-card quote-card">
          <h3>Daily Purrspiration</h3>
          <p>"Time spent with cats is never wasted."</p>
          <span>– Sigmund Freud</span>
        </div>
      </aside>

      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Preview" />
        </div>
      )}
    </div>
  );
}

export default Home;
