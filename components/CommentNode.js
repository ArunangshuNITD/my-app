// components/CommentNode.jsx
import React from 'react';
import Link from 'next/link'; // Assuming Next.js based on Link usage
import { FaPaperPlane, FaReply, FaTrash } from 'react-icons/fa';

const CommentNode = ({ 
    comment, 
    session, 
    activeReplyId, 
    setActiveReplyId, 
    replyText, 
    setReplyText, 
    handleReplySubmit, 
    handleDelete,
    canDelete,
    depth = 0 // Track depth for styling
}) => {
    
    // Stop infinite recursion crash if bad data exists
    if (!comment) return null;

    return (
        <div className={`animate-in fade-in duration-500 ${depth > 0 ? 'mt-4' : ''}`}>
            <div className="flex gap-3">
                {/* Avatar */}
                <img 
                    src={comment.image || "/default-avatar.png"} 
                    className={`${depth === 0 ? 'w-10 h-10' : 'w-8 h-8'} rounded-full bg-gray-200 object-cover flex-shrink-0`} 
                    alt={comment.name || "user"} 
                />

                <div className="flex-1 min-w-0">
                    {/* Comment Bubble */}
                    <div className="bg-white dark:bg-zinc-950 p-4 rounded-2xl rounded-tl-none border border-gray-100 dark:border-zinc-800 shadow-sm relative">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-sm text-gray-900 dark:text-white">
                                {comment.name}
                            </span>
                            <span className="text-[10px] text-gray-400">
                                {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {comment.text}
                        </p>
                    </div>

                    {/* Actions: Reply / Delete */}
                    <div className="flex items-center gap-4 mt-2 ml-2">
                        {session && (
                            <button
                                onClick={() => setActiveReplyId(activeReplyId === comment._id ? null : comment._id)}
                                className="text-xs font-semibold text-gray-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
                            >
                                <FaReply /> Reply
                            </button>
                        )}
                        {canDelete(comment.email) && (
                            <button
                                onClick={() => handleDelete(comment._id)}
                                className="text-xs font-semibold text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                            >
                                <FaTrash /> Delete
                            </button>
                        )}
                    </div>

                    {/* Reply Input Box (Shows only if active) */}
                    {activeReplyId === comment._id && (
                        <div className="mt-4 ml-2 flex gap-2 animate-in slide-in-from-top-2">
                            <input
                                autoFocus
                                type="text"
                                className="flex-1 bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-full px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                placeholder={`Reply to ${comment.name}...`}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleReplySubmit(e, comment._id);
                                }}
                            />
                            <button
                                type="button"
                                onClick={(e) => handleReplySubmit(e, comment._id)}
                                className="w-9 h-9 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                            >
                                <FaPaperPlane size={12} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* RECURSIVE RENDERING OF CHILDREN */}
            {comment.replies && comment.replies.length > 0 && (
                <div className={`border-l-2 border-gray-100 dark:border-zinc-800 pl-4 ml-4 ${depth > 0 ? 'mt-4' : 'mt-4'}`}>
                    {comment.replies.map((reply) => (
                        <CommentNode 
                            key={reply._id}
                            comment={reply}
                            session={session}
                            activeReplyId={activeReplyId}
                            setActiveReplyId={setActiveReplyId}
                            replyText={replyText}
                            setReplyText={setReplyText}
                            handleReplySubmit={handleReplySubmit}
                            handleDelete={handleDelete}
                            canDelete={canDelete}
                            depth={depth + 1} // Increase depth
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentNode;