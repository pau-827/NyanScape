import React, { useEffect, useMemo, useState } from "react";
import { getPosts, likePost, unlikePost } from "../lib/api";
import Sidebar from "../components/Sidebar";
import "../App.css";

function Explore({ session }) {
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
      } else {
        await likePost({ user_id: session.user.id, post_id: postId });
      }
      setLikedPosts(prev => ({ ...prev, [postId]: !alreadyLiked }));
    } catch (err) { console.error("Like error:", err); }
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
    <div className="page-layout">
      <Sidebar />
      <main className="page-main">
        <div className="page-topbar">
          <input type="text" placeholder="Search posts, users, or tags..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <section className="page-header">
          <h2>Explore ✨</h2>
          <p>Discover trending cats, popular posts, and new friends 🐾</p>
          <div className="explore-tabs">
            <button className={activeTab === "forYou" ? "active" : ""} onClick={() => setActiveTab("forYou")}>For You</button>
            <button className={activeTab === "trending" ? "active" : ""} onClick={() => setActiveTab("trending")}>Trending</button>
            <button className={activeTab === "recent" ? "active" : ""} onClick={() => setActiveTab("recent")}>Recent</button>
          </div>
        </section>

        <section className="content-card">
          <h3>Trending Hashtags</h3>
          <div className="hashtag-row">
            {hashtags.map((item) => (
              <button key={item.tag} onClick={() => setSearch(item.tag)}>
                <strong>{item.tag}</strong>
                <span>{item.count}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="content-card">
          <h3>Posts</h3>
          {loading ? (
            <div className="empty-explore"><h3>Loading... 🐱</h3></div>
          ) : filteredPosts.length === 0 ? (
            <div className="empty-explore"><h3>No results found 🐾</h3></div>
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
                  <img src={post.image_url} alt={post.caption}
                    onClick={() => setSelectedImage(post.image_url)} />
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

        <section className="content-card">
          <h3>Suggested Users</h3>
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

        {selectedImage && (
          <div className="image-preview" onClick={() => setSelectedImage(null)}>
            <img src={selectedImage} alt="Preview" />
          </div>
        )}
      </main>
    </div>
  );
}

export default Explore;
