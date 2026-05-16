import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { getPosts, likePost, unlikePost, getLikes, getComments, addComment } from "../lib/api";
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
  const [likeCounts, setLikeCounts] = useState({});
  const [comments, setComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [showComments, setShowComments] = useState({});

  async function fetchPosts() {
    try {
      setLoading(true);
      const res = await getPosts();
      setPosts(res.data);

      // Fetch like counts for all posts
      const likeData = {};
      await Promise.all(res.data.map(async (post) => {
        try {
          const r = await getLikes(post.id);
          likeData[post.id] = r.data.likes || 0;
        } catch { likeData[post.id] = 0; }
      }));
      setLikeCounts(likeData);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchPosts(); }, []);

  async function handleLike(postId) {
    const alreadyLiked = likedPosts[postId];
    try {
      if (alreadyLiked) {
        await unlikePost({ user_id: session.user.id, post_id: postId });
        setLikedPosts(prev => ({ ...prev, [postId]: false }));
        setLikeCounts(prev => ({ ...prev, [postId]: Math.max(0, (prev[postId] || 1) - 1) }));
      } else {
        await likePost({ user_id: session.user.id, post_id: postId });
        setLikedPosts(prev => ({ ...prev, [postId]: true }));
        setLikeCounts(prev => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));
      }
    } catch (err) { console.error("Like error:", err); }
  }

  async function toggleComments(postId) {
    const isOpen = showComments[postId];
    setShowComments(prev => ({ ...prev, [postId]: !isOpen }));
    if (!isOpen && !comments[postId]) {
      try {
        const res = await getComments(postId);
        setComments(prev => ({ ...prev, [postId]: res.data }));
      } catch (err) { console.error("Comment fetch error:", err); }
    }
  }

  async function handleAddComment(postId) {
    const content = commentInputs[postId]?.trim();
    if (!content) return;
    try {
      await addComment({ user_id: session.user.id, post_id: postId, content });
      const res = await getComments(postId);
      setComments(prev => ({ ...prev, [postId]: res.data }));
      setCommentInputs(prev => ({ ...prev, [postId]: "" }));
    } catch (err) { console.error("Comment error:", err); }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  function handleShare(postId) {
    navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
    alert("Post link copied!");
  }

  const filteredPosts = posts.filter((post) =>
    `${post.caption} ${post.profiles?.username}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="home-page">
      <aside className="sidebar unified-sidebar">
        <div className="sidebar-brand" onClick={() => navigate("/fyp")}>
          <img src={logoImg} alt="NyanScape Logo" className="sidebar-logo" />
          <h1 className="sidebar-title">NyanScape</h1>
        </div>
        <nav className="sidebar-nav">
          <button className="sidebar-link active" onClick={() => navigate("/fyp")}>🏠 FYP</button>
          <button className="sidebar-link" onClick={() => navigate("/explore")}>🔍 Explore</button>
          <button className="sidebar-link" onClick={() => navigate("/create-post")}>➕ Create Post</button>
          <button className="sidebar-link" onClick={() => navigate("/profile")}>👤 My Profile</button>
          <button className="sidebar-link" onClick={() => navigate("/notifications")}>🔔 Notifications</button>
          <button className="sidebar-link" onClick={() => navigate("/messages")}>💬 Messages</button>
          <button className="sidebar-link" onClick={() => navigate("/settings")}>⚙️ Settings</button>
        </nav>
        <button className="sidebar-create-btn" onClick={() => navigate("/create-post")}>+ Create Post</button>
        <div className="sidebar-card">
          <img src={logoImg} alt="Cat mascot" />
          <h3>Join NyanScape Community!</h3>
          <p>Share your cat stories, photos, and moments with fellow cat lovers!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      <main className="feed">
        <div className="top-bar">
          <input type="text" placeholder="Search posts or users..." value={search} onChange={(e) => setSearch(e.target.value)} />
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
                  {likedPosts[post.id] ? "❤️" : "🤍"} {likeCounts[post.id] || 0}
                </button>
                <button onClick={() => toggleComments(post.id)}>
                  💬 {comments[post.id]?.length || 0}
                </button>
                <button onClick={() => handleShare(post.id)}>↗️ Share</button>
                {session.user.id === post.user_id && (
                  <button onClick={async () => {
                    if (window.confirm("Delete this post?")) {
                      try {
                        const { deletePost } = await import("../lib/api");
                        await deletePost(post.id);
                        fetchPosts();
                      } catch (err) { console.error("Delete error:", err); }
                    }
                  }}>🗑️</button>
                )}
              </div>

              {showComments[post.id] && (
                <div className="comments">
                  {(comments[post.id] || []).map((c) => (
                    <div key={c.id} className="comment">
                      <strong>{c.profiles?.username || "Unknown"}:</strong> {c.content}
                    </div>
                  ))}
                  <div className="comment-input">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentInputs[post.id] || ""}
                      onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === "Enter") handleAddComment(post.id); }}
                    />
                    <button onClick={() => handleAddComment(post.id)}>Post</button>
                  </div>
                </div>
              )}
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
