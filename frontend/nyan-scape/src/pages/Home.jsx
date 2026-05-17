import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPosts, likePost, unlikePost, getLikes, getComments, addComment, deletePost, getProfile } from "../lib/api";
import Sidebar from "../components/Sidebar";
// import RightPanel from "../components/RightPanel";
import "../App.css";

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
  const [postAvatars, setPostAvatars] = useState({});

  async function fetchPosts() {
    try {
      setLoading(true);
      const res = await getPosts();
      setPosts(res.data);

      // Fetch like counts
      const likeData = {};
      await Promise.all(res.data.map(async (post) => {
        try {
          const r = await getLikes(post.id);
          likeData[post.id] = r.data.likes || 0;
        } catch { likeData[post.id] = 0; }
      }));
      setLikeCounts(likeData);

      // Fetch avatars for each unique user
      const uniqueUserIds = [...new Set(res.data.map(p => p.user_id))];
      const avatarData = {};
      await Promise.all(uniqueUserIds.map(async (userId) => {
        try {
          const r = await getProfile(userId);
          if (r.data.avatar_url) avatarData[userId] = r.data.avatar_url;
        } catch { /* no avatar */ }
      }));
      setPostAvatars(avatarData);

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

  async function handleDelete(postId) {
    if (!window.confirm("Delete this post?")) return;
    try {
      await deletePost(postId);
      fetchPosts();
    } catch (err) { console.error("Delete error:", err); }
  }

  function handleShare(postId) {
    navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
    alert("Post link copied!");
  }

  const filteredPosts = posts.filter((post) =>
    `${post.caption} ${post.profiles?.username}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="page-main feed">
        <div className="top-bar">
          <input type="text" placeholder="Search posts or users..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
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
                <div className="user-avatar-placeholder">
                  {postAvatars[post.user_id] ? (
                    <img
                      src={postAvatars[post.user_id]}
                      alt="avatar"
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                    />
                  ) : "🐱"}
                </div>
                <div>
                  <h3>{post.profiles?.username || "Unknown"}</h3>
                  <p>{new Date(post.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <p className="post-title">{post.caption}</p>

              <img src={post.image_url} alt="Cat post" className="post-image"
                onClick={() => setSelectedImage(post.image_url)} />

              <div className="post-actions">
                <button onClick={() => handleLike(post.id)}>
                  {likedPosts[post.id] ? "❤️" : "🤍"} {likeCounts[post.id] || 0}
                </button>
                <button onClick={() => toggleComments(post.id)}>
                  💬 {comments[post.id]?.length || 0}
                </button>
                <button onClick={() => handleShare(post.id)}>↗️ Share</button>
                {session.user.id === post.user_id && (
                  <button onClick={() => handleDelete(post.id)}>🗑️</button>
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
                    <input type="text" placeholder="Add a comment..."
                      value={commentInputs[post.id] || ""}
                      onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === "Enter") handleAddComment(post.id); }} />
                    <button onClick={() => handleAddComment(post.id)}>Post</button>
                  </div>
                </div>
              )}
            </article>
          ))
        )}
      </main>

      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Preview" />
        </div>
      )}
    </div>
  );
}

export default Home;
