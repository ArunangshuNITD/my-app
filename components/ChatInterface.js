"use client";

import { useState, useRef, useEffect } from "react";
import { sendMessage, deleteMessage } from "@/app/actions/messageAction"; 
import { FaPaperPlane, FaTrash, FaPaperclip, FaTimes, FaFileAlt, FaImage, FaVideo } from "react-icons/fa"; 
import TemplateSelector from "./TemplateSelector"; // <-- NEW IMPORT

export default function ChatInterface({ initialMessages, conversationId, currentUserEmail }) {
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null); 
  const [previewUrl, setPreviewUrl] = useState(null); 
  const [isSending, setIsSending] = useState(false);
  
  const [isMounted, setIsMounted] = useState(false);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle File Selection
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (selectedFile.type.startsWith("image/") || selectedFile.type.startsWith("video/")) {
        setPreviewUrl(URL.createObjectURL(selectedFile));
      } else {
        setPreviewUrl("document"); 
      }
    }
  };

  // Remove File before sending
  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // <-- NEW HANDLER FOR TEMPLATES -->
  const handleTemplateSelect = (templateText) => {
    setText(templateText);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if ((!text.trim() && !file) || isSending) return;

    setIsSending(true);

    const formData = new FormData();
    formData.append("conversationId", conversationId);
    formData.append("text", text);
    if (file) {
      formData.append("file", file);
    }

    const tempText = text;
    setText(""); 
    setFile(null);
    setPreviewUrl(null);

    try {
      const newMessage = await sendMessage(formData);
      setMessages((prev) => [...prev, newMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
      setText(tempText); 
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async (messageId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    try {
      await deleteMessage(messageId, conversationId);
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const renderAttachment = (msg) => {
    if (!msg.fileUrl) return null;

    switch (msg.fileType) {
      case "image":
        return <img src={msg.fileUrl} alt="Attachment" className="max-w-full rounded-lg mt-2 max-h-48 object-cover" />;
      case "video":
        return <video src={msg.fileUrl} controls className="max-w-full rounded-lg mt-2 max-h-48" />;
      case "audio":
        return <audio src={msg.fileUrl} controls className="max-w-full mt-2" />;
      default: 
        return (
          <a 
            href={msg.fileUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 mt-2 p-3 bg-black/10 dark:bg-white/10 rounded-lg hover:bg-black/20 dark:hover:bg-white/20 transition-colors text-sm"
          >
            <FaFileAlt className="text-xl shrink-0" /> 
            <span className="truncate max-w-[150px] underline">{msg.fileName || "Download Attachment"}</span>
          </a>
        );
    }
  };

  return (
    <div className="flex flex-col h-[70vh] bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden relative">
      
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
                {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}
                
                {renderAttachment(msg)}
                
                <div className={`flex items-center gap-2 mt-1 ${isMe ? "justify-end text-indigo-200" : "text-zinc-400"}`}>
                  
                  <span className="text-[10px]">
                    {isMounted ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                  </span>
                  
                  {isMe && (
                    <button 
                      onClick={() => handleDelete(msg._id)}
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

      {/* File Preview Area */}
      {previewUrl && (
        <div className="absolute bottom-[80px] left-4 bg-white dark:bg-zinc-800 p-2 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700 flex items-center gap-3">
          {previewUrl === "document" ? (
             <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-700 rounded flex items-center justify-center text-zinc-500">
                <FaFileAlt size={24} />
             </div>
          ) : (
            <img src={previewUrl} alt="Preview" className="w-12 h-12 object-cover rounded" />
          )}
          <div className="text-sm truncate max-w-[150px] dark:text-zinc-200">{file?.name}</div>
          <button onClick={removeFile} className="p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 ml-2">
            <FaTimes size={12} />
          </button>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex gap-2 items-center">
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          className="hidden" 
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
        />
        
        {/* Attachment Button */}
        <button 
          type="button" 
          onClick={() => fileInputRef.current.click()}
          className="text-zinc-400 hover:text-indigo-600 transition-colors p-2 flex items-center justify-center"
          title="Attach a file"
        >
          <FaPaperclip size={20} />
        </button>

        {/* <-- NEW: TEMPLATE SELECTOR PLACED HERE --> */}
        <TemplateSelector onSelectTemplate={handleTemplateSelect} />

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-indigo-500 ml-1"
        />
        
        <button
          type="submit"
          disabled={(!text.trim() && !file) || isSending}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ml-1"
        >
          {isSending ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <FaPaperPlane />
          )}
        </button>
      </form>
    </div>
  );
}