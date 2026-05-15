import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Explore from "./pages/Explore";
import Notifications from "./pages/Notifications";
import Messages from "./pages/Messages";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect */}
        <Route path="/" element={<Navigate to="/fyp" replace />} />

        {/* Main Pages */}
        <Route path="/fyp" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/settings" element={<Settings />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/fyp" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;