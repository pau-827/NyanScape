import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

import catImg from "../assets/cat.webp";
import logoImg from "../assets/logo.png";

function Settings() {
  const navigate = useNavigate();

  const savedProfile = JSON.parse(localStorage.getItem("nyanscape_profile")) || {};

  const [activeTab, setActiveTab] = useState("Account");
  const [displayName, setDisplayName] = useState(
    savedProfile.displayName || "CatLover_23"
  );
  const [username, setUsername] = useState(
    savedProfile.username || "@catlover23"
  );
  const [bio, setBio] = useState(
    savedProfile.bio ||
      "Cat lover, photographer, and proud cat parent of 2 fur babies. Sharing daily doses of purrs and paws!"
  );
  const [email] = useState(savedProfile.email || "catlover23@email.com");
  const [profilePhoto, setProfilePhoto] = useState(
    savedProfile.profilePhoto || catImg
  );

  const [settings, setSettings] = useState(
    savedProfile.settings || {
      emailNotifications: true,
      pushNotifications: true,
      allowMessages: true,
      showOnlineStatus: true,
      privateAccount: false,
      twoFactor: false,
      darkMode: false,
    }
  );

  function toggleSetting(key) {
    setSettings({ ...settings, [key]: !settings[key] });
  }

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfilePhoto(reader.result);
    };

    reader.readAsDataURL(file);
  }

  function handleSave() {
    const profileData = {
      displayName,
      username,
      bio,
      email,
      profilePhoto,
      settings,
    };

    localStorage.setItem("nyanscape_profile", JSON.stringify(profileData));
    alert("Settings saved successfully!");
  }

  function handleLogout() {
    const confirmLogout = window.confirm("Do you want to log out?");
    if (confirmLogout) {
      navigate("/login");
    }
  }

  const tabs = [
    "Account",
    "Privacy",
    "Notifications",
    "Appearance",
    "General",
    "Security",
  ];

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
        <button className="nav-link" onClick={() => navigate("/fyp")}>🔖 Bookmarks</button>
        <button className="nav-link" onClick={() => navigate("/profile")}>👤 My Profile</button>
        <button className="nav-link" onClick={() => navigate("/notif")}>🔔 Notifications</button>
        <button className="nav-link" onClick={() => navigate("/messages")}>💬 Messages</button>
        <button className="nav-link active">⚙️ Settings</button>
      </aside>

      <main className="settings-main">
        <div className="settings-topbar">
          <input type="text" placeholder="Search cats, users, or tags..." />
          <button onClick={() => navigate("/notif")}>🔔</button>
          <img src={profilePhoto} alt="User" />
          <strong>{displayName}</strong>
        </div>

        <header className="settings-header">
          <h2>Settings ⚙️</h2>
          <p>Manage your account, preferences, and more.</p>
        </header>

        <div className="settings-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Account" && (
          <>
            <section className="settings-card">
              <div className="section-title">
                <h3>Profile Information</h3>
                <button onClick={handleSave}>Save Profile</button>
              </div>

              <div className="profile-settings-row">
                <div className="profile-photo-wrap">
                  <img src={profilePhoto} alt="Profile" />
                  <label>
                    📷
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handlePhotoChange}
                    />
                  </label>
                </div>

                <div className="settings-fields">
                  <div className="two-cols">
                    <label>
                      Display Name
                      <input
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                      />
                    </label>

                    <label>
                      Username
                      <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </label>
                  </div>

                  <label>
                    Bio
                    <textarea
                      maxLength="150"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                    <span>{bio.length}/150</span>
                  </label>

                  <div className="email-row">
                    <strong>Email</strong>
                    <p>{email}</p>
                    <span>Verified ✓</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="settings-card">
              <h3>Account Preferences</h3>

              <SettingSwitch
                title="Email Notifications"
                description="Receive email updates about your activity."
                value={settings.emailNotifications}
                onClick={() => toggleSetting("emailNotifications")}
              />

              <SettingSwitch
                title="Push Notifications"
                description="Receive push notifications on your device."
                value={settings.pushNotifications}
                onClick={() => toggleSetting("pushNotifications")}
              />

              <SettingSwitch
                title="Allow Messages From Others"
                description="Let other users send you messages."
                value={settings.allowMessages}
                onClick={() => toggleSetting("allowMessages")}
              />

              <SettingSwitch
                title="Show Online Status"
                description="Let others see when you're online."
                value={settings.showOnlineStatus}
                onClick={() => toggleSetting("showOnlineStatus")}
              />

              <button className="save-settings-btn" onClick={handleSave}>
                Save Account Settings
              </button>
            </section>
          </>
        )}

        {activeTab === "Privacy" && (
          <section className="settings-card">
            <h3>Privacy Settings</h3>

            <SettingSwitch
              title="Private Account"
              description="Only approved followers can view your posts."
              value={settings.privateAccount}
              onClick={() => toggleSetting("privateAccount")}
            />

            <SettingSwitch
              title="Show Online Status"
              description="Allow people to see when you are active."
              value={settings.showOnlineStatus}
              onClick={() => toggleSetting("showOnlineStatus")}
            />

            <button className="save-settings-btn" onClick={handleSave}>
              Save Privacy Settings
            </button>
          </section>
        )}

        {activeTab === "Notifications" && (
          <section className="settings-card">
            <h3>Notification Settings</h3>

            <SettingSwitch
              title="Email Notifications"
              description="Receive email updates about your activity."
              value={settings.emailNotifications}
              onClick={() => toggleSetting("emailNotifications")}
            />

            <SettingSwitch
              title="Push Notifications"
              description="Receive app notifications."
              value={settings.pushNotifications}
              onClick={() => toggleSetting("pushNotifications")}
            />

            <button className="save-settings-btn" onClick={handleSave}>
              Save Notification Settings
            </button>
          </section>
        )}

        {activeTab === "Appearance" && (
          <section className="settings-card">
            <h3>Appearance Settings</h3>

            <SettingSwitch
              title="Dark Mode"
              description="Switch between light and dark appearance."
              value={settings.darkMode}
              onClick={() => toggleSetting("darkMode")}
            />

            <button className="save-settings-btn" onClick={handleSave}>
              Save Appearance
            </button>
          </section>
        )}

        {activeTab === "General" && (
          <section className="settings-card">
            <h3>General Settings</h3>

            <button className="simple-action" onClick={() => alert("Cache cleared!")}>
              Clear App Cache
            </button>

            <button className="simple-action" onClick={() => alert("Help Center opened!")}>
              Help Center
            </button>
          </section>
        )}

        {activeTab === "Security" && (
          <section className="settings-card">
            <h3>Security Settings</h3>

            <SettingSwitch
              title="Two-Factor Authentication"
              description="Add an extra layer of security to your account."
              value={settings.twoFactor}
              onClick={() => toggleSetting("twoFactor")}
            />

            <button className="simple-action" onClick={() => alert("Password change opened!")}>
              Change Password
            </button>

            <button className="save-settings-btn" onClick={handleSave}>
              Save Security Settings
            </button>
          </section>
        )}
      </main>

      <aside className="settings-right">
        <div className="settings-right-card">
          <h3>👤 Account Overview</h3>

          <div className="overview-profile">
            <img src={profilePhoto} alt="User" />
            <div>
              <strong>{displayName}</strong>
              <p>{username}</p>
              <span>● Online</span>
            </div>
          </div>

          <p>📅 Member Since <strong>March 15, 2024</strong></p>
          <p>📝 Posts <strong>28</strong></p>
          <p>👥 Followers <strong>2.4K</strong></p>
          <p>❤️ Likes Received <strong>3.1K</strong></p>
        </div>

        <div className="settings-right-card">
          <h3>🔒 Privacy Shortcuts</h3>
          <button onClick={() => setActiveTab("Privacy")}>Blocked Users ›</button>
          <button onClick={() => setActiveTab("Privacy")}>Muted Users ›</button>
          <button onClick={() => setActiveTab("Privacy")}>Who Can See My Posts ›</button>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Log Out
        </button>
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