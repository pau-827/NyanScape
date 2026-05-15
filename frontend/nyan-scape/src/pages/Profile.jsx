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

  const [activeTab, setActiveTab] = useState("posts");
  const [selectedImage, setSelectedImage] = useState(null);
  const [profileName, setProfileName] = useState("CatLover_23");
  const [bio, setBio] = useState(
    "Cat lover, photographer, and proud cat parent of 2 fur babies 🐾 Sharing daily dose of purrs & paws! 💜"
  );

  const defaultPosts = [
    {
      id: 1,
      username: "CatLover_23",
      title: "Lazy Sunday ☀️",
      image: catImg,
      likes: 256,
      comments: 18,
      bookmarked: false,
      liked: false,
      draft: false,
    },
    {
      id: 2,
      username: "CatLover_23",
      title: "Playtime is the best time! 🧶",
      image: playImg,
      likes: 312,
      comments: 24,
      bookmarked: true,
      liked: true,
      draft: false,
    },
    {
      id: 3,
      username: "CatLover_23",
      title: "Watching the world go by 🌎",
      image: lunaImg,
      likes: 198,
      comments: 12,
      bookmarked: false,
      liked: false,
      draft: false,
    },
  ];

  const storedPosts = JSON.parse(localStorage.getItem("nyanscape_posts")) || [];

  const userPosts = useMemo(() => {
    const createdPosts = storedPosts.filter(
      (post) => post.username === "You" || post.username === "CatLover_23"
    );

    return [...createdPosts, ...defaultPosts];
  }, [storedPosts]);

  const [posts, setPosts] = useState(userPosts);

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

  function handleSave(id) {
    setPosts(
      posts.map((post) =>
        post.id === id
          ? { ...post, bookmarked: !post.bookmarked }
          : post
      )
    );
  }

  function handleComment(id) {
    const comment = prompt("Write a comment:");
    if (!comment) return;

    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, comments: post.comments + 1 } : post
      )
    );

    alert("Comment added!");
  }

  function handleShare(id) {
    navigator.clipboard.writeText(`${window.location.origin}/post/${id}`);
    alert("Post link copied!");
  }

  function handleEditProfile() {
    const newName = prompt("Enter your display name:", profileName);
    const newBio = prompt("Enter your bio:", bio);

    if (newName) setProfileName(newName);
    if (newBio) setBio(newBio);
  }

  function handleEditCover() {
    alert("Cover photo editing is ready for future upload feature.");
  }

  function handleEditAvatar() {
    alert("Profile photo editing is ready for future upload feature.");
  }

  function handleDeletePost(id) {
    const confirmDelete = confirm("Delete this post?");
    if (!confirmDelete) return;

    const updatedPosts = posts.filter((post) => post.id !== id);
    setPosts(updatedPosts);

    const updatedStoredPosts = storedPosts.filter((post) => post.id !== id);
    localStorage.setItem("nyanscape_posts", JSON.stringify(updatedStoredPosts));
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
        <button className="active">👤 My Profile</button>
        <button onClick={() => alert("You have 3 notifications!")}>
          🔔 Notifications
        </button>
        <button onClick={() => alert("Messages coming soon!")}>💬 Messages</button>
        <button onClick={() => alert("Settings coming soon!")}>⚙️ Settings</button>

        <button className="invite-btn" onClick={() => alert("Invite link copied!")}>
          🐾 Invite Friends
        </button>

        <div className="profile-join-card">
          <img src={logoImg}alt="Mascot" />
          <h3>Join NyanScape Community!</h3>
          <p>Share your cat stories, photos, and moments with fellow cat lovers!</p>
          <button onClick={() => alert("Invite link copied!")}>Invite Friends</button>
        </div>
      </aside>

      <main className="profile-main">
        <div className="profile-topbar">
          <input type="text" placeholder="Search cats, users, or tags..." />
          <button onClick={() => alert("Notifications opened!")}>🔔</button>
          <img src={catImg} alt="User" />
          <strong>{profileName}</strong>
        </div>

        <section className="profile-card">
          <div className="cover-photo">
            <img src={cover} alt="Cover" />
            <button onClick={handleEditCover}>📷 Edit Cover</button>
          </div>

          <div className="profile-info">
            <div className="profile-avatar-wrap">
              <img src={catImg} alt="Profile" className="profile-avatar" />
              <button onClick={handleEditAvatar}>📷</button>
            </div>

            <div className="profile-text">
              <h2>{profileName}</h2>
              <p className="handle">@catlover23</p>
              <span className="badge">Cat Enthusiast 🐱</span>
              <p className="bio">{bio}</p>

              <div className="stats">
                <div>
                  <strong>{posts.length}</strong>
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
              <button onClick={() => navigate("/create-post")}>Create Post</button>
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
                    <button onClick={() => handleShare(post.id)}>↗ Share</button>
                    <button onClick={() => handleSave(post.id)}>
                      {post.bookmarked ? "🔖" : "🔲"}
                    </button>
                    <button onClick={() => handleDeletePost(post.id)}>•••</button>
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
            <button onClick={() => alert("Showing all fur babies!")}>View all</button>
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

        <div className="right-profile-card">
          <div className="right-title">
            <h3># Top Tags</h3>
            <button onClick={() => alert("Showing all tags!")}>View all</button>
          </div>

          <div className="tag-list">
            <span>#Caturday<br />234 posts</span>
            <span>#CatLife<br />189 posts</span>
            <span>#NyanScape<br />156 posts</span>
            <span>#CatLover<br />98 posts</span>
          </div>
        </div>

        <div className="right-profile-card progress-card">
          <h3># Profile Progress</h3>
          <div className="progress-circle">80%</div>
          <strong>Great job!</strong>
          <p>Complete your profile to get more followers.</p>
          <button onClick={handleEditProfile}>Complete Now</button>
        </div>
      </aside>

      {selectedImage && (
        <div className="profile-image-modal" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Preview" />
        </div>
      )}
    </div>
  );
}

export default Profile;