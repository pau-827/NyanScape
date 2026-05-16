import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

import catImg from "../assets/cat.webp";
import lunaImg from "../assets/luna.webp";
import playImg from "../assets/play.jpg";
import logoImg from "../assets/logo.png";

function CreatePost() {
  const navigate = useNavigate();

  const savedProfile = JSON.parse(localStorage.getItem("nyanscape_profile")) || {};

  const [userAvatar, setUserAvatar] = useState(savedProfile.profilePhoto || catImg);
  const [userName, setUserName] = useState(savedProfile.displayName || "CatLover_23");
  const [userHandle, setUserHandle] = useState(savedProfile.username || "@catlover23");

  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [privacy, setPrivacy] = useState("Public");
  const [imagePreview, setImagePreview] = useState(null);

  const [drafts, setDrafts] = useState([
    { id: 1, title: "My sleepy baby 😴", time: "2 hours ago", image: catImg },
    { id: 2, title: "Playtime fun! 🧶", time: "1 day ago", image: playImg },
    { id: 3, title: "Sunbathing ☀️", time: "2 days ago", image: lunaImg },
  ]);

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

    return () => window.removeEventListener("storage", syncProfile);
  }, []);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result);
    };

    reader.readAsDataURL(file);
  }

  function handlePostNow(e) {
    e.preventDefault();

    if (!caption.trim()) {
      alert("Please write a caption first.");
      return;
    }

    if (!imagePreview) {
      alert("Please upload a cat photo.");
      return;
    }

    const savedPosts = JSON.parse(localStorage.getItem("nyanscape_posts")) || [];

    const newPost = {
      id: `post-${Date.now()}`,
      username: userName,
      handle: userHandle,
      time: "Just now",
      title: caption,
      caption,
      hashtags: tags
        ? tags.split(" ").filter((tag) => tag.trim() !== "")
        : ["#CatLife", "#NyanScape"],
      image: imagePreview,
      avatar: userAvatar,
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false,
      bookmarked: false,
      commentList: [],
      category: category || "General",
      privacy,
    };

    localStorage.setItem(
      "nyanscape_posts",
      JSON.stringify([newPost, ...savedPosts])
    );

    alert("Post published successfully!");
    navigate("/fyp");
  }

  function handleSaveDraft() {
    if (!caption.trim() && !imagePreview) {
      alert("Add a caption or image before saving a draft.");
      return;
    }

    const newDraft = {
      id: Date.now(),
      title: caption || "Untitled draft",
      time: "Just now",
      image: imagePreview || logoImg,
    };

    setDrafts([newDraft, ...drafts]);
    alert("Draft saved!");
  }

  function handleRemoveDraft(id) {
    setDrafts(drafts.filter((draft) => draft.id !== id));
  }

  function handleClearForm() {
    setCaption("");
    setTags("");
    setCategory("");
    setPrivacy("Public");
    setImagePreview(null);
  }

  return (
    <div className="create-page">
      <aside className="create-sidebar">
        <div className="create-brand" onClick={() => navigate("/fyp")}>
          <img src={logoImg} alt="NyanScape Logo" />
          <h1>NyanScape</h1>
        </div>

        <button className="nav-link" onClick={() => navigate("/fyp")}>🏠 FYP</button>
        <button className="nav-link" onClick={() => navigate("/explore")}>🔍 Explore</button>
        <button className="nav-link active">➕ Create Post</button>
        <button className="nav-link" onClick={() => navigate("/fyp")}>🔖 Bookmarks</button>
        <button className="nav-link" onClick={() => navigate("/profile")}>👤 My Profile</button>
        <button className="nav-link" onClick={() => navigate("/notif")}>🔔 Notifications</button>
        <button className="nav-link" onClick={() => navigate("/messages")}>💬 Messages</button>
        <button className="nav-link" onClick={() => navigate("/settings")}>⚙️ Settings</button>

        <button className="main-create-btn">+ Create Post</button>
      </aside>

      <main className="create-main">
        <div className="create-topbar">
          <input type="text" placeholder="Search cats, users, or tags..." />
          <button onClick={() => navigate("/notif")}>🔔</button>
          <img
            src={userAvatar}
            alt="User avatar"
            onClick={() => navigate("/profile")}
          />
          <strong>{userName}</strong>
        </div>

        <header className="create-header">
          <h2>Create a New Post 🐾</h2>
          <p>Share your cat moments with the world 🐱💜</p>
        </header>

        <form className="create-form-card" onSubmit={handlePostNow}>
          <label>What&apos;s on your mind?</label>
          <textarea
            maxLength="1000"
            placeholder="Share your cat story, thoughts, or moment..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <p className="count">{caption.length}/1000</p>

          <label>Add Photos / Videos</label>
          <div
            className="upload-box"
            onClick={() => document.getElementById("post-image").click()}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="big-preview" />
            ) : (
              <>
                <div className="upload-icon">☁️</div>
                <p>Drag & drop photos or videos here</p>
                <strong>or click to browse</strong>
                <span>JPG, PNG, MP4 up to 50MB</span>
              </>
            )}
          </div>

          <input
            id="post-image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            hidden
          />

          {imagePreview && (
            <button
              type="button"
              className="remove-photo"
              onClick={() => setImagePreview(null)}
            >
              Remove Photo
            </button>
          )}

          <label>Add Tags</label>
          <input
            type="text"
            placeholder="Example: #Caturday #CatLife #NyanScape"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          <div className="quick-tags">
            {["#Caturday", "#CatLife", "#NyanScape", "#CatLover"].map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() =>
                  setTags(tags.includes(tag) ? tags : `${tags} ${tag}`.trim())
                }
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="form-row">
            <div>
              <label>Choose a Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">🐾 Select a category</option>
                <option value="Cute Cats">Cute Cats</option>
                <option value="Funny Cats">Funny Cats</option>
                <option value="Sleepy Cats">Sleepy Cats</option>
                <option value="Kittens">Kittens</option>
                <option value="Cat Photography">Cat Photography</option>
              </select>
            </div>

            <div>
              <label>Who can see this?</label>
              <select value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
                <option value="Public">🌐 Public</option>
                <option value="Followers">👥 Followers Only</option>
                <option value="Private">🔒 Private</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="draft-btn" onClick={handleSaveDraft}>
              Save Draft
            </button>
            <button type="button" className="clear-btn" onClick={handleClearForm}>
              Clear
            </button>
            <button type="submit" className="publish-btn">
              🚀 Publish Post
            </button>
          </div>
        </form>
      </main>

      <aside className="create-right">
        <div className="preview-card">
          <h3>👀 Post Preview</h3>
          <div className="preview-post">
            <div className="preview-user">
              <img src={userAvatar} alt="User" />
              <div>
                <strong>{userName}</strong>
                <p>🌐 {privacy}</p>
              </div>
            </div>

            <p>{caption || "Your caption will appear here..."}</p>
            <p className="preview-tags">{tags || "#Caturday #CatLife #NyanScape"}</p>

            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="preview-photo" />
            ) : (
              <div className="preview-placeholder">Photo Preview</div>
            )}

            <div className="preview-actions">
              <span>♡ Like</span>
              <span>💬 Comment</span>
              <span>↗ Share</span>
            </div>
          </div>
        </div>

        <div className="draft-card">
          <div className="card-title">
            <h3>📝 Recent Drafts</h3>
            <button onClick={() => alert(`${drafts.length} drafts found`)}>
              View All
            </button>
          </div>

          {drafts.map((draft) => (
            <div className="draft-item" key={draft.id}>
              <img src={draft.image} alt={draft.title} />
              <div>
                <strong>{draft.title}</strong>
                <p>{draft.time}</p>
              </div>
              <button onClick={() => handleRemoveDraft(draft.id)}>×</button>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

export default CreatePost;