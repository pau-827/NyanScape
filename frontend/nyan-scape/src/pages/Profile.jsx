import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

import catImg from "../assets/cat.webp";
import lunaImg from "../assets/luna.webp";
import playImg from "../assets/play.jpg";
import logoImg from "../assets/logo.png";
import cover from "../assets/cover.jpg";

function Profile() {
  const navigate = useNavigate();

  const savedProfile = JSON.parse(localStorage.getItem("nyanscape_profile")) || {};

  const [activeTab, setActiveTab] = useState("posts");
  const [selectedImage, setSelectedImage] = useState(null);

  const [profileName, setProfileName] = useState(
    savedProfile.displayName || "CatLover_23"
  );
  const [username, setUsername] = useState(
    savedProfile.username || "@catlover23"
  );
  const [avatar, setAvatar] = useState(savedProfile.profilePhoto || catImg);
  const [bio, setBio] = useState(
    savedProfile.bio ||
      "Cat lover, photographer, and proud cat parent of 2 fur babies. Sharing daily doses of purrs and paws!"
  );

  const defaultPosts = useMemo(
    () => [
      {
        id: "default-1",
        username: "CatLover_23",
        title: "Lazy Sunday",
        image: catImg,
        likes: 256,
        comments: 18,
        bookmarked: false,
        liked: false,
        draft: false,
      },
      {
        id: "default-2",
        username: "CatLover_23",
        title: "Playtime is the best time!",
        image: playImg,
        likes: 312,
        comments: 24,
        bookmarked: true,
        liked: true,
        draft: false,
      },
      {
        id: "default-3",
        username: "CatLover_23",
        title: "Watching the world go by",
        image: lunaImg,
        likes: 198,
        comments: 12,
        bookmarked: false,
        liked: false,
        draft: false,
      },
    ],
    []
  );

  function saveProfileData(nextProfile) {
    const currentProfile = JSON.parse(localStorage.getItem("nyanscape_profile")) || {};

    localStorage.setItem(
      "nyanscape_profile",
      JSON.stringify({
        ...currentProfile,
        ...nextProfile,
      })
    );
  }

  function getStoredPosts() {
    try {
      const savedPosts = JSON.parse(localStorage.getItem("nyanscape_posts")) || [];

      return savedPosts.filter(
        (post) => post.image && !String(post.image).startsWith("blob:")
      );
    } catch {
      return [];
    }
  }

  const initialPosts = useMemo(() => {
    const storedPosts = getStoredPosts();

    const createdPosts = storedPosts.filter(
      (post) => post.username === "You" || post.username === "CatLover_23"
    );

    return [...createdPosts, ...defaultPosts];
  }, [defaultPosts]);

  const [posts, setPosts] = useState(initialPosts);

  function updatePosts(updatedPosts) {
    setPosts(updatedPosts);
    localStorage.setItem("nyanscape_posts", JSON.stringify(updatedPosts));
  }

  function handleEditAvatar(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const imageData = reader.result;

      setAvatar(imageData);
      saveProfileData({ profilePhoto: imageData });
    };

    reader.readAsDataURL(file);
  }

  function handleLike(id) {
    const updatedPosts = posts.map((post) =>
      post.id === id
        ? {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
          }
        : post
    );

    updatePosts(updatedPosts);
  }

  function handleSave(id) {
    const updatedPosts = posts.map((post) =>
      post.id === id ? { ...post, bookmarked: !post.bookmarked } : post
    );

    updatePosts(updatedPosts);
  }

  function handleComment(id) {
    const comment = prompt("Write a comment:");
    if (!comment) return;

    const updatedPosts = posts.map((post) =>
      post.id === id ? { ...post, comments: post.comments + 1 } : post
    );

    updatePosts(updatedPosts);
    alert("Comment added!");
  }

  function handleShare(id) {
    navigator.clipboard.writeText(`${window.location.origin}/post/${id}`);
    alert("Post link copied!");
  }

  function handleEditProfile() {
    const newName = prompt("Enter your display name:", profileName);
    const newUsername = prompt("Enter your username:", username);
    const newBio = prompt("Enter your bio:", bio);

    const updatedName = newName?.trim() || profileName;
    const updatedUsername = newUsername?.trim() || username;
    const updatedBio = newBio?.trim() || bio;

    setProfileName(updatedName);
    setUsername(updatedUsername);
    setBio(updatedBio);

    saveProfileData({
      displayName: updatedName,
      username: updatedUsername,
      bio: updatedBio,
      profilePhoto: avatar,
    });
  }

  function handleDeletePost(id) {
    const confirmDelete = window.confirm("Delete this post?");
    if (!confirmDelete) return;

    const updatedPosts = posts.filter((post) => post.id !== id);
    updatePosts(updatedPosts);
  }

  const displayedPosts =
    activeTab === "posts"
      ? posts.filter((post) => !post.draft)
      : activeTab === "saved"
      ? posts.filter((post) => post.bookmarked)
      : activeTab === "liked"
      ? posts.filter((post) => post.liked)
      : posts.filter((post) => post.draft);

  return (
    <div className="profile-page">
      <aside className="profile-sidebar">
        <div className="profile-brand" onClick={() => navigate("/fyp")}>
          <img src={logoImg} alt="NyanScape Logo" />
          <h1>NyanScape</h1>
        </div>

        <button onClick={() => navigate("/fyp")}>🏠 FYP</button>
        <button onClick={() => navigate("/explore")}>🔍 Explore</button>
        <button onClick={() => navigate("/create-post")}>➕ Create Post</button>
        <button onClick={() => setActiveTab("saved")}>🔖 Bookmarks</button>

        <button className="active" onClick={() => navigate("/profile")}>
          👤 My Profile
        </button>

        <button onClick={() => navigate("/notif")}>🔔 Notifications</button>
        <button onClick={() => navigate("/messages")}>💬 Messages</button>
        <button onClick={() => navigate("/settings")}>⚙️ Settings</button>

        <button
          className="invite-btn"
          onClick={() => alert("Invite link copied!")}
        >
          🐾 Invite Friends
        </button>
      </aside>

      <main className="profile-main">
        <div className="profile-topbar">
          <input type="text" placeholder="Search cats, users, or tags..." />
          <button onClick={() => navigate("/notif")}>🔔</button>
          <img src={avatar} alt="User" />
          <strong>{profileName}</strong>
        </div>

        <section className="profile-card">
          <div className="cover-photo">
            <img src={cover} alt="Cover" />
            <button onClick={() => alert("Cover photo upload coming soon.")}>
              📷 Edit Cover
            </button>
          </div>

          <div className="profile-info">
            <div className="profile-avatar-wrap">
              <img src={avatar} alt="Profile" className="profile-avatar" />

              <label className="profile-camera-btn">
                📷
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditAvatar}
                  hidden
                />
              </label>
            </div>

            <div className="profile-text">
              <h2>{profileName}</h2>
              <p className="handle">{username}</p>
              <span className="badge">Cat Enthusiast 🐱</span>
              <p className="bio">{bio}</p>

              <div className="stats">
                <div>
                  <strong>{posts.filter((post) => !post.draft).length}</strong>
                  <span>Posts</span>
                </div>

                <div>
                  <strong>2.4K</strong>
                  <span>Followers</span>
                </div>

                <div>
                  <strong>560</strong>
                  <span>Following</span>
                </div>

                <div>
                  <strong>
                    {posts.reduce((total, post) => total + post.likes, 0)}
                  </strong>
                  <span>Likes</span>
                </div>
              </div>
            </div>

            <button className="edit-profile-btn" onClick={handleEditProfile}>
              👤 Edit Profile
            </button>
          </div>

          <div className="profile-tabs">
            <button
              className={activeTab === "posts" ? "active" : ""}
              onClick={() => setActiveTab("posts")}
            >
              ▦ Posts
            </button>

            <button
              className={activeTab === "saved" ? "active" : ""}
              onClick={() => setActiveTab("saved")}
            >
              🔖 Saved
            </button>

            <button
              className={activeTab === "liked" ? "active" : ""}
              onClick={() => setActiveTab("liked")}
            >
              ♡ Liked
            </button>

            <button
              className={activeTab === "drafts" ? "active" : ""}
              onClick={() => setActiveTab("drafts")}
            >
              📄 Drafts
            </button>
          </div>
        </section>

        <section className="profile-post-grid">
          {displayedPosts.length === 0 ? (
            <div className="profile-empty">
              <h3>No posts here yet 🐾</h3>
              <p>Create, like, or save posts to see them here.</p>
              <button onClick={() => navigate("/create-post")}>
                Create Post
              </button>
            </div>
          ) : (
            displayedPosts.map((post) => (
              <article className="profile-post-card" key={post.id}>
                <img
                  src={post.image}
                  alt={post.title}
                  onClick={() => setSelectedImage(post.image)}
                />

                <div className="profile-post-content">
                  <h3>{post.title}</h3>

                  <div className="profile-post-actions">
                    <button onClick={() => handleLike(post.id)}>
                      {post.liked ? "❤️" : "♡"} {post.likes}
                    </button>

                    <button onClick={() => handleComment(post.id)}>
                      💬 {post.comments}
                    </button>

                    <button onClick={() => handleShare(post.id)}>
                      ↗ Share
                    </button>

                    <button onClick={() => handleSave(post.id)}>
                      {post.bookmarked ? "🔖" : "🔲"}
                    </button>

                    <button onClick={() => handleDeletePost(post.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </main>

      <aside className="profile-right">
        <div className="right-profile-card">
          <h3>👤 About Me</h3>
          <p>📍 Cat City, Meowland</p>
          <p>📅 Joined March 2024</p>
          <p>🎂 Born on April 12</p>
          <p>🐾 2 Fur Babies: Luna & Milo</p>
          <button onClick={handleEditProfile}>Edit Details</button>
        </div>

        <div className="right-profile-card">
          <div className="right-title">
            <h3>🐾 My Fur Babies</h3>
            <button onClick={() => alert("Showing all fur babies!")}>
              View all
            </button>
          </div>

          <div className="fur-babies">
            <div>
              <img src={lunaImg} alt="Luna" />
              <strong>Luna 🐱</strong>
              <p>2 years old</p>
            </div>

            <div>
              <img src={catImg} alt="Milo" />
              <strong>Milo 🐱</strong>
              <p>1 year old</p>
            </div>
          </div>
        </div>
      </aside>

      {selectedImage && (
        <div
          className="profile-image-modal"
          onClick={() => setSelectedImage(null)}
        >
          <img src={selectedImage} alt="Preview" />
        </div>
      )}
    </div>
  );
}

export default Profile;