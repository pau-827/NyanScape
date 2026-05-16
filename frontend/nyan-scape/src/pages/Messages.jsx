import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import catImg from "../assets/cat.webp";
import lunaImg from "../assets/luna.webp";
import playImg from "../assets/play.jpg";
import logoImg from "../assets/logo.png";

function Messages() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [messageText, setMessageText] = useState("");
  const [selectedChatId, setSelectedChatId] = useState(1);
  const [muted, setMuted] = useState([]);
  const [blocked, setBlocked] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const [chats, setChats] = useState([
    {
      id: 1,
      name: "WhiskerMom",
      handle: "@whiskermom",
      avatar: catImg,
      status: "Online",
      time: "2m ago",
      unread: 2,
      lastMessage: "Awww so cute! 😻",
      messages: [
        { id: 1, sender: "them", text: "Hey there! 👋", time: "10:30 AM" },
        {
          id: 2,
          sender: "them",
          text: "I just saw your post about Luna. She's absolutely adorable! 🥰",
          time: "10:30 AM",
        },
        {
          id: 3,
          sender: "me",
          text: "Hi! Thank you so much! Luna says hi 😺💜",
          time: "10:32 AM",
        },
        {
          id: 4,
          sender: "me",
          image: lunaImg,
          time: "10:32 AM",
        },
        { id: 5, sender: "them", text: "Awww so cute! 😻", time: "10:33 AM" },
        {
          id: 6,
          sender: "me",
          text: "She loves boxes more than anything! 📦😂",
          time: "10:34 AM",
        },
      ],
    },
    {
      id: 2,
      name: "PawHunter",
      handle: "@pawhunter",
      avatar: playImg,
      status: "Offline",
      time: "15m ago",
      unread: 1,
      lastMessage: "Thanks for sharing! What camera do you use?",
      messages: [
        { id: 1, sender: "them", text: "Your cat photos are amazing!", time: "9:12 AM" },
        { id: 2, sender: "them", text: "What camera do you use?", time: "9:13 AM" },
      ],
    },
    {
      id: 3,
      name: "MeowMagic",
      handle: "@meowmagic",
      avatar: catImg,
      status: "Online",
      time: "1h ago",
      unread: 0,
      lastMessage: "Let's collaborate sometime! 🐾",
      messages: [
        { id: 1, sender: "them", text: "Let's collaborate sometime! 🐾", time: "8:00 AM" },
      ],
    },
    {
      id: 4,
      name: "CatPhotoDaily",
      handle: "@catphotodaily",
      avatar: lunaImg,
      status: "Offline",
      time: "2h ago",
      unread: 0,
      lastMessage: "Your photos are amazing! 🔥",
      messages: [
        { id: 1, sender: "them", text: "Your photos are amazing! 🔥", time: "7:30 AM" },
      ],
    },
  ]);

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  const filteredChats = chats.filter((chat) =>
    `${chat.name} ${chat.handle} ${chat.lastMessage}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function sendMessage() {
    if (!messageText.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: "me",
      text: messageText,
      time: "Now",
    };

    setChats(
      chats.map((chat) =>
        chat.id === selectedChatId
          ? {
              ...chat,
              messages: [...chat.messages, newMessage],
              lastMessage: messageText,
              time: "Now",
              unread: 0,
            }
          : chat
      )
    );

    setMessageText("");
  }

  function selectChat(id) {
    setSelectedChatId(id);
    setChats(
      chats.map((chat) => (chat.id === id ? { ...chat, unread: 0 } : chat))
    );
  }

  function startNewMessage() {
    const name = prompt("Enter username:");
    if (!name) return;

    const newChat = {
      id: Date.now(),
      name,
      handle: `@${name.toLowerCase().replaceAll(" ", "")}`,
      avatar: "/logo.png",
      status: "Online",
      time: "Now",
      unread: 0,
      lastMessage: "New conversation started.",
      messages: [{ id: 1, sender: "them", text: "New conversation started.", time: "Now" }],
    };

    setChats([newChat, ...chats]);
    setSelectedChatId(newChat.id);
  }

  function clearChat() {
    if (!window.confirm("Clear this chat?")) return;

    setChats(
      chats.map((chat) =>
        chat.id === selectedChatId ? { ...chat, messages: [], lastMessage: "" } : chat
      )
    );
  }

  function toggleMute(id) {
    setMuted((prev) =>
      prev.includes(id) ? prev.filter((chatId) => chatId !== id) : [...prev, id]
    );
  }

  function toggleBlock(id) {
    setBlocked((prev) =>
      prev.includes(id) ? prev.filter((chatId) => chatId !== id) : [...prev, id]
    );
  }

  function sendImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    const newMessage = {
      id: Date.now(),
      sender: "me",
      image: imageUrl,
      time: "Now",
    };

    setChats(
      chats.map((chat) =>
        chat.id === selectedChatId
          ? {
              ...chat,
              messages: [...chat.messages, newMessage],
              lastMessage: "Sent an image",
              time: "Now",
            }
          : chat
      )
    );
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
        <button onClick={() => alert("Bookmarks opened!")}>🔖 Bookmarks</button>
        <button onClick={() => navigate("/profile")}>👤 My Profile</button>
        <button onClick={() => navigate("/notif")}>🔔 Notifications</button>
        <button className="active">💬 Messages</button>
        <button onClick={() => navigate("/settings")}>
  ⚙️ Settings
</button>

        <button className="new-message-btn" onClick={startNewMessage}>
          + New Message
        </button>

        <div className="msg-join-card">
          <img src={logoImg} alt="Mascot" />
          <h3>Join NyanScape Community!</h3>
          <p>Share your cat stories, photos, and moments with fellow cat lovers!</p>
          <button onClick={() => alert("Invite link copied!")}>Invite Friends</button>
        </div>
      </aside>

      <main className="msg-main">
        <div className="msg-topbar">
          <input
            type="text"
            placeholder="Search cats, users, or messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={() => navigate("/notifications")}>🔔</button>
          <img src={catImg} alt="User" />
          <strong>CatLover_23</strong>
        </div>

        <div className="messages-layout">
          <section className="conversation-list">
            <div className="conversation-header">
              <h2>
                Messages <span>{chats.reduce((sum, chat) => sum + chat.unread, 0)}</span>
              </h2>
              <div>
                <button onClick={() => alert("Filter opened!")}>⚱</button>
                <button onClick={startNewMessage}>✎</button>
              </div>
            </div>

            <input
              className="conversation-search"
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="chat-list">
              {filteredChats.map((chat) => (
                <button
                  key={chat.id}
                  className={`chat-item ${chat.id === selectedChatId ? "active" : ""}`}
                  onClick={() => selectChat(chat.id)}
                >
                  <img src={chat.avatar} alt={chat.name} />
                  <div>
                    <strong>
                      {chat.name} {chat.status === "Online" && <span className="online-dot"></span>}
                    </strong>
                    <p>{chat.lastMessage}</p>
                  </div>
                  <small>{chat.time}</small>
                  {chat.unread > 0 && <span className="unread-count">{chat.unread}</span>}
                  {muted.includes(chat.id) && <span className="muted">🔕</span>}
                </button>
              ))}
            </div>
          </section>

          <section className="chat-window">
            {selectedChat && (
              <>
                <div className="chat-header">
                  <img src={selectedChat.avatar} alt={selectedChat.name} />
                  <div>
                    <h3>{selectedChat.name}</h3>
                    <p>{selectedChat.status}</p>
                  </div>

                  <div className="chat-actions">
                    <button onClick={() => alert("Video call started!")}>📹</button>
                    <button onClick={() => alert("Voice call started!")}>📞</button>
                    <button onClick={() => alert("Chat info opened!")}>ⓘ</button>
                  </div>
                </div>

                <div className="chat-body">
                  <p className="chat-date">Today</p>

                  {selectedChat.messages.length === 0 ? (
                    <div className="empty-chat">No messages yet.</div>
                  ) : (
                    selectedChat.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`message-bubble ${
                          message.sender === "me" ? "me" : "them"
                        }`}
                      >
                        {message.image ? (
                          <img
                            src={message.image}
                            alt="Chat media"
                            onClick={() => setSelectedImage(message.image)}
                          />
                        ) : (
                          <p>{message.text}</p>
                        )}
                        <span>{message.time}</span>
                      </div>
                    ))
                  )}
                </div>

                <div className="chat-input">
                  <label>
                    📎
                    <input type="file" accept="image/*" onChange={sendImage} hidden />
                  </label>

                  <input
                    type="text"
                    placeholder={
                      blocked.includes(selectedChat.id)
                        ? "User is blocked"
                        : "Type a message..."
                    }
                    value={messageText}
                    disabled={blocked.includes(selectedChat.id)}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") sendMessage();
                    }}
                  />

                  <button onClick={() => alert("Emoji picker coming soon!")}>😊</button>
                  <button onClick={sendMessage} disabled={blocked.includes(selectedChat.id)}>
                    ➤
                  </button>
                </div>
              </>
            )}
          </section>

          <aside className="chat-details">
            <button className="details-menu">•••</button>

            <img src={selectedChat.avatar} alt={selectedChat.name} className="details-avatar" />
            <h2>{selectedChat.name}</h2>
            <p>{selectedChat.handle}</p>
            <span className="status-dot">● {selectedChat.status}</span>

            <div className="details-actions">
              <button onClick={() => navigate("/profile")}>👤 Profile</button>
              <button onClick={() => toggleMute(selectedChat.id)}>
                {muted.includes(selectedChat.id) ? "🔔 Unmute" : "🔕 Mute"}
              </button>
              <button onClick={() => alert("Search in chat coming soon!")}>🔍 Search</button>
            </div>

            <div className="shared-media">
              <div>
                <h3>Shared Media</h3>
                <button onClick={() => alert("Showing all media!")}>View all</button>
              </div>

              <div className="media-grid">
                {[catImg, lunaImg, playImg, logoImg].map((img) => (
                  <img
                    key={img}
                    src={img}
                    alt="Shared"
                    onClick={() => setSelectedImage(img)}
                  />
                ))}
              </div>
            </div>

            <div className="chat-options">
              <h3>Options</h3>
              <button onClick={() => alert("Customize chat opened!")}>
                🎨 Customize Chat
              </button>
              <button onClick={clearChat}>🗑 Clear Chat</button>
              <button onClick={() => toggleBlock(selectedChat.id)}>
                {blocked.includes(selectedChat.id) ? "✅ Unblock User" : "🚫 Block User"}
              </button>
              <button onClick={() => alert("User reported!")}>🚩 Report User</button>
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