import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPosts, likePost, unlikePost } from "../lib/api";
import "../App.css";
import logoImg from "../assets/logo.png";

function Explore({ session }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("forYou");
  const [selectedImage, setSelectedImage] = useState(null);
  const [likedPosts, setLikedPosts] = useState({});
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const hashtags = [
    { tag: "#Caturday", count: "2.1K posts" },
    { tag: "#CatLife", count: "1.8K posts" },
    { tag: "#NyanScape", count: "1.5K posts" },
    { tag: "#WhiskerWednesday", count: "980 posts" },
    { tag: "#AdoptDontShop", count: "870 posts" },
  ];

  const suggestedUsers = ["MeowMates", "FluffyPaws", "PurrfectCats", "TheCatDaily", "MeowWorld"];

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await getPosts();
        setPosts(res.data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  async function toggleLike(postId) {
    const alreadyLiked = likedPosts[postId];
    try {
      if (alreadyLiked) {
        await unlikePost({ user_id: session.user.id, post_id: postId });
        setLikedPosts((prev) => ({ ...prev, [postId]: false }));
      } else {
        await likePost({ user_id: session.user.id, post_id: postId });
        setLikedPosts((prev) => ({ ...prev, [postId]: true }));
      }
    } catch (err) {
      console.error("Like error:", err);
    }
  }

  function sharePost(id) {
    navigator.clipboard.writeText(`${window.location.origin}/post/${id}`);
    alert("Post link copied!");
  }

  const filteredPosts = useMemo(() => {
    let result = posts.filter((post) => {
      const text = `${post.profiles?.username || ""} ${post.caption || ""}`.toLowerCase();
      return text.includes(search.toLowerCase());
    });
    if (activeTab === "trending") result = [...result].sort((a, b) => b.created_at < a.created_at ? 1 : -1);
    return result;
  }, [search, activeTab, posts]);

  return (
    <div className="explore-page">
      <aside className="explore-sidebar">
        <div className="explore-brand">
          <img src={logoImg} alt="NyanScape" />
          <h1>NyanScape</h1>
        </div>
        <button onClick={() => navigate("/fyp")}>🏠 FYP</button>
        <button className="active">🔍 Explore</button>
        <button onClick={() => navigate("/create-post")}>➕ Create Post</button>
        <button onClick={() => navigate("/profile")}>👤 My Profile</button>
        <button onClick={() => navigate("/notifications")}>🔔 Notifications</button>
        <button onClick={() => navigate("/messages")}>💬 Messages</button>
        <button onClick={() => navigate("/settings")}>⚙️ Settings</button>
        <button className="create-post-btn" onClick={() => navigate("/create-post")}>+ Create Post</button>
        <div className="join-box">
          <img src={logoImg} alt="Cat mascot" />
          <h3>Join NyanScape Community!</h3>
          <p>Share your cat stories, photos, and moments with fellow cat lovers!</p>
        </div>
      </aside>

      <main className="explore-main">
        <div className="explore-search">
          <input
            type="text"
            placeholder="Search posts, users, or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={() => navigate("/notifications")}>🔔</button>
        </div>

        <section className="explore-header">
          <h2>Explore ✨</h2>
          <p>Discover trending cats, popular posts, and new friends 🐾</p>
          <div className="explore-tabs">
            <button className={activeTab === "forYou" ? "active" : ""} onClick={() => setActiveTab("forYou")}>For You</button>
            <button className={activeTab === "trending" ? "active" : ""} onClick={() => setActiveTab("trending")}>Trending</button>
            <button className={activeTab === "recent" ? "active" : ""} onClick={() => setActiveTab("recent")}>Recent</button>
          </div>
        </section>

        <section className="hashtag-box">
          <div className="section-title">
            <h3>Trending Hashtags</h3>
          </div>
          <div className="hashtag-row">
            {hashtags.map((item) => (
              <button key={item.tag} onClick={() => setSearch(item.tag)}>
                <strong>{item.tag}</strong>
                <span>{item.count}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="popular-posts">
          <div className="section-title">
            <h3>Posts</h3>
          </div>
          {loading ? (
            <div className="empty-explore"><h3>Loading... 🐱</h3></div>
          ) : filteredPosts.length === 0 ? (
            <div className="empty-explore">
              <h3>No results found 🐾</h3>
              <p>Try searching another cat, user, or hashtag.</p>
            </div>
          ) : (
            <div className="explore-grid">
              {filteredPosts.map((post) => (
                <article className="explore-card" key={post.id}>
                  <div className="card-top">
                    <div>
                      <strong>{post.profiles?.username || "Unknown"}</strong>
                      <p>{new Date(post.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <img
                    src={post.image_url}
                    alt={post.caption}
                    onClick={() => setSelectedImage(post.image_url)}
                  />
                  <h4>{post.caption}</h4>
                  <div className="card-actions">
                    <button onClick={() => toggleLike(post.id)}>
                      {likedPosts[post.id] ? "❤️" : "🤍"}
                    </button>
                    <button onClick={() => sharePost(post.id)}>↗️ Share</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="suggested-bottom">
          <div className="section-title">
            <h3>Suggested Users</h3>
          </div>
          <div className="user-row">
            {suggestedUsers.map((user) => (
              <div className="user-card" key={user}>
                <div style={{ fontSize: "2rem" }}>🐱</div>
                <strong>{user}</strong>
                <p>@{user.toLowerCase()}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <aside className="explore-right">
        <div className="right-card">
          <h3>🐾 Trending Tags</h3>
          {hashtags.map((item) => (
            <p key={item.tag} onClick={() => setSearch(item.tag)} style={{ cursor: "pointer" }}>
              {item.tag} <span>{item.count}</span>
            </p>
          ))}
        </div>
        <div className="right-card quote">
          <h3>Daily Purrspiration</h3>
          <p>"Time spent with cats is never wasted."</p>
          <span>– Sigmund Freud</span>
        </div>
        <div className="right-card">
          <h3>Popular Searches</h3>
          {["funny cats", "cute kittens", "black cat", "sleepy cats"].map((item) => (
            <p key={item} onClick={() => setSearch(item)} style={{ cursor: "pointer" }}>🔍 {item}</p>
          ))}
        </div>
      </aside>

      <button className="floating-paw" onClick={() => navigate("/create-post")}>🐾</button>

      {selectedImage && (
        <div className="image-preview" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Preview" />
        </div>
      )}
    </div>
  );
}

export default Explore;
