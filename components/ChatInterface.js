"use client";

import { useState, useRef, useEffect } from "react";
// IMPORT the new deleteMessage action
import { sendMessage, deleteMessage } from "@/app/actions/messageAction"; 
import { FaPaperPlane, FaTrash } from "react-icons/fa"; // Added FaTrash

export default function ChatInterface({ initialMessages, conversationId, currentUserEmail }) {
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || isSending) return;

    setIsSending(true);
    const tempText = text;
    setText(""); 

    try {
      const newMessage = await sendMessage(conversationId, tempText);
      setMessages((prev) => [...prev, newMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
      setText(tempText); 
    } finally {
      setIsSending(false);
    }
  };

  // NEW: Handle Deletion
  const handleDelete = async (messageId) => {
    // Optional: Add a small confirmation prompt so they don't delete by accident
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    // Optimistically remove the message from the UI immediately for a snappy feel
    setMessages((prev) => prev.filter((msg) => msg._id !== messageId));

    try {
      await deleteMessage(messageId, conversationId);
    } catch (error) {
      console.error("Failed to delete message:", error);
      // If the database delete fails, you could technically add the message back here, 
      // but a simple console error is fine for now.
    }
  };

  return (
    <div className="flex flex-col h-[70vh] bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-zinc-50/50 dark:bg-black/20">
        {messages.map((msg) => {
          const isMe = msg.senderEmail === currentUserEmail;
          return (
            <div key={msg._id} className={`flex ${isMe ? "justify-end" : "justify-start"} group`}>
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm ${
                  isMe
                    ? "bg-indigo-600 text-white rounded-tr-sm"
                    : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-100 dark:border-zinc-700 rounded-tl-sm shadow-sm"
                }`}
              >
                {msg.text}
                
                {/* Timestamp & Delete Button Wrapper */}
                <div className={`flex items-center gap-2 mt-1 ${isMe ? "justify-end text-indigo-200" : "text-zinc-400"}`}>
                  <span className="text-[10px]">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  
                  {/* Show delete button ONLY if I sent it */}
                  {isMe && (
                    <button 
                      onClick={() => handleDelete(msg._id)}
                      // The opacity-0 group-hover:opacity-100 makes it only show when hovering over the message!
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-300 ml-2"
                      title="Delete message"
                    >
                      <FaTrash size={10} />
                    </button>
                  )}
                </div>
                
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex gap-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={!text.trim() || isSending}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors"
        >
          <FaPaperPlane className={isSending ? "animate-pulse" : ""} />
        </button>
      </form>
    </div>
  );
}