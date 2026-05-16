import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Sidebar from "../components/Sidebar";
import "../App.css";

function Settings({ session }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Account");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true, pushNotifications: true,
    allowMessages: true, showOnlineStatus: true,
    privateAccount: false, twoFactor: false, darkMode: false,
  });

  useEffect(() => {
    async function fetchProfile() {
      const { data } = await supabase.from("profiles").select("username, bio").eq("id", session.user.id).single();
      if (data) { setDisplayName(data.username || ""); setBio(data.bio || ""); }
    }
    fetchProfile();
  }, [session]);

  function toggleSetting(key) { setSettings({ ...settings, [key]: !settings[key] }); }

  async function handleSave() {
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ username: displayName, bio }).eq("id", session.user.id);
    setSaving(false);
    if (error) alert("Failed to save: " + error.message);
    else alert("Settings saved! 🐱");
  }

  const tabs = ["Account", "Privacy", "Notifications", "Appearance", "General", "Security"];

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="page-main">
        <header className="page-header">
          <h2>Settings ⚙️</h2>
          <p>Manage your account, preferences, and more.</p>
        </header>

        <div className="settings-tabs">
          {tabs.map((tab) => (
            <button key={tab} className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>{tab}</button>
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
                  <label>Display Name<input value={displayName} onChange={(e) => setDisplayName(e.target.value)} /></label>
                </div>
                <label>Bio
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
              <SettingSwitch title="Email Notifications" description="Receive email updates." value={settings.emailNotifications} onClick={() => toggleSetting("emailNotifications")} />
              <SettingSwitch title="Push Notifications" description="Receive push notifications." value={settings.pushNotifications} onClick={() => toggleSetting("pushNotifications")} />
              <SettingSwitch title="Allow Messages" description="Let others send you messages." value={settings.allowMessages} onClick={() => toggleSetting("allowMessages")} />
            </section>
            <section className="danger-card">
              <h3>⚠️ Danger Zone</h3>
              <div className="danger-row">
                <div><strong>Delete Account</strong><p>Permanently delete your account.</p></div>
                <button onClick={() => alert("Please contact support to delete your account.")}>Delete Account</button>
              </div>
            </section>
          </>
        )}
        {activeTab === "Privacy" && (
          <section className="settings-card">
            <h3>Privacy Settings</h3>
            <SettingSwitch title="Private Account" description="Only followers can view your posts." value={settings.privateAccount} onClick={() => toggleSetting("privateAccount")} />
            <SettingSwitch title="Show Online Status" description="Let others see when you're active." value={settings.showOnlineStatus} onClick={() => toggleSetting("showOnlineStatus")} />
            <button className="save-settings-btn" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
          </section>
        )}
        {activeTab === "Notifications" && (
          <section className="settings-card">
            <h3>Notification Settings</h3>
            <SettingSwitch title="Email Notifications" description="Receive email updates." value={settings.emailNotifications} onClick={() => toggleSetting("emailNotifications")} />
            <SettingSwitch title="Push Notifications" description="Receive app notifications." value={settings.pushNotifications} onClick={() => toggleSetting("pushNotifications")} />
            <button className="save-settings-btn" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
          </section>
        )}
        {activeTab === "Appearance" && (
          <section className="settings-card">
            <h3>Appearance</h3>
            <SettingSwitch title="Dark Mode" description="Switch to dark appearance." value={settings.darkMode} onClick={() => toggleSetting("darkMode")} />
            <button className="save-settings-btn" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
          </section>
        )}
        {activeTab === "General" && (
          <section className="settings-card">
            <h3>General</h3>
            <button className="simple-action" onClick={() => alert("Help Center opened!")}>Help Center</button>
            <button className="simple-action" onClick={() => alert("Privacy Policy opened!")}>Privacy Policy</button>
          </section>
        )}
        {activeTab === "Security" && (
          <section className="settings-card">
            <h3>Security</h3>
            <SettingSwitch title="Two-Factor Authentication" description="Extra layer of security." value={settings.twoFactor} onClick={() => toggleSetting("twoFactor")} />
            <button className="save-settings-btn" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
          </section>
        )}
      </main>
    </div>
  );
}

function SettingSwitch({ title, description, value, onClick }) {
  return (
    <div className="setting-switch">
      <div><strong>{title}</strong><p>{description}</p></div>
      <button className={value ? "switch on" : "switch"} onClick={onClick}><span></span></button>
    </div>
  );
}

export default Settings;
