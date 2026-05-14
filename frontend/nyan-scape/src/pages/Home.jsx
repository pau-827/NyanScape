import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const [posts, setPosts] = useState([
    {
      id: 1,
      username: "WhiskerMom",
      time: "2h ago",
      title: "Sunbathing is my cardio ☀️🐱",
      image: "/cat.webp",
      likes: 124,
      comments: 18,
      liked: false,
      bookmarked: false,
    },
    {
      id: 2,
      username: "PawHunter",
      time: "4h ago",
      title: "Meet Luna! She loves boxes 📦",
      image: "/luna.webp",
      likes: 98,
      comments: 12,
      liked: false,
      bookmarked: false,
    },
    {
      id: 3,
      username: "CatLover_23",
      time: "6h ago",
      title: "Playtime is the best time!",
      image: "/play.jpg",
      likes: 76,
      comments: 9,
      liked: false,
      bookmarked: false,
    },
  ]);

  function handleLike(id) {
    setPosts(
      posts.map((post) =>
        post.id === id
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  }

  function handleBookmark(id) {
    setPosts(
      posts.map((post) =>
        post.id === id
          ? { ...post, bookmarked: !post.bookmarked }
          : post
      )
    );
  }

  function handleShare(id) {
    navigator.clipboard.writeText(`${window.location.origin}/post/${id}`);
    alert("Post link copied!");
  }

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="home-page">
      <aside className="sidebar">
        <h1 className="logo">🐾 NyanScape</h1>

        <nav>
          <Link className="active" to="/fyp">🏠 FYP</Link>
          <Link to="/fyp">🔍 Explore</Link>
          <Link to="/create-post">➕ Create Post</Link>
          <Link to="/fyp">🔖 Bookmarks</Link>
          <Link to="/profile">👤 My Profile</Link>
          <Link to="/fyp">⚙️ Settings</Link>
        </nav>

        <button className="create-btn" onClick={() => navigate("/create-post")}>
          + Create Post
        </button>
      </aside>

      <main className="feed">
        <div className="top-bar">
          <input
            type="text"
            placeholder="Search posts, users, or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <section className="feed-header">
          <div>
            <h2>FYP ✨</h2>
            <p>For you, purrfectly curated cat content 🐾</p>
          </div>

          <div className="tabs">
            <button className="active-tab">For You</button>
            <button>Following</button>
            <button>Latest</button>
          </div>
        </section>

        {filteredPosts.map((post) => (
          <article className="post-card" key={post.id}>
            <div className="post-user">
              <div className="avatar">🐱</div>
              <div>
                <h3>{post.username}</h3>
                <p>{post.time}</p>
              </div>
            </div>

            <h2 className="post-title">{post.title}</h2>
            <p className="hashtags">#CatLife #NyanScape #CuteCats</p>

            <img src={post.image} alt="Cat post" className="post-image" />

            <div className="post-actions">
              <button onClick={() => handleLike(post.id)}>
                {post.liked ? "❤️" : "🤍"} {post.likes}
              </button>

              <button onClick={() => navigate(`/post/${post.id}`)}>
                💬 {post.comments}
              </button>

              <button onClick={() => handleShare(post.id)}>↗️ Share</button>

              <button onClick={() => handleBookmark(post.id)}>
                {post.bookmarked ? "🔖" : "📑"}
              </button>
            </div>
          </article>
        ))}
      </main>

      <aside className="right-panel">
        <div className="panel-card">
          <h3>Trending Tags</h3>
          <p>#Caturday</p>
          <p>#CatLife</p>
          <p>#NyanScape</p>
          <p>#WhiskerWednesday</p>
        </div>

        <div className="panel-card">
          <h3>Suggested Users</h3>
          <p>🐱 MeowMates</p>
          <p>🐈 FluffyPaws</p>
          <p>😺 PurrfectCats</p>
        </div>

        <div className="panel-card">
          <h3>Daily Purrspiration</h3>
          <p>“Time spent with cats is never wasted.”</p>
        </div>
      </aside>
    </div>
  );
}

export default Home;