import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

import playImg from "../assets/play.jpg";
import lunaImg from "../assets/luna.webp";
import catImg from "../assets/cat.webp";
import logoImg from "../assets/logo.png";

function Home() {
  const navigate = useNavigate();

  const savedProfile = JSON.parse(localStorage.getItem("nyanscape_profile")) || {};

  const [userAvatar, setUserAvatar] = useState(savedProfile.profilePhoto || catImg);
  const [userName, setUserName] = useState(savedProfile.displayName || "CatLover_23");
  const [userHandle, setUserHandle] = useState(savedProfile.username || "@catlover23");

  const defaultPosts = [
    {
      id: "default-1",
      username: "WhiskerMom",
      handle: "@whiskermom",
      time: "2h ago",
      title: "Sunbathing is my cardio ☀️🐱",
      caption: "My cat loves relaxing by the window.",
      hashtags: ["#CatLife", "#SunnyDay", "#NyanScape"],
      image: catImg,
      likes: 124,
      comments: 18,
      shares: 12,
      liked: false,
      bookmarked: false,
      commentList: [],
    },
    {
      id: "default-2",
      username: "PawHunter",
      handle: "@pawhunter",
      time: "4h ago",
      title: "Meet Luna! 🌙 She loves boxes!",
      caption: "Luna found her new favorite cardboard box.",
      hashtags: ["#MeetLuna", "#CuriousCat", "#NyanScape"],
      image: lunaImg,
      likes: 98,
      comments: 12,
      shares: 7,
      liked: false,
      bookmarked: false,
      commentList: [],
    },
    {
      id: "default-3",
      username: "CatLover_23",
      handle: "@catlover23",
      time: "6h ago",
      title: "Playtime is the best time! 🧶🐱",
      caption: "A happy kitten enjoying playtime.",
      hashtags: ["#Playtime", "#HappyCat", "#NyanScape"],
      image: playImg,
      likes: 76,
      comments: 9,
      shares: 5,
      liked: false,
      bookmarked: false,
      commentList: [],
    },
  ];

  function getSavedPosts() {
    try {
      const savedPosts = JSON.parse(localStorage.getItem("nyanscape_posts")) || [];
      const savedIds = savedPosts.map((post) => post.id);

      const defaultWithoutDuplicates = defaultPosts.filter(
        (post) => !savedIds.includes(post.id)
      );

      return [...savedPosts, ...defaultWithoutDuplicates];
    } catch {
      return defaultPosts;
    }
  }

  const [posts, setPosts] = useState(getSavedPosts);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("forYou");
  const [selectedImage, setSelectedImage] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newCaption, setNewCaption] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [openComments, setOpenComments] = useState(null);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    function syncProfile() {
      const updatedProfile =
        JSON.parse(localStorage.getItem("nyanscape_profile")) || {};

      setUserAvatar(updatedProfile.profilePhoto || catImg);
      setUserName(updatedProfile.displayName || "CatLover_23");
      setUserHandle(updatedProfile.username || "@catlover23");
    }

    syncProfile();
    window.addEventListener("storage", syncProfile);

    return () => {
      window.removeEventListener("storage", syncProfile);
    };
  }, []);

  function savePosts(updatedPosts) {
    setPosts(updatedPosts);
    localStorage.setItem("nyanscape_posts", JSON.stringify(updatedPosts));
  }

  function addNotification(type, post, detail = "") {
    const savedNotifications =
      JSON.parse(localStorage.getItem("nyanscape_notifications")) || [];

    const newNotification = {
      id: Date.now(),
      type,
      user: userName,
      message:
        type === "likes"
          ? "liked your post."
          : type === "comments"
          ? "commented on your post:"
          : "interacted with your post.",
      detail,
      time: "Just now",
      avatar: userAvatar,
      image: post.image || catImg,
      unread: true,
    };

    localStorage.setItem(
      "nyanscape_notifications",
      JSON.stringify([newNotification, ...savedNotifications])
    );
  }

  function handleLike(id) {
    const targetPost = posts.find((post) => post.id === id);
    if (!targetPost) return;

    const updatedPosts = posts.map((post) =>
      post.id === id
        ? {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
          }
        : post
    );

    savePosts(updatedPosts);

    if (!targetPost.liked) {
      addNotification("likes", targetPost);
    }
  }

  function handleBookmark(id) {
    const updatedPosts = posts.map((post) =>
      post.id === id ? { ...post, bookmarked: !post.bookmarked } : post
    );

    savePosts(updatedPosts);
  }

  function handleShare(id) {
    const targetPost = posts.find((post) => post.id === id);
    if (!targetPost) return;

    navigator.clipboard.writeText(`${window.location.origin}/post/${id}`);

    const updatedPosts = posts.map((post) =>
      post.id === id ? { ...post, shares: post.shares + 1 } : post
    );

    savePosts(updatedPosts);
    alert("Post link copied!");
  }

  function handleComment(id) {
    setOpenComments(openComments === id ? null : id);
  }

  function submitComment(id) {
    if (!commentText.trim()) return;

    const targetPost = posts.find((post) => post.id === id);
    if (!targetPost) return;

    const newComment = {
      id: Date.now(),
      user: userName,
      text: commentText,
      time: "Just now",
      avatar: userAvatar,
    };

    const updatedPosts = posts.map((post) =>
      post.id === id
        ? {
            ...post,
            comments: post.comments + 1,
            commentList: [...(post.commentList || []), newComment],
          }
        : post
    );

    savePosts(updatedPosts);
    addNotification("comments", targetPost, commentText);
    setCommentText("");
  }

  function handleFollow(username) {
    setFollowedUsers((prev) =>
      prev.includes(username)
        ? prev.filter((user) => user !== username)
        : [...prev, username]
    );
  }

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setNewImage(reader.result);
    };

    reader.readAsDataURL(file);
  }

  function handleCreatePost(e) {
    e.preventDefault();

    if (!newCaption.trim() || !newImage) {
      alert("Please add a caption and image.");
      return;
    }

    const newPost = {
      id: `post-${Date.now()}`,
      username: userName,
      handle: userHandle,
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
      commentList: [],
    };

    savePosts([newPost, ...posts]);
    setNewCaption("");
    setNewImage(null);
    setShowCreatePost(false);
  }

  const filteredPosts = posts
    .filter((post) => {
      const searchText = `${post.title} ${post.caption} ${post.username} ${
        post.handle
      } ${post.hashtags.join(" ")}`.toLowerCase();

      return searchText.includes(search.toLowerCase());
    })
    .filter((post) => {
      if (activeTab === "bookmarks") return post.bookmarked;
      if (activeTab === "following") return followedUsers.includes(post.username);
      return true;
    })
    .sort((a, b) =>
      activeTab === "latest" ? String(b.id).localeCompare(String(a.id)) : 0
    );

  return (
    <div className="home-page">
      <aside className="sidebar">
        <div className="brand">
          <img src={logoImg} alt="NyanScape Logo" className="logo-img" />
          <h1>NyanScape</h1>
        </div>

        <nav>
          <button className="nav-link active" onClick={() => setActiveTab("forYou")}>
            🏠 FYP
          </button>

          <button className="nav-link" onClick={() => navigate("/explore")}>
            🔍 Explore
          </button>

          <button className="nav-link" onClick={() => navigate("/create-post")}>
            ➕ Create Post
          </button>

          <button className="nav-link" onClick={() => setActiveTab("bookmarks")}>
            🔖 Bookmarks
          </button>

          <button className="nav-link" onClick={() => navigate("/profile")}>
            👤 My Profile
          </button>

          <button className="nav-link" onClick={() => navigate("/notif")}>
            🔔 Notifications
          </button>

          <button className="nav-link" onClick={() => navigate("/messages")}>
            💬 Messages
          </button>

          <button className="nav-link" onClick={() => navigate("/settings")}>
            ⚙️ Settings
          </button>
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

          <span className="bell" onClick={() => navigate("/notif")}>
            🔔
          </span>

          <img
            src={userAvatar}
            alt="User"
            className="top-avatar"
            onClick={() => navigate("/profile")}
          />
        </div>

        <section className="feed-header">
          <div>
            <h2>FYP ✨</h2>
            <p>For You, purrfectly curated cat content 🐾</p>
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

        {filteredPosts.length === 0 ? (
          <div className="empty-state">
            <h3>No posts found 🐾</h3>
            <p>Try another search or create a new cat post.</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <article className="post-card" key={post.id}>
              <div className="post-menu">•••</div>

              <div className="post-user">
                <img
                  src={
                    post.username === userName || post.handle === userHandle
                      ? userAvatar
                      : post.image
                  }
                  alt={post.username}
                  className="user-avatar"
                />

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

              {openComments === post.id && (
                <div className="fb-comments">
                  <div className="fb-comment-input">
                    <img src={userAvatar} alt="User" />

                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") submitComment(post.id);
                      }}
                    />

                    <button onClick={() => submitComment(post.id)}>Post</button>
                  </div>

                  {(post.commentList || []).map((comment) => (
                    <div className="fb-comment" key={comment.id}>
                      <strong>{comment.user}</strong>
                      <p>{comment.text}</p>
                      <span>{comment.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))
        )}
      </main>

      <aside className="right-panel">
        <div className="panel-card">
          <h3>📈 Trending Tags</h3>
          <p>
            #Caturday <span>2.1K posts</span>
          </p>
          <p>
            #CatLife <span>1.8K posts</span>
          </p>
          <p>
            #NyanScape <span>1.5K posts</span>
          </p>
          <p>
            #WhiskerWednesday <span>980 posts</span>
          </p>
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

            {newImage && (
              <img src={newImage} alt="Preview" className="preview-img" />
            )}

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