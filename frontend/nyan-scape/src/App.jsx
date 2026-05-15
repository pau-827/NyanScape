import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Explore from "./pages/Explore";
import Notifications from "./pages/Notifications";
import Messages from "./pages/Messages";
import Login from "./pages/Login";
import Register from "./pages/Register";

import "./App.css";

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.5rem' }}>Loading... 🐱</div>;

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth pages - redirect to fyp if already logged in */}
        <Route path="/login" element={!session ? <Login /> : <Navigate to="/fyp" replace />} />
        <Route path="/register" element={!session ? <Register /> : <Navigate to="/fyp" replace />} />

        {/* Protected pages - redirect to login if not logged in */}
        <Route path="/" element={<Navigate to={session ? "/fyp" : "/login"} replace />} />
        <Route path="/fyp" element={session ? <Home session={session} /> : <Navigate to="/login" replace />} />
        <Route path="/explore" element={session ? <Explore session={session} /> : <Navigate to="/login" replace />} />
        <Route path="/create-post" element={session ? <CreatePost session={session} /> : <Navigate to="/login" replace />} />
        <Route path="/profile" element={session ? <Profile session={session} /> : <Navigate to="/login" replace />} />
        <Route path="/notifications" element={session ? <Notifications session={session} /> : <Navigate to="/login" replace />} />
        <Route path="/messages" element={session ? <Messages session={session} /> : <Navigate to="/login" replace />} />
        <Route path="/settings" element={session ? <Settings session={session} /> : <Navigate to="/login" replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to={session ? "/fyp" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
