import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import catImg from "../assets/cat.webp";
import lunaImg from "../assets/luna.webp";
import playImg from "../assets/play.jpg";
import logoImg from "../assets/logo.png";

function Explore() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("forYou");
  const [selectedImage, setSelectedImage] = useState(null);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);

  const hashtags = [
    { tag: "#Caturday", count: "2.1K posts" },
    { tag: "#CatLife", count: "1.8K posts" },
    { tag: "#NyanScape", count: "1.5K posts" },
    { tag: "#WhiskerWednesday", count: "980 posts" },
    { tag: "#AdoptDontShop", count: "870 posts" },
  ];

  const posts = [
    {
      id: 1,
      username: "WhiskerMom",
      time: "2h ago",
      title: "Sunbathing is my cardio ☀️🐱",
      tags: "#CatLife #SunnyDay #NyanScape",
      image: catImg,
      likes: 124,
      comments: 18,
      shares: 12,
    },
    {
      id: 2,
      username: "PawHunter",
      time: "4h ago",
      title: "Meet Luna! She's always curious about everything!",
      tags: "#MeetLuna #CuriousCat #NyanScape",
      image: lunaImg,
      likes: 98,
      comments: 12,
      shares: 7,
    },
    {
      id: 3,
      username: "CatLover_23",
      time: "6h ago",
      title: "Playtime is the best time! 🧶🐱",
      tags: "#Playtime #HappyCat #NyanScape",
      image: playImg,
      likes: 76,
      comments: 9,
      shares: 5,
    },
    {
      id: 4,
      username: "MeowMagic",
      time: "8h ago",
      title: "Fluffy mood activated 🐱",
      tags: "#FluffyCat #Mood #NyanScape",
      image: catImg,
      likes: 62,
      comments: 7,
      shares: 3,
    },
    {
      id: 5,
      username: "PurrfectShots",
      time: "10h ago",
      title: "Watching the world go by 🌎",
      tags: "#WindowView #CatLife #NyanScape",
      image: lunaImg,
      likes: 55,
      comments: 6,
      shares: 4,
    },
    {
      id: 6,
      username: "KittyChronicles",
      time: "12h ago",
      title: "Brotherly love 💞",
      tags: "#SiblingCats #Love #NyanScape",
      image: playImg,
      likes: 112,
      comments: 14,
      shares: 9,
    },
  ];

  const users = [
    "MeowMates",
    "FluffyPaws",
    "PurrfectCats",
    "TheCatDaily",
    "MeowWorld",
  ];

  const filteredPosts = useMemo(() => {
    let result = posts.filter((post) => {
      const text = `${post.username} ${post.title} ${post.tags}`.toLowerCase();
      return text.includes(search.toLowerCase());
    });

    if (activeTab === "trending") {
      result = [...result].sort((a, b) => b.likes - a.likes);
    }

    if (activeTab === "recent") {
      result = [...result].sort((a, b) => b.id - a.id);
    }

    if (activeTab === "people") {
      result = result.filter((post) =>
        post.username.toLowerCase().includes(search.toLowerCase())
      );
    }

    return result;
  }, [search, activeTab]);

  function toggleLike(id) {
    setLikedPosts((prev) =>
      prev.includes(id)
        ? prev.filter((postId) => postId !== id)
        : [...prev, id]
    );
  }

  function toggleSave(id) {
    setSavedPosts((prev) =>
      prev.includes(id)
        ? prev.filter((postId) => postId !== id)
        : [...prev, id]
    );
  }

  function sharePost(id) {
    navigator.clipboard.writeText(`${window.location.origin}/post/${id}`);
    alert("Post link copied!");
  }

  function commentPost() {
    const comment = prompt("Write your comment:");
    if (comment) {
      alert("Comment added!");
    }
  }

  function toggleFollow(user) {
    setFollowedUsers((prev) =>
      prev.includes(user)
        ? prev.filter((name) => name !== user)
        : [...prev, user]
    );
  }

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
        <button onClick={() => alert(`Saved posts: ${savedPosts.length}`)}>
          🔖 Bookmarks
        </button>
        <button onClick={() => navigate("/profile")}>👤 My Profile</button>
        <button onClick={() => alert("You have 3 notifications!")}>
          🔔 Notifications
        </button>
        <button onClick={() => alert("Messages coming soon!")}>💬 Messages</button>
        <button onClick={() => alert("Settings coming soon!")}>⚙️ Settings</button>

        <button className="create-post-btn" onClick={() => navigate("/create-post")}>
          + Create Post
        </button>

        <div className="join-box">
          <img src="/logo.png" alt="Cat mascot" />
          <h3>Join NyanScape Community!</h3>
          <p>Share your cat stories, photos, and moments with fellow cat lovers!</p>
          <button onClick={() => alert("Invite link copied!")}>
            Invite Friends
          </button>
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
          <button onClick={() => alert("Notifications opened!")}>🔔</button>
          <img src={catImg} alt="profile" />
        </div>

        <section className="explore-header">
          <h2>Explore ✨</h2>
          <p>Discover trending cats, popular posts, and new friends 🐾</p>

          <div className="explore-tabs">
            <button
              className={activeTab === "forYou" ? "active" : ""}
              onClick={() => setActiveTab("forYou")}
            >
              For You
            </button>
            <button
              className={activeTab === "trending" ? "active" : ""}
              onClick={() => setActiveTab("trending")}
            >
              Trending
            </button>
            <button
              className={activeTab === "recent" ? "active" : ""}
              onClick={() => setActiveTab("recent")}
            >
              Recent
            </button>
            <button
              className={activeTab === "people" ? "active" : ""}
              onClick={() => setActiveTab("people")}
            >
              People
            </button>
            <button
              className={activeTab === "tags" ? "active" : ""}
              onClick={() => setActiveTab("tags")}
            >
              Tags
            </button>
          </div>
        </section>

        <section className="hashtag-box">
          <div className="section-title">
            <h3>Trending Hashtags</h3>
            <button onClick={() => setSearch("#")}>See all →</button>
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
            <h3>Popular Posts</h3>
            <button onClick={() => setActiveTab("trending")}>See all →</button>
          </div>

          {filteredPosts.length === 0 ? (
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
                      <strong>{post.username}</strong>
                      <p>{post.time}</p>
                    </div>
                    <button onClick={() => toggleSave(post.id)}>
                      {savedPosts.includes(post.id) ? "🔖" : "•••"}
                    </button>
                  </div>

                  <img
                    src={post.image}
                    alt={post.title}
                    onClick={() => setSelectedImage(post.image)}
                  />

                  <h4>{post.title}</h4>
                  <p className="post-tags">{post.tags}</p>

                  <div className="card-actions">
                    <button onClick={() => toggleLike(post.id)}>
                      {likedPosts.includes(post.id) ? "❤️" : "🤍"}{" "}
                      {likedPosts.includes(post.id) ? post.likes + 1 : post.likes}
                    </button>
                    <button onClick={commentPost}>💬 {post.comments}</button>
                    <button onClick={() => sharePost(post.id)}>
                      ↗️ {post.shares}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="category-box">
          <h3>Explore by Categories</h3>

          <div className="category-row">
            {["Cute Cats", "Funny Cats", "Sleepy Cats", "Kittens", "Cat Photography"].map(
              (category) => (
                <button key={category} onClick={() => setSearch(category)}>
                  🐱 {category}
                </button>
              )
            )}
          </div>
        </section>

        <section className="suggested-bottom">
          <div className="section-title">
            <h3>Suggested Users</h3>
            <button onClick={() => alert("Showing all suggested users!")}>
              See all →
            </button>
          </div>

          <div className="user-row">
            {users.map((user) => (
              <div className="user-card" key={user}>
                <img src={catImg} alt={user} />
                <strong>{user}</strong>
                <p>@{user.toLowerCase()}</p>
                <button onClick={() => toggleFollow(user)}>
                  {followedUsers.includes(user) ? "Following" : "Follow"}
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <aside className="explore-right">
        <div className="right-card">
          <h3>🐾 Trending Tags</h3>
          {hashtags.map((item) => (
            <p key={item.tag} onClick={() => setSearch(item.tag)}>
              {item.tag} <span>{item.count}</span>
            </p>
          ))}
          <button onClick={() => setSearch("#")}>View all trends →</button>
        </div>

        <div className="right-card">
          <h3>Who to Follow</h3>
          {users.slice(2).map((user) => (
            <div className="mini-user" key={user}>
              <span>🐱 {user}</span>
              <button onClick={() => toggleFollow(user)}>
                {followedUsers.includes(user) ? "Following" : "Follow"}
              </button>
            </div>
          ))}
        </div>

        <div className="right-card quote">
          <h3>Daily Purrspiration</h3>
          <p>“Time spent with cats is never wasted.”</p>
          <span>– Sigmund Freud</span>
        </div>

        <div className="right-card">
          <h3>Popular Searches</h3>
          {["funny cats", "cute kittens", "black cat", "cat videos", "sleepy cats"].map(
            (item) => (
              <p key={item} onClick={() => setSearch(item)}>
                🔍 {item}
              </p>
            )
          )}
        </div>
      </aside>

      <button className="floating-paw" onClick={() => navigate("/create-post")}>
        🐾
      </button>

      {selectedImage && (
        <div className="image-preview" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Preview" />
        </div>
      )}
    </div>
  );
}

export default Explore;