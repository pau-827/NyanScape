import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreatePost.css";

function CreatePost() {
  const navigate = useNavigate();

  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [privacy, setPrivacy] = useState("Public");
  const [imagePreview, setImagePreview] = useState(null);
  const [drafts, setDrafts] = useState([
    {
      id: 1,
      title: "My sleepy baby 😴",
      time: "2 hours ago",
      image: "/cat.webp",
    },
    {
      id: 2,
      title: "Playtime fun! 🧶",
      time: "1 day ago",
      image: "/play.jpg",
    },
    {
      id: 3,
      title: "Sunbathing ☀️",
      time: "2 days ago",
      image: "/luna.webp",
    },
  ]);

  function handleFileChange(e) {
    const file = e.target.files[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setImagePreview(imageUrl);
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
      id: Date.now(),
      username: "CatLover_23",
      handle: "@catlover23",
      time: "Just now",
      title: caption,
      caption: caption,
      hashtags: tags
        ? tags.split(" ").filter((tag) => tag.trim() !== "")
        : ["#CatLife", "#NyanScape"],
      image: imagePreview,
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false,
      bookmarked: false,
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
      image: imagePreview || "/logo.png",
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
          <img src="/logo.png" alt="NyanScape Logo" />
          <div>
            <h1>NyanScape</h1>
            <p>Share. Connect. Meow.</p>
          </div>
        </div>

        <button onClick={() => navigate("/fyp")}>🏠 FYP</button>
        <button onClick={() => navigate("/explore")}>🔍 Explore</button>
        <button className="active">➕ Create Post</button>
        <button onClick={() => navigate("/fyp")}>🔖 Bookmarks</button>
        <button onClick={() => navigate("/profile")}>👤 My Profile</button>
        <button onClick={() => alert("You have 3 notifications!")}>
          🔔 Notifications
        </button>
        <button onClick={() => alert("Messages coming soon!")}>💬 Messages</button>
        <button onClick={() => alert("Settings coming soon!")}>⚙️ Settings</button>

        <button className="main-create-btn">+ Create Post</button>

        <div className="create-join-card">
          <img src="/logo.png" alt="Mascot" />
          <h3>Join NyanScape Community!</h3>
          <p>Share your cat stories, photos, and moments with fellow cat lovers!</p>
          <button onClick={() => alert("Invite link copied!")}>
            Invite Friends
          </button>
        </div>
      </aside>

      <main className="create-main">
        <div className="create-topbar">
          <input type="text" placeholder="Search cats, users, or tags..." />
          <button onClick={() => alert("Notifications opened!")}>🔔</button>
          <img src="/cat.webp" alt="User avatar" />
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
        <div className="tips-card">
          <h3>💡 Posting Tips</h3>

          <div className="tip">
            <span>📷</span>
            <div>
              <strong>Use high-quality photos</strong>
              <p>Clear photos get more love!</p>
            </div>
          </div>

          <div className="tip">
            <span>#</span>
            <div>
              <strong>Add relevant tags</strong>
              <p>Help others discover your post.</p>
            </div>
          </div>

          <div className="tip">
            <span>❤️</span>
            <div>
              <strong>Be authentic</strong>
              <p>Share your true cat moments!</p>
            </div>
          </div>

          <div className="tip">
            <span>😊</span>
            <div>
              <strong>Engage with community</strong>
              <p>Reply to comments and connect.</p>
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
              <button onClick={() => handleRemoveDraft(draft.id)}>⋮</button>
            </div>
          ))}
        </div>

        <div className="preview-card">
          <h3>👀 Post Preview</h3>
          <div className="preview-post">
            <div className="preview-user">
              <img src="/cat.webp" alt="User" />
              <div>
                <strong>CatLover_23</strong>
                <p>🌐 {privacy}</p>
              </div>
            </div>

            <p>{caption || "Your caption will appear here..."}</p>

            <p className="preview-tags">
              {tags || "#Caturday #CatLife #NyanScape"}
            </p>

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
          <p>“Cats are connoisseurs of comfort.”</p>
          <span>– James Herriot</span>
        </div>
      </aside>
    </div>
  );
}

export default CreatePost;