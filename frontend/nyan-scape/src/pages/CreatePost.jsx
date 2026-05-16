import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../lib/api";
import Sidebar from "../components/Sidebar";
import "../App.css";

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
      alert("Post published! 🐱");
      navigate("/fyp");
    } catch (err) {
      console.error("Post error:", err);
      alert("Failed to publish. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setCaption(""); setTags(""); setCategory(""); setPrivacy("Public");
    setImagePreview(null); setImageFile(null);
  }

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="page-main">
        <header className="page-header">
          <h2>Create a New Post 🐾</h2>
          <p>Share your cat moments with the world 🐱💜</p>
        </header>

        <form className="create-form-card" onSubmit={handlePostNow}>
          <label>What's on your mind?</label>
          <textarea maxLength="1000" placeholder="Share your cat story..."
            value={caption} onChange={(e) => setCaption(e.target.value)} />
          <p className="count">{caption.length}/1000</p>

          <label>Add Photo</label>
          <div className="upload-box" onClick={() => document.getElementById("post-image").click()}>
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="big-preview" />
            ) : (
              <>
                <div className="upload-icon">☁️</div>
                <p>Drag & drop or click to browse</p>
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
          <input type="text" placeholder="#Caturday #CatLife #NyanScape"
            value={tags} onChange={(e) => setTags(e.target.value)} />

          <div className="quick-tags">
            {["#Caturday", "#CatLife", "#NyanScape", "#CatLover"].map((tag) => (
              <button type="button" key={tag}
                onClick={() => setTags(tags.includes(tag) ? tags : `${tags} ${tag}`.trim())}>
                {tag}
              </button>
            ))}
          </div>

          <div className="form-row">
            <div>
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">🐾 Select a category</option>
                <option>Cute Cats</option>
                <option>Funny Cats</option>
                <option>Sleepy Cats</option>
                <option>Kittens</option>
                <option>Cat Photography</option>
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
            <button type="button" className="clear-btn" onClick={handleClear}>Clear</button>
            <button type="submit" className="publish-btn" disabled={loading}>
              {loading ? "Publishing..." : "🚀 Publish Post"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default CreatePost;
