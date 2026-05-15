import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../lib/api";
import "../App.css";
import logoImg from "../assets/logo.png";

function CreatePost({ session }) {
  const navigate = useNavigate();
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [privacy, setPrivacy] = useState("Public");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handlePostNow(e) {
    e.preventDefault();
    if (!caption.trim()) { alert("Please write a caption first."); return; }
    if (!imageFile) { alert("Please upload a cat photo."); return; }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("caption", `${caption} ${tags}`.trim());
      formData.append("user_id", session.user.id);
      await createPost(formData);
      alert("Post published successfully! 🐱");
      navigate("/fyp");
    } catch (err) {
      console.error("Post error:", err);
      alert("Failed to publish post. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  function handleClearForm() {
    setCaption("");
    setTags("");
    setCategory("");
    setPrivacy("Public");
    setImagePreview(null);
    setImageFile(null);
  }

  return (
    <div className="create-page">
      <aside className="create-sidebar">
        <div className="create-brand" onClick={() => navigate("/fyp")}>
          <img src={logoImg} alt="NyanScape Logo" />
          <div><h1>NyanScape</h1></div>
        </div>

        <button onClick={() => navigate("/fyp")}>🏠 FYP</button>
        <button onClick={() => navigate("/explore")}>🔍 Explore</button>
        <button className="active">➕ Create Post</button>
        <button onClick={() => navigate("/profile")}>👤 My Profile</button>
        <button onClick={() => navigate("/notifications")}>🔔 Notifications</button>
        <button onClick={() => navigate("/messages")}>💬 Messages</button>
        <button onClick={() => navigate("/settings")}>⚙️ Settings</button>
        <button className="main-create-btn">+ Create Post</button>
      </aside>

      <main className="create-main">
        <div className="create-topbar">
          <input type="text" placeholder="Search cats, users, or tags..." />
        </div>

        <header className="create-header">
          <h2>Create a New Post 🐾</h2>
          <p>Share your cat moments with the world 🐱💜</p>
        </header>

        <form className="create-form-card" onSubmit={handlePostNow}>
          <label>What's on your mind?</label>
          <textarea
            maxLength="1000"
            placeholder="Share your cat story, thoughts, or moment..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <p className="count">{caption.length}/1000</p>

          <label>Add Photos</label>
          <div className="upload-box" onClick={() => document.getElementById("post-image").click()}>
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="big-preview" />
            ) : (
              <>
                <div className="upload-icon">☁️</div>
                <p>Drag & drop photos here</p>
                <strong>or click to browse</strong>
                <span>JPG, PNG up to 50MB</span>
              </>
            )}
          </div>

          <input id="post-image" type="file" accept="image/*" onChange={handleFileChange} hidden />

          {imagePreview && (
            <button type="button" className="remove-photo" onClick={() => { setImagePreview(null); setImageFile(null); }}>
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
              <button type="button" key={tag} onClick={() => setTags(tags.includes(tag) ? tags : `${tags} ${tag}`.trim())}>
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
            <button type="button" className="clear-btn" onClick={handleClearForm}>Clear</button>
            <button type="submit" className="publish-btn" disabled={loading}>
              {loading ? "Publishing..." : "🚀 Publish Post"}
            </button>
          </div>
        </form>
      </main>

      <aside className="create-right">
        <div className="tips-card">
          <h3>💡 Posting Tips</h3>
          <div className="tip"><span>📷</span><div><strong>Use high-quality photos</strong><p>Clear photos get more love!</p></div></div>
          <div className="tip"><span>#</span><div><strong>Add relevant tags</strong><p>Help others discover your post.</p></div></div>
          <div className="tip"><span>❤️</span><div><strong>Be authentic</strong><p>Share your true cat moments!</p></div></div>
          <div className="tip"><span>😊</span><div><strong>Engage with community</strong><p>Reply to comments and connect.</p></div></div>
        </div>

        <div className="preview-card">
          <h3>👀 Post Preview</h3>
          <div className="preview-post">
            <div className="preview-user">
              <div>
                <strong>{session?.user?.email?.split("@")[0] || "You"}</strong>
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

        <div className="quote-card-create">
          <h3>🐾 Daily Purrspiration</h3>
          <p>"Cats are connoisseurs of comfort."</p>
          <span>– James Herriot</span>
        </div>
      </aside>
    </div>
  );
}

export default CreatePost;
