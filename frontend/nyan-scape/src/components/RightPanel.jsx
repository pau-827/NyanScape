import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../lib/api";

const CAT_QUOTES = [
  { quote: "Time spent with cats is never wasted.", author: "Sigmund Freud" },
  { quote: "Cats are connoisseurs of comfort.", author: "James Herriot" },
  { quote: "A happy cat makes for a happy human.", author: "Unknown" },
  { quote: "In ancient times, cats were worshipped as gods. They have not forgotten this.", author: "Terry Pratchett" },
  { quote: "Cats choose us; we don't own them.", author: "Kristin Cast" },
  { quote: "The smallest feline is a masterpiece.", author: "Leonardo da Vinci" },
  { quote: "Cats are a mysterious kind of folk.", author: "Sir Walter Scott" },
];

const TRENDING = [
  { tag: "#Caturday", count: "2.1K" },
  { tag: "#CatLife", count: "1.8K" },
  { tag: "#NyanScape", count: "1.5K" },
  { tag: "#WhiskerWednesday", count: "980" },
  { tag: "#AdoptDontShop", count: "870" },
];

function RightPanel({ session }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const todayQuote = CAT_QUOTES[new Date().getDate() % CAT_QUOTES.length];

  useEffect(() => {
    if (!session?.user?.id) return;
    async function fetchProfile() {
      try {
        const res = await getProfile(session.user.id);
        setProfile(res.data);
        if (res.data.avatar_url) setAvatarUrl(res.data.avatar_url);
      } catch (err) {
        console.error("RightPanel profile fetch error:", err);
      }
    }
    fetchProfile();
  }, [session]);

  return (
    <aside className="right-panel-fixed">

      {/* Mini Profile Card */}
      <div className="rp-card rp-profile-card" onClick={() => navigate("/profile")}>
        <div className="rp-avatar-large">
          {avatarUrl ? (
            <img src={avatarUrl} alt="avatar" />
          ) : <span>🐱</span>}
        </div>
        <strong className="rp-username">{profile?.username || session?.user?.email?.split("@")[0] || "You"}</strong>
        <p className="rp-bio">{profile?.bio ? (profile.bio.length > 60 ? profile.bio.slice(0, 60) + "..." : profile.bio) : "No bio yet."}</p>
        <button className="rp-profile-btn" onClick={() => navigate("/profile")}>View Profile</button>
      </div>

      {/* Trending Hashtags */}
      <div className="rp-card">
        <h3 className="rp-card-title">📈 Trending</h3>
        <div className="rp-tags-list">
          {TRENDING.map((item, i) => (
            <div key={item.tag} className="rp-tag-row">
              <div>
                <span className="rp-tag-num">{i + 1}</span>
                <span className="rp-tag">{item.tag}</span>
              </div>
              <span className="rp-tag-count">{item.count} posts</span>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Cat Quote */}
      <div className="rp-card rp-quote-card">
        <div className="rp-quote-icon">🐾</div>
        <h3 className="rp-card-title">Daily Purrspiration</h3>
        <p className="rp-quote">"{todayQuote.quote}"</p>
        <span className="rp-quote-author">– {todayQuote.author}</span>
      </div>

      {/* Footer links */}
      <div className="rp-footer">
        <span>About</span>
        <span>·</span>
        <span>Privacy</span>
        <span>·</span>
        <span>Terms</span>
        <p>© {new Date().getFullYear()} NyanScape 🐱</p>
      </div>

    </aside>
  );
}

export default RightPanel;
