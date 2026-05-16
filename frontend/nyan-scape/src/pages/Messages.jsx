import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../App.css";

function Messages({ session }) {
  const [search, setSearch] = useState("");
  const [messageText, setMessageText] = useState("");
  const [selectedChatId, setSelectedChatId] = useState(1);
  const [chats, setChats] = useState([
    { id: 1, name: "WhiskerMom", handle: "@whiskermom", status: "Online", time: "2m ago", unread: 2, lastMessage: "Awww so cute! 😻",
      messages: [
        { id: 1, sender: "them", text: "Hey there! 👋", time: "10:30 AM" },
        { id: 2, sender: "them", text: "Luna is absolutely adorable! 🥰", time: "10:31 AM" },
        { id: 3, sender: "me", text: "Thank you! She says hi 😺💜", time: "10:32 AM" },
        { id: 4, sender: "them", text: "Awww so cute! 😻", time: "10:33 AM" },
      ]},
    { id: 2, name: "PawHunter", handle: "@pawhunter", status: "Offline", time: "15m ago", unread: 1, lastMessage: "What camera do you use?",
      messages: [
        { id: 1, sender: "them", text: "Your cat photos are amazing!", time: "9:12 AM" },
        { id: 2, sender: "them", text: "What camera do you use?", time: "9:13 AM" },
      ]},
    { id: 3, name: "MeowMagic", handle: "@meowmagic", status: "Online", time: "1h ago", unread: 0, lastMessage: "Let's collaborate! 🐾",
      messages: [{ id: 1, sender: "them", text: "Let's collaborate sometime! 🐾", time: "8:00 AM" }]},
  ]);

  const selectedChat = chats.find((c) => c.id === selectedChatId);

  function sendMessage() {
    if (!messageText.trim()) return;
    const msg = { id: Date.now(), sender: "me", text: messageText, time: "Now" };
    setChats(chats.map((c) => c.id === selectedChatId
      ? { ...c, messages: [...c.messages, msg], lastMessage: messageText, time: "Now", unread: 0 } : c));
    setMessageText("");
  }

  function selectChat(id) {
    setSelectedChatId(id);
    setChats(chats.map((c) => c.id === id ? { ...c, unread: 0 } : c));
  }

  const filteredChats = chats.filter((c) =>
    `${c.name} ${c.lastMessage}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="page-main messages-main">
        <div className="messages-layout">
          <section className="conversation-list">
            <h2>Messages <span>{chats.reduce((s, c) => s + c.unread, 0)}</span></h2>
            <input type="text" placeholder="Search..." value={search}
              onChange={(e) => setSearch(e.target.value)} className="conversation-search" />
            {filteredChats.map((chat) => (
              <button key={chat.id} className={`chat-item ${chat.id === selectedChatId ? "active" : ""}`}
                onClick={() => selectChat(chat.id)}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#efe6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", flexShrink: 0 }}>🐱</div>
                <div style={{ flex: 1, textAlign: "left" }}>
                  <strong>{chat.name} {chat.status === "Online" && <span className="online-dot"></span>}</strong>
                  <p>{chat.lastMessage}</p>
                </div>
                <small>{chat.time}</small>
                {chat.unread > 0 && <span className="unread-count">{chat.unread}</span>}
              </button>
            ))}
          </section>

          <section className="chat-window">
            {selectedChat && (
              <>
                <div className="chat-header">
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#efe6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem" }}>🐱</div>
                  <div>
                    <h3>{selectedChat.name}</h3>
                    <p style={{ color: selectedChat.status === "Online" ? "#32c76c" : "#aaa" }}>● {selectedChat.status}</p>
                  </div>
                </div>
                <div className="chat-body">
                  <p className="chat-date">Today</p>
                  {selectedChat.messages.map((msg) => (
                    <div key={msg.id} className={`message-bubble ${msg.sender === "me" ? "me" : "them"}`}>
                      <p>{msg.text}</p>
                      <span>{msg.time}</span>
                    </div>
                  ))}
                </div>
                <div className="chat-input">
                  <div></div>
                  <input type="text" placeholder="Type a message..."
                    value={messageText} onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }} />
                  <div></div>
                  <button onClick={sendMessage}>➤</button>
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Messages;
