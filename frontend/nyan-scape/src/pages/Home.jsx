import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const defaultPosts = [
    {
      id: 1,
      username: "WhiskerMom",
      handle: "@whiskermom",
      time: "2h ago",
      title: "Sunbathing is my cardio ☀️🐱",
      caption: "My cat loves relaxing by the window.",
      hashtags: ["#CatLife", "#SunnyDay", "#NyanScape"],
      image: "/cat.webp",
      likes: 124,
      comments: 18,
      shares: 12,
      liked: false,
      bookmarked: false,
    },
    {
      id: 2,
      username: "PawHunter",
      handle: "@pawhunter",
      time: "4h ago",
      title: "Meet Luna! 🌙 She loves boxes!",
      caption: "Luna found her new favorite cardboard box.",
      hashtags: ["#MeetLuna", "#CuriousCat", "#NyanScape"],
      image: "/luna.webp",
      likes: 98,
      comments: 12,
      shares: 7,
      liked: false,
      bookmarked: false,
    },
    {
      id: 3,
      username: "CatLover_23",
      handle: "@catlover23",
      time: "6h ago",
      title: "Playtime is the best time! 🧶🐱",
      caption: "A happy kitten enjoying playtime.",
      hashtags: ["#Playtime", "#HappyCat", "#NyanScape"],
      image: "/play.jpg",
      likes: 76,
      comments: 9,
      shares: 5,
      liked: false,
      bookmarked: false,
    },
  ];

  const [posts, setPosts] = useState(() => {
    const savedPosts = localStorage.getItem("nyanscape_posts");
    return savedPosts ? JSON.parse(savedPosts) : defaultPosts;
  });

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("forYou");
  const [selectedImage, setSelectedImage] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newCaption, setNewCaption] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [followedUsers, setFollowedUsers] = useState([]);

  useEffect(() => {
    localStorage.setItem("nyanscape_posts", JSON.stringify(posts));
  }, [posts]);

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
    const link = `${window.location.origin}/post/${id}`;
    navigator.clipboard.writeText(link);
    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, shares: post.shares + 1 } : post
      )
    );
    alert("Post link copied!");
  }

  function handleComment(id) {
    const comment = prompt("Write your comment:");
    if (!comment) return;

    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, comments: post.comments + 1 } : post
      )
    );

    alert("Comment added!");
  }

  function handleFollow(username) {
    if (followedUsers.includes(username)) {
      setFollowedUsers(followedUsers.filter((user) => user !== username));
    } else {
      setFollowedUsers([...followedUsers, username]);
    }
  }

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setNewImage(imageUrl);
  }

  function handleCreatePost(e) {
    e.preventDefault();

    if (!newCaption || !newImage) {
      alert("Please add a caption and image.");
      return;
    }

    const newPost = {
      id: Date.now(),
      username: "You",
      handle: "@you",
      time: "Just now",
      title: newCaption,
      caption: newCaption,
      hashtags: ["#CatLife", "#NyanScape", "#NewPost"],
      image: newImage,
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false,
      bookmarked: false,
    };

    setPosts([newPost, ...posts]);
    setNewCaption("");
    setNewImage(null);
    setShowCreatePost(false);
  }

  function getFilteredPosts() {
    let filtered = posts.filter((post) => {
      const searchText = `${post.title} ${post.caption} ${post.username} ${post.handle} ${post.hashtags.join(
        " "
      )}`.toLowerCase();

      return searchText.includes(search.toLowerCase());
    });

    if (activeTab === "latest") {
      filtered = [...filtered].sort((a, b) => b.id - a.id);
    }

    if (activeTab === "following") {
      filtered = filtered.filter((post) => followedUsers.includes(post.username));
    }

    return filtered;
  }

  const filteredPosts = getFilteredPosts();

  return (
    <div className="home-page">
      <aside className="sidebar">
        <div className="brand">
          <img src="/logo.png" alt="NyanScape Logo" className="logo-img" />
          <h1>NyanScape</h1>
        </div>

        <nav>
          <button className="nav-link active">🏠 FYP</button>
          <button className="nav-link" onClick={() => navigate("/explore")}>
            🔍 Explore
          </button>
          <button className="nav-link" onClick={() => setShowCreatePost(true)}>
            ➕ Create Post
          </button>
          <button className="nav-link" onClick={() => setActiveTab("bookmarks")}>
            🔖 Bookmarks
          </button>
          <button className="nav-link" onClick={() => navigate("/profile")}>
            👤 My Profile
          </button>
          <button className="nav-link" onClick={() => navigate("/notifications")}>🔔 Notifications</button>
        <button className="nav-link active" onClick={() => navigate("/messages")}>💬 Messages</button>
          <button className="nav-link" onClick={() => navigate("/settings")}>⚙️ Settings</button>
        </nav>

        <button className="create-btn" onClick={() => setShowCreatePost(true)}>
          + Create Post
        </button>

        <div className="join-card">
          <img src="/logo.png" alt="Cat mascot" />
          <h3>Join NyanScape Community!</h3>
          <p>Share your cat stories, photos, and moments with fellow cat lovers!</p>
          <button onClick={() => alert("Invite link copied!")}>Invite Friends</button>
        </div>
      </aside>

      <main className="feed">
        <div className="top-bar">
          <input
            type="text"
            placeholder="Search posts, users, or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="bell">🔔</span>
          <img src="/cat.webp" alt="User" className="top-avatar" />
        </div>

        <section className="feed-header">
          <div>
            <h2>FYP ✨</h2>
            <p>For You, Purrfectly curated cat content 🐾</p>
          </div>

          <div className="tabs">
            <button
              className={activeTab === "forYou" ? "active-tab" : ""}
              onClick={() => setActiveTab("forYou")}
            >
              For You
            </button>
            <button
              className={activeTab === "following" ? "active-tab" : ""}
              onClick={() => setActiveTab("following")}
            >
              Following
            </button>
            <button
              className={activeTab === "latest" ? "active-tab" : ""}
              onClick={() => setActiveTab("latest")}
            >
              Latest
            </button>
          </div>
        </section>

        {activeTab === "bookmarks" && (
          <h3 className="section-label">Saved Posts 🔖</h3>
        )}

        {filteredPosts.filter((post) =>
          activeTab === "bookmarks" ? post.bookmarked : true
        ).length === 0 ? (
          <div className="empty-state">
            <h3>No posts found 🐾</h3>
            <p>Try another search or create a new cat post.</p>
          </div>
        ) : (
          filteredPosts
            .filter((post) => (activeTab === "bookmarks" ? post.bookmarked : true))
            .map((post) => (
              <article className="post-card" key={post.id}>
                <div className="post-menu">•••</div>

                <div className="post-user">
                  <img src={post.image} alt={post.username} className="user-avatar" />
                  <div>
                    <h3>{post.username}</h3>
                    <p>
                      {post.handle} · {post.time}
                    </p>
                  </div>
                </div>

                <h2 className="post-title">{post.title}</h2>

                <p className="hashtags">
                  {post.hashtags.map((tag) => (
                    <span key={tag}>{tag} </span>
                  ))}
                </p>

                <img
                  src={post.image}
                  alt="Cat post"
                  className="post-image"
                  onClick={() => setSelectedImage(post.image)}
                />

                <div className="post-actions">
                  <button onClick={() => handleLike(post.id)}>
                    {post.liked ? "❤️" : "🤍"} {post.likes}
                  </button>

                  <button onClick={() => handleComment(post.id)}>
                    💬 {post.comments}
                  </button>

                  <button onClick={() => handleShare(post.id)}>
                    ↗️ {post.shares}
                  </button>

                  <button onClick={() => handleBookmark(post.id)}>
                    {post.bookmarked ? "🔖" : "🔲"}
                  </button>
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
          <button>View all trends →</button>
        </div>

        <div className="panel-card">
          <h3>👥 Suggested Users</h3>

          {["MeowMates", "FluffyPaws", "PurrfectCats"].map((user) => (
            <div className="suggested-user" key={user}>
              <span>🐱 {user}</span>
              <button onClick={() => handleFollow(user)}>
                {followedUsers.includes(user) ? "Following" : "Follow"}
              </button>
            </div>
          ))}

          <button>View more →</button>
        </div>

        <div className="panel-card quote-card">
          <h3>Daily Purrspiration</h3>
          <p>“Time spent with cats is never wasted.”</p>
          <span>– Sigmund Freud</span>
        </div>

        <div className="panel-card">
          <h3>Who to Follow</h3>

          {["KittyChronicles", "TheCatDaily", "MeowWorld"].map((user) => (
            <div className="suggested-user" key={user}>
              <span>🐾 {user}</span>
              <button onClick={() => handleFollow(user)}>
                {followedUsers.includes(user) ? "Following" : "Follow"}
              </button>
            </div>
          ))}
        </div>
      </aside>

      <button className="floating-paw" onClick={() => setShowCreatePost(true)}>
        🐾
      </button>

      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Preview" />
        </div>
      )}

      {showCreatePost && (
        <div className="create-modal">
          <form className="create-box" onSubmit={handleCreatePost}>
            <h2>Create New Cat Post 🐱</h2>

            <textarea
              placeholder="Write a caption..."
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
            />

            <input type="file" accept="image/*" onChange={handleImageUpload} />

            {newImage && <img src={newImage} alt="Preview" className="preview-img" />}

            <div className="modal-actions">
              <button type="button" onClick={() => setShowCreatePost(false)}>
                Cancel
              </button>
              <button type="submit">Publish Post</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Home;