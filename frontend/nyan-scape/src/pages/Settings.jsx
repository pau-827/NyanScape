import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../App.css";
import logoImg from "../assets/logo.png";

function Settings({ session }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Account");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    allowMessages: true,
    showOnlineStatus: true,
    privateAccount: false,
    twoFactor: false,
    darkMode: false,
  });

  useEffect(() => {
    async function fetchProfile() {
      const { data } = await supabase
        .from("profiles")
        .select("username, bio")
        .eq("id", session.user.id)
        .single();
      if (data) {
        setDisplayName(data.username || "");
        setBio(data.bio || "");
      }
    }
    fetchProfile();
  }, [session]);

  function toggleSetting(key) {
    setSettings({ ...settings, [key]: !settings[key] });
  }

  async function handleSave() {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ username: displayName, bio })
      .eq("id", session.user.id);
    setSaving(false);
    if (error) alert("Failed to save: " + error.message);
    else alert("Settings saved successfully! 🐱");
  }

  async function handleLogout() {
    const confirmLogout = window.confirm("Do you want to log out?");
    if (confirmLogout) {
      await supabase.auth.signOut();
      navigate("/login");
    }
  }

  function handleDeleteAccount() {
    window.confirm("This action is permanent. Delete account?") &&
      alert("Please contact support to delete your account.");
  }

  const tabs = ["Account", "Privacy", "Notifications", "Appearance", "General", "Security"];

  return (
    <div className="settings-page">
      <aside className="settings-sidebar">
        <div className="settings-brand" onClick={() => navigate("/fyp")}>
          <img src={logoImg} alt="NyanScape Logo" />
          <h1>NyanScape</h1>
        </div>
        <button className="nav-link" onClick={() => navigate("/fyp")}>🏠 FYP</button>
        <button className="nav-link" onClick={() => navigate("/explore")}>🔍 Explore</button>
        <button className="nav-link" onClick={() => navigate("/create-post")}>➕ Create Post</button>
        <button className="nav-link" onClick={() => navigate("/profile")}>👤 My Profile</button>
        <button className="nav-link" onClick={() => navigate("/notifications")}>🔔 Notifications</button>
        <button className="nav-link" onClick={() => navigate("/messages")}>💬 Messages</button>
        <button className="nav-link active">⚙️ Settings</button>
        <div className="settings-join-card">
          <img src={logoImg} alt="Mascot" />
          <h3>Join NyanScape Community!</h3>
          <p>Share your cat stories, photos, and moments with fellow cat lovers!</p>
        </div>
      </aside>

      <main className="settings-main">
        <div className="settings-topbar">
          <input type="text" placeholder="Search cats, users, or tags..." />
          <strong>{displayName}</strong>
        </div>

        <header className="settings-header">
          <h2>Settings ⚙️</h2>
          <p>Manage your account, preferences, and more.</p>
        </header>

        <div className="settings-tabs">
          {tabs.map((tab) => (
            <button key={tab} className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Account" && (
          <>
            <section className="settings-card">
              <div className="section-title">
                <h3>Profile Information</h3>
                <button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
              </div>
              <div className="settings-fields">
                <div className="two-cols">
                  <label>
                    Display Name
                    <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                  </label>
                </div>
                <label>
                  Bio
                  <textarea maxLength="150" value={bio} onChange={(e) => setBio(e.target.value)} />
                  <span>{bio.length}/150</span>
                </label>
                <div className="email-row">
                  <strong>Email</strong>
                  <p>{session.user.email}</p>
                  <span>Verified ✓</span>
                </div>
              </div>
            </section>

            <section className="settings-card">
              <h3>Account Preferences</h3>
              <SettingSwitch title="Email Notifications" description="Receive email updates about your activity." value={settings.emailNotifications} onClick={() => toggleSetting("emailNotifications")} />
              <SettingSwitch title="Push Notifications" description="Receive push notifications on your device." value={settings.pushNotifications} onClick={() => toggleSetting("pushNotifications")} />
              <SettingSwitch title="Allow Messages from Others" description="Let other users send you messages." value={settings.allowMessages} onClick={() => toggleSetting("allowMessages")} />
              <SettingSwitch title="Show Online Status" description="Let others see when you're online." value={settings.showOnlineStatus} onClick={() => toggleSetting("showOnlineStatus")} />
            </section>

            <section className="danger-card">
              <h3>⚠️ Danger Zone</h3>
              <p>These actions are permanent and cannot be undone.</p>
              <div className="danger-row">
                <div><strong>Delete Account</strong><p>Permanently delete your account and all your data.</p></div>
                <button onClick={handleDeleteAccount}>Delete Account</button>
              </div>
            </section>
          </>
        )}

        {activeTab === "Privacy" && (
          <section className="settings-card">
            <h3>Privacy Settings</h3>
            <SettingSwitch title="Private Account" description="Only approved followers can view your posts." value={settings.privateAccount} onClick={() => toggleSetting("privateAccount")} />
            <SettingSwitch title="Show Online Status" description="Allow people to see when you are active." value={settings.showOnlineStatus} onClick={() => toggleSetting("showOnlineStatus")} />
            <button className="save-settings-btn" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Privacy Settings"}</button>
          </section>
        )}

        {activeTab === "Notifications" && (
          <section className="settings-card">
            <h3>Notification Settings</h3>
            <SettingSwitch title="Email Notifications" description="Receive email updates about your activity." value={settings.emailNotifications} onClick={() => toggleSetting("emailNotifications")} />
            <SettingSwitch title="Push Notifications" description="Receive app notifications." value={settings.pushNotifications} onClick={() => toggleSetting("pushNotifications")} />
            <button className="save-settings-btn" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Notification Settings"}</button>
          </section>
        )}

        {activeTab === "Appearance" && (
          <section className="settings-card">
            <h3>Appearance Settings</h3>
            <SettingSwitch title="Dark Mode" description="Switch between light and dark appearance." value={settings.darkMode} onClick={() => toggleSetting("darkMode")} />
            <button className="save-settings-btn" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Appearance"}</button>
          </section>
        )}

        {activeTab === "General" && (
          <section className="settings-card">
            <h3>General Settings</h3>
            <button className="simple-action" onClick={() => alert("Help Center opened!")}>Help Center</button>
            <button className="simple-action" onClick={() => alert("Privacy Policy opened!")}>Privacy Policy</button>
            <button className="simple-action" onClick={() => alert("Terms opened!")}>Terms of Service</button>
          </section>
        )}

        {activeTab === "Security" && (
          <section className="settings-card">
            <h3>Security Settings</h3>
            <SettingSwitch title="Two-Factor Authentication" description="Add an extra layer of security to your account." value={settings.twoFactor} onClick={() => toggleSetting("twoFactor")} />
            <button className="simple-action" onClick={() => alert("Password change: use Supabase email reset.")}>Change Password</button>
            <button className="save-settings-btn" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Security Settings"}</button>
          </section>
        )}
      </main>

      <aside className="settings-right">
        <div className="settings-right-card">
          <h3>👤 Account Overview</h3>
          <div className="overview-profile">
            <div style={{ fontSize: "2.5rem" }}>🐱</div>
            <div>
              <strong>{displayName}</strong>
              <p>{session.user.email}</p>
              <span>● Online</span>
            </div>
          </div>
        </div>
        <div className="settings-right-card">
          <h3>🔒 Privacy Shortcuts</h3>
          <button onClick={() => setActiveTab("Privacy")}>Who Can See My Posts ›</button>
          <button onClick={() => setActiveTab("Privacy")}>Who Can Comment ›</button>
        </div>
        <div className="settings-right-card">
          <h3>❔ Help & Support</h3>
          <button onClick={() => alert("Help Center opened!")}>Help Center ›</button>
          <button onClick={() => alert("Contact support opened!")}>Contact Support ›</button>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Log Out</button>
      </aside>
    </div>
  );
}

function SettingSwitch({ title, description, value, onClick }) {
  return (
    <div className="setting-switch">
      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
      <button className={value ? "switch on" : "switch"} onClick={onClick}>
        <span></span>
      </button>
    </div>
  );
}

export default Settings;
