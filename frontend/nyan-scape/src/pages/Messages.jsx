import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import logoImg from "../assets/logo.png";

function Messages({ session }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [messageText, setMessageText] = useState("");
  const [selectedChatId, setSelectedChatId] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  const [chats, setChats] = useState([
    {
      id: 1, name: "WhiskerMom", handle: "@whiskermom", status: "Online",
      time: "2m ago", unread: 2, lastMessage: "Awww so cute! 😻",
      messages: [
        { id: 1, sender: "them", text: "Hey there! 👋", time: "10:30 AM" },
        { id: 2, sender: "them", text: "I just saw your post about Luna. She's absolutely adorable! 🥰", time: "10:30 AM" },
        { id: 3, sender: "me", text: "Hi! Thank you so much! 😺💜", time: "10:32 AM" },
        { id: 4, sender: "them", text: "Awww so cute! 😻", time: "10:33 AM" },
      ],
    },
    {
      id: 2, name: "PawHunter", handle: "@pawhunter", status: "Offline",
      time: "15m ago", unread: 1, lastMessage: "What camera do you use?",
      messages: [
        { id: 1, sender: "them", text: "Your cat photos are amazing!", time: "9:12 AM" },
        { id: 2, sender: "them", text: "What camera do you use?", time: "9:13 AM" },
      ],
    },
    {
      id: 3, name: "MeowMagic", handle: "@meowmagic", status: "Online",
      time: "1h ago", unread: 0, lastMessage: "Let's collaborate sometime! 🐾",
      messages: [
        { id: 1, sender: "them", text: "Let's collaborate sometime! 🐾", time: "8:00 AM" },
      ],
    },
  ]);

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);
  const filteredChats = chats.filter((chat) =>
    `${chat.name} ${chat.handle} ${chat.lastMessage}`.toLowerCase().includes(search.toLowerCase())
  );

  function sendMessage() {
    if (!messageText.trim()) return;
    const newMessage = { id: Date.now(), sender: "me", text: messageText, time: "Now" };
    setChats(chats.map((chat) =>
      chat.id === selectedChatId
        ? { ...chat, messages: [...chat.messages, newMessage], lastMessage: messageText, time: "Now", unread: 0 }
        : chat
    ));
    setMessageText("");
  }

  function selectChat(id) {
    setSelectedChatId(id);
    setChats(chats.map((chat) => (chat.id === id ? { ...chat, unread: 0 } : chat)));
  }

  return (
    <div className="messages-page">
      <aside className="msg-sidebar">
        <div className="msg-brand" onClick={() => navigate("/fyp")}>
          <img src={logoImg} alt="NyanScape" />
          <h1>NyanScape</h1>
        </div>
        <button onClick={() => navigate("/fyp")}>🏠 FYP</button>
        <button onClick={() => navigate("/explore")}>🔍 Explore</button>
        <button onClick={() => navigate("/create-post")}>➕ Create Post</button>
        <button onClick={() => navigate("/profile")}>👤 My Profile</button>
        <button onClick={() => navigate("/notifications")}>🔔 Notifications</button>
        <button className="active">💬 Messages</button>
        <button onClick={() => navigate("/settings")}>⚙️ Settings</button>
        <div className="msg-join-card">
          <img src={logoImg} alt="Mascot" />
          <h3>Join NyanScape Community!</h3>
          <p>Share your cat stories, photos, and moments with fellow cat lovers!</p>
        </div>
      </aside>

      <main className="msg-main">
        <div className="msg-topbar">
          <input type="text" placeholder="Search messages..." value={search}
            onChange={(e) => setSearch(e.target.value)} />
          <strong>{session?.user?.email?.split("@")[0] || "You"}</strong>
        </div>

        <div className="messages-layout">
          <section className="conversation-list">
            <div className="conversation-header">
              <h2>Messages <span>{chats.reduce((sum, chat) => sum + chat.unread, 0)}</span></h2>
            </div>
            <input className="conversation-search" type="text" placeholder="Search conversations..."
              value={search} onChange={(e) => setSearch(e.target.value)} />
            <div className="chat-list">
              {filteredChats.map((chat) => (
                <button key={chat.id} className={`chat-item ${chat.id === selectedChatId ? "active" : ""}`}
                  onClick={() => selectChat(chat.id)}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#efe6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>🐱</div>
                  <div>
                    <strong>{chat.name} {chat.status === "Online" && <span className="online-dot"></span>}</strong>
                    <p>{chat.lastMessage}</p>
                  </div>
                  <small>{chat.time}</small>
                  {chat.unread > 0 && <span className="unread-count">{chat.unread}</span>}
                </button>
              ))}
            </div>
          </section>

          <section className="chat-window">
            {selectedChat && (
              <>
                <div className="chat-header">
                  <div style={{ width: 54, height: 54, borderRadius: "50%", background: "#efe6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem" }}>🐱</div>
                  <div>
                    <h3>{selectedChat.name}</h3>
                    <p style={{ color: selectedChat.status === "Online" ? "#32c76c" : "#aaa" }}>{selectedChat.status}</p>
                  </div>
                </div>

                <div className="chat-body">
                  <p className="chat-date">Today</p>
                  {selectedChat.messages.length === 0 ? (
                    <div className="empty-chat">No messages yet. Say hi! 🐱</div>
                  ) : (
                    selectedChat.messages.map((message) => (
                      <div key={message.id} className={`message-bubble ${message.sender === "me" ? "me" : "them"}`}>
                        {message.image ? (
                          <img src={message.image} alt="Chat media" onClick={() => setSelectedImage(message.image)} />
                        ) : (
                          <p>{message.text}</p>
                        )}
                        <span>{message.time}</span>
                      </div>
                    ))
                  )}
                </div>

                <div className="chat-input">
                  <div></div>
                  <input type="text" placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }} />
                  <div></div>
                  <button onClick={sendMessage}>➤</button>
                </div>
              </>
            )}
          </section>

          <aside className="chat-details">
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <div style={{ fontSize: "4rem", margin: "1rem auto" }}>🐱</div>
              <h2>{selectedChat?.name}</h2>
              <p>{selectedChat?.handle}</p>
              <p style={{ color: selectedChat?.status === "Online" ? "#32c76c" : "#aaa" }}>● {selectedChat?.status}</p>
            </div>
            <div className="chat-options">
              <h3>Options</h3>
              <button onClick={() => setChats(chats.map((chat) =>
                chat.id === selectedChatId ? { ...chat, messages: [], lastMessage: "" } : chat
              ))}>🗑 Clear Chat</button>
            </div>
          </aside>
        </div>
      </main>

      {selectedImage && (
        <div className="msg-image-modal" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Preview" />
        </div>
      )}
    </div>
  );
}

export default Messages;
