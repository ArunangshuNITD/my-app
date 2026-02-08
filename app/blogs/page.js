"use client";
import CommentNode from "@/components/CommentNode";
import { useState, useEffect, useRef, useMemo } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
    FaArrowUp, FaCommentAlt, FaTimes, FaPaperPlane,
    FaPenFancy, FaReply, FaTrash, FaSearch, FaBlog,
    FaFire, FaClock, FaShare, FaEllipsisH, FaHashtag,
    FaSortAmountDown, FaBookmark, FaLink, FaCheckCircle, FaPlus
} from "react-icons/fa";

// ⚠️ ADMIN CONFIGURATION
const ADMIN_EMAILS = ["arunangshud3@gmail.com"];

// --- 1. UTILITY COMPONENTS ---

const Toast = ({ message, type, onClose }) => (
    <div className={`fixed bottom-5 right-5 z-[60] flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-300 ${type === 'error' ? 'bg-red-500 text-white' : 'bg-zinc-900 text-white dark:bg-white dark:text-black'
        }`}>
        {type === 'success' ? <FaCheckCircle /> : <FaTimes />}
        <span className="font-medium text-sm">{message}</span>
        <button onClick={onClose} className="opacity-70 hover:opacity-100 ml-2"><FaTimes /></button>
    </div>
);

const SkeletonCard = () => (
    <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-gray-100 dark:border-zinc-800 animate-pulse h-full">
        <div className="flex justify-between mb-4">
            <div className="h-4 w-20 bg-gray-200 dark:bg-zinc-800 rounded"></div>
            <div className="h-4 w-12 bg-gray-200 dark:bg-zinc-800 rounded"></div>
        </div>
        <div className="h-6 w-3/4 bg-gray-200 dark:bg-zinc-800 rounded mb-3"></div>
        <div className="h-4 w-full bg-gray-200 dark:bg-zinc-800 rounded mb-2"></div>
        <div className="h-4 w-2/3 bg-gray-200 dark:bg-zinc-800 rounded mb-6"></div>
        <div className="flex items-center gap-3 mt-auto">
            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-zinc-800"></div>
            <div className="h-3 w-24 bg-gray-200 dark:bg-zinc-800 rounded"></div>
        </div>
    </div>
);

// --- 2. MAIN COMPONENT ---

export default function BlogFeed() {
    const { data: session } = useSession();
    const [blogs, setBlogs] = useState([]);
    const [selectedBlog, setSelectedBlog] = useState(null);

    // Filtering & Sorting State
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortBy, setSortBy] = useState("latest");

    // Comment State
    const [mainCommentText, setMainCommentText] = useState("");
    const [replyText, setReplyText] = useState("");
    const [activeReplyId, setActiveReplyId] = useState(null);
    const replyInputRef = useRef(null);

    // UI State
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    // --- TYPING EFFECT STATE (Moved inside BlogFeed) ---
    const [displayText, setDisplayText] = useState("");
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(150);

    const phrases = useMemo(() => [
        "Share your thoughts...",
        "Write your story...",
        "Help others to improve...",
        "Inspire the community...",
        "Document your journey..."
    ], []);

    useEffect(() => {
        const handleTyping = () => {
            const currentPhrase = phrases[phraseIndex];
            if (!isDeleting) {
                // Typing
                setDisplayText(currentPhrase.substring(0, displayText.length + 1));
                setTypingSpeed(100);
                if (displayText === currentPhrase) {
                    setTimeout(() => setIsDeleting(true), 2000);
                }
            } else {
                // Deleting
                setDisplayText(currentPhrase.substring(0, displayText.length - 1));
                setTypingSpeed(50);
                if (displayText === "") {
                    setIsDeleting(false);
                    setPhraseIndex((prev) => (prev + 1) % phrases.length);
                }
            }
        };
        const timer = setTimeout(handleTyping, typingSpeed);
        return () => clearTimeout(timer);
    }, [displayText, isDeleting, phraseIndex, typingSpeed, phrases]);

    // --- HELPERS ---
    const isAdmin = session && ADMIN_EMAILS.includes(session.user.email);

    const showToast = (msg, type = 'success') => {
        setToast({ message: msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const calculateReadTime = (text) => {
        const wordsPerMinute = 200;
        const words = text ? text.split(/\s+/).length : 0;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes} min read`;
    };

    const copyLink = async (id) => {
        const url = `${window.location.origin}/blog/${id}`;
        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(url);
                showToast("Link copied to clipboard");
                return;
            } catch (err) {
                console.error("Clipboard API failed, trying fallback...", err);
            }
        }
        // Fallback
        try {
            const textArea = document.createElement("textarea");
            textArea.value = url;
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            if (successful) showToast("Link copied to clipboard");
            else showToast("Failed to copy link", "error");
        } catch (err) {
            showToast("Failed to copy link", "error");
        }
    };

    const canDelete = (authorEmail) => {
        if (!session) return false;
        return session.user.email === authorEmail || isAdmin;
    };

    // --- API ACTIONS ---

    useEffect(() => {
        fetch("/api/blogs")
            .then((res) => res.json())
            .then((data) => {
                const safeData = Array.isArray(data) ? data : [];
                setBlogs(safeData);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setBlogs([]);
                setLoading(false);
            });
    }, []);

    const handleDeleteBlog = async (blogId) => {
        if (!confirm("Permanently delete this story?")) return;
        try {
            const res = await fetch(`/api/blogs/${blogId}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed");
            setBlogs(prev => prev.filter(b => b._id !== blogId));
            setSelectedBlog(null);
            showToast("Story deleted successfully");
        } catch (error) {
            showToast("Failed to delete story", "error");
        }
    };

    const handleUpvote = async (e, blogId) => {
        e.stopPropagation();
        if (!session) return showToast("Please login to vote", "error");
        const userEmail = session.user.email;

        const updateList = (list) => list.map((b) => {
            if (b._id === blogId) {
                const currentUpvotes = Array.isArray(b.upvotes) ? b.upvotes : [];
                const isLiked = currentUpvotes.includes(userEmail);
                const newUpvotes = isLiked ? currentUpvotes.filter((u) => u !== userEmail) : [...currentUpvotes, userEmail];
                return { ...b, upvotes: newUpvotes };
            }
            return b;
        });

        setBlogs(prev => updateList(prev));
        if (selectedBlog && selectedBlog._id === blogId) {
            setSelectedBlog(prev => ({ ...prev, upvotes: updateList([prev])[0].upvotes }));
        }
        await fetch(`/api/blogs/${blogId}/upvote`, { method: "POST" });
    };

    const handleCommentSubmit = async (e, parentCommentId = null) => {
        e.preventDefault();
        const textToSend = parentCommentId ? replyText : mainCommentText;

        // 1. Validation
        if (!textToSend.trim()) return;
        if (!session?.user) {
            alert("You must be logged in to comment");
            return;
        }

        try {
            // 2. Build Payload
            const payload = {
                text: textToSend,
                name: session.user.name,
                email: session.user.email,
                image: session.user.image,
            };

            if (parentCommentId) {
                payload.parentCommentId = parentCommentId;
            }

            // 3. API Request
            const res = await fetch(`/api/blogs/${selectedBlog._id}/comment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to post comment");
            }

            // 4. Update State Correctly
            // 'data' from backend is the NEW array of comments
            const updatedBlog = { ...selectedBlog, comments: data };

            setSelectedBlog(updatedBlog);

            // Update the main list of blogs so the comment count updates in the background
            setBlogs((prev) =>
                prev.map((b) => b._id === selectedBlog._id ? updatedBlog : b)
            );

            // 5. Cleanup
            setMainCommentText("");
            setReplyText("");
            setActiveReplyId(null);
            // showToast("Comment posted successfully!", "success");

        } catch (error) {
            console.error("Submission failed:", error);
            // showToast(error.message, "error");
        }
    };

    const handleDeleteComment = async (commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
        // We only need the ID of the comment/reply being deleted.
        // The backend recursion will find it wherever it is.
        const res = await fetch(`/api/blogs/${selectedBlog._id}/comment/${commentId}`, {
            method: "DELETE",
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to delete");
        }

        // Update State with the new comments array returned by the server
        const updatedBlog = { ...selectedBlog, comments: data };
        setSelectedBlog(updatedBlog);
        
        setBlogs((prev) => 
            prev.map((b) => b._id === selectedBlog._id ? updatedBlog : b)
        );
        
        // showToast("Comment deleted", "success");

    } catch (error) {
        console.error("Delete failed:", error);
        // showToast("Failed to delete comment", "error");
    }
};

    // --- FILTERING LOGIC ---

    const categories = useMemo(() => {
        const allCats = blogs.map(b => b.category || "General");
        return ["All", ...new Set(allCats)];
    }, [blogs]);

    const filteredAndSortedBlogs = useMemo(() => {
        const lowerSearch = searchTerm.toLowerCase();
        let result = blogs.filter(b =>
            (selectedCategory === "All" || (b.category || "General") === selectedCategory) &&
            (
                b.title.toLowerCase().includes(lowerSearch) ||
                b.content.toLowerCase().includes(lowerSearch) ||
                (b.tags && b.tags.some(tag => tag.toLowerCase().includes(lowerSearch)))
            )
        );

        if (sortBy === "popular") {
            result.sort((a, b) => (b.upvotes?.length || 0) - (a.upvotes?.length || 0));
        } else if (sortBy === "discussed") {
            result.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
        } else {
            result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        return result;
    }, [blogs, searchTerm, selectedCategory, sortBy]);

    const trendingBlogs = useMemo(() => {
        return [...blogs].sort((a, b) => (b.upvotes?.length || 0) - (a.upvotes?.length || 0)).slice(0, 4);
    }, [blogs]);

    // More realistic paper texture: layered gradients + subtle SVG noise data-URI
    const svgNoise = encodeURIComponent(`
        <svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'>
            <filter id='n'>
                <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/>
                <feColorMatrix type='saturate' values='0'/>
                <feComponentTransfer>
                    <feFuncA type='table' tableValues='0 0.08' />
                </feComponentTransfer>
            </filter>
            <rect width='100%' height='100%' filter='url(#n)' opacity='0.08' fill='white'/>
        </svg>
    `);

    const paperTexture = `url("data:image/svg+xml;utf8,${svgNoise}")`;

    const paperBG = {
        backgroundImage: `
            linear-gradient(180deg, #fbfaf7 0%, #f7f3ee 45%, #f2eadf 100%),
            ${paperTexture},
            repeating-linear-gradient(0deg, rgba(0,0,0,0.02) 0 1px, rgba(255,255,255,0) 1px 6px),
            radial-gradient( circle at 50% 0%, rgba(0,0,0,0.03), rgba(0,0,0,0) 30% )
        `,
        backgroundBlendMode: 'normal, multiply, overlay, multiply',
        backgroundRepeat: 'no-repeat, repeat, repeat, no-repeat',
        backgroundSize: '100% 100%, 400px 400px, 8px 8px, 120% 120%',
        backgroundColor: '#fbfaf7'
    };

    // --- RENDER ---

    return (
        <div style={paperBG} className="min-h-screen text-zinc-900 dark:text-zinc-100 font-sans selection:bg-blue-100 dark:selection:bg-blue-900">

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* --- HEADER --- */}
            <div className="bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-200 dark:border-zinc-800">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                            <FaBlog className="text-lg" />
                        </div>
                        <h1 className="text-lg font-bold tracking-tight">Community<span className="text-blue-600">Voices</span></h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex relative group">
                            <input
                                type="text"
                                placeholder="Search stories & tags..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-zinc-800 rounded-full text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64 transition-all"
                            />
                            <FaSearch className="absolute left-3.5 top-2.5 text-gray-400" />
                        </div>

                        {session ? (
                            <Link href="/create-post" className="hidden md:flex items-center gap-2 bg-zinc-900 text-white dark:bg-white dark:text-black px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition shadow-sm">
                                <FaPenFancy /> Write
                            </Link>
                        ) : (
                            <button className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">Sign In</button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* --- LEFT SIDEBAR (Desktop) --- */}
                    <div className="hidden lg:block col-span-2 sticky top-24 h-fit">
                        <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-4">Discover</h3>
                        <nav className="space-y-1">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === cat ? 'bg-white dark:bg-zinc-800 font-semibold shadow-sm' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800/50'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* --- MAIN FEED --- */}
                    <div className="col-span-1 lg:col-span-7 space-y-6">

                        {/* Mobile Search */}
                        <div className="lg:hidden mb-6">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full p-3 bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-zinc-800">
                            <div className="flex gap-6">
                                <button onClick={() => setSortBy('latest')} className={`text-sm font-medium pb-2 border-b-2 transition ${sortBy === 'latest' ? 'border-black dark:border-white text-black dark:text-white' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Latest</button>
                                <button onClick={() => setSortBy('popular')} className={`text-sm font-medium pb-2 border-b-2 transition ${sortBy === 'popular' ? 'border-black dark:border-white text-black dark:text-white' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Popular</button>
                                <button onClick={() => setSortBy('discussed')} className={`text-sm font-medium pb-2 border-b-2 transition ${sortBy === 'discussed' ? 'border-black dark:border-white text-black dark:text-white' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Discussed</button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 gap-6">
                                {[1, 2, 3].map(i => <div key={i} className="h-64"><SkeletonCard /></div>)}
                            </div>
                        ) : filteredAndSortedBlogs.length > 0 ? (
                            <div className="space-y-6">
                                {filteredAndSortedBlogs.map((blog) => (
                                    <div
                                        key={blog._id}
                                        onClick={() => setSelectedBlog(blog)}
                                        className="group bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                                    >
                                        {/* Hover Accent */}
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>

                                        <div className="flex items-center gap-3 mb-4">
                                            <img src={blog.authorImage || "/default-avatar.png"} className="w-8 h-8 rounded-full bg-gray-200 object-cover" alt="author" />
                                            <div className="flex flex-col text-xs">
                                                <span className="font-semibold text-gray-900 dark:text-white hover:underline">{blog.authorName}</span>
                                                <span className="text-gray-500">{new Date(blog.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <span className="ml-auto text-[10px] font-medium px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded-full text-gray-500 uppercase tracking-wide">
                                                {blog.category || "General"}
                                            </span>
                                        </div>

                                        <h2 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-blue-600 transition-colors leading-tight">
                                            {blog.title}
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4">
                                            {blog.excerpt || blog.content}
                                        </p>

                                        {blog.tags && blog.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {blog.tags.map((tag, i) => (
                                                    <span key={i} className="text-[10px] font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-300 px-2 py-1 rounded-md">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-zinc-800">
                                            <div className="flex items-center gap-4">
                                                <span className="flex items-center text-xs font-medium text-gray-400">
                                                    <FaClock className="mr-1" /> {calculateReadTime(blog.content)}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-4 text-sm">
                                                <button
                                                    onClick={(e) => handleUpvote(e, blog._id)}
                                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${blog.upvotes?.includes(session?.user?.email) ? "bg-orange-50 text-orange-600 dark:bg-orange-900/20" : "text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800"}`}
                                                >
                                                    <FaArrowUp /> {blog.upvotes?.length || 0}
                                                </button>
                                                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-gray-500 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 transition-colors">
                                                    <FaCommentAlt /> {blog.comments?.length || 0}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white px-6 py-24 text-center transition-colors dark:border-zinc-800 dark:bg-zinc-900/50">
                                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-50 text-zinc-400 ring-1 ring-zinc-100 dark:bg-zinc-800 dark:text-zinc-500 dark:ring-zinc-700">
                                    <FaPenFancy className="text-3xl" />
                                </div>
                                <div className="h-10">
                                    <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                                        {displayText}
                                        <span className="ml-1 inline-block w-0.5 h-6 align-middle bg-indigo-600 animate-pulse" />
                                    </h3>
                                </div>
                                <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                                    We couldn't find any stories matching your current view. Be the first to contribute or try a different filter.
                                </p>
                                <Link href="/create-post">
                                    <button
                                        className="group mt-8 flex items-center gap-3 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-black px-8 py-3.5 text-sm font-semibold tracking-wide text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:from-indigo-600 hover:to-violet-700 hover:shadow-indigo-500/25 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:from-white dark:to-zinc-200 dark:text-black dark:hover:from-indigo-50 dark:hover:to-white"
                                    >
                                        <FaPlus className="text-xs transition-transform duration-300 group-hover:rotate-90" />
                                        <span>Create New Story</span>
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* --- RIGHT SIDEBAR (Trending) --- */}
                    <div className="hidden lg:block col-span-3 space-y-8 sticky top-24 h-fit">

                        {!session && (
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
                                <h3 className="font-bold text-lg mb-2">Write on CommunityVoices</h3>
                                <p className="text-blue-100 text-sm mb-4">Share your ideas with thousands of readers.</p>
                                <button className="bg-white text-blue-700 px-4 py-2 rounded-lg text-sm font-bold w-full hover:bg-blue-50 transition">Get Started</button>
                            </div>
                        )}

                        <div>
                            <h3 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-4">
                                <span className="p-1 bg-orange-100 text-orange-600 rounded"><FaFire /></span> Trending
                            </h3>
                            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
                                {trendingBlogs.length > 0 ? trendingBlogs.map((blog, idx) => (
                                    <div
                                        key={blog._id}
                                        onClick={() => setSelectedBlog(blog)}
                                        className="p-4 border-b border-gray-100 dark:border-zinc-800 last:border-0 hover:bg-gray-50 dark:hover:bg-zinc-800/50 cursor-pointer transition flex items-start gap-3"
                                    >
                                        <span className="text-2xl font-bold text-gray-200 dark:text-zinc-700">0{idx + 1}</span>
                                        <div>
                                            <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200 line-clamp-2 mb-1">{blog.title}</h4>
                                            <span className="text-[10px] text-gray-400">{blog.authorName}</span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="p-4 text-sm text-gray-500">Not enough data yet.</div>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-4">
                                <span className="p-1 bg-green-100 text-green-600 rounded"><FaHashtag /></span> Popular Tags
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {["react", "nextjs", "javascript", "life", "coding", "design"].map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => setSearchTerm(tag)}
                                        className="px-3 py-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-full text-xs text-gray-600 dark:text-gray-300 hover:border-blue-500 hover:text-blue-500 cursor-pointer transition"
                                    >
                                        #{tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="text-xs text-gray-400 leading-relaxed border-t border-gray-200 dark:border-zinc-800 pt-4">
                            &copy; 2026 Community Voices.
                        </div>
                    </div>
                </div>
            </div>


            {/* --- READING MODAL --- */}
            {selectedBlog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-zinc-900/60 dark:bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setSelectedBlog(null)}></div>

                    <div className="relative bg-white dark:bg-zinc-950 w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

                        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur z-10 sticky top-0">
                            <div className="flex items-center gap-3">
                                <img src={selectedBlog.authorImage || "/default-avatar.png"} className="w-8 h-8 rounded-full" alt="Author" />
                                <div className="leading-tight">
                                    <p className="font-bold text-sm">{selectedBlog.authorName}</p>
                                    <p className="text-[10px] text-gray-500">{new Date(selectedBlog.createdAt).toDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => copyLink(selectedBlog._id)} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full" title="Copy Link"><FaLink /></button>
                                {canDelete(selectedBlog.authorEmail) && (
                                    <button
                                        onClick={() => handleDeleteBlog(selectedBlog._id)}
                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                                        title="Delete Story"
                                    >
                                        <FaTrash />
                                    </button>
                                )}
                                <button
                                    onClick={() => setSelectedBlog(null)}
                                    className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        </div>

                        {/* --- MODAL BODY --- */}
                        <div className="overflow-y-auto p-6 md:p-10 space-y-6">

                            {/* Title & Tags */}
                            <div className="space-y-4">
                                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
                                    {selectedBlog.title}
                                </h1>

                                {selectedBlog.tags && selectedBlog.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {selectedBlog.tags.map((tag, i) => (
                                            <span key={i} className="px-3 py-1 rounded-md text-sm font-medium bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Main Content */}
                            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                {selectedBlog.content}
                            </div>

                            <div className="border-t border-gray-100 dark:border-zinc-800 my-8"></div>

                            {/* --- COMMENTS SECTION --- */}
                            <div className="bg-gray-50 dark:bg-zinc-900/50 rounded-xl p-6">
                                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                                    Discussion
                                    <span className="bg-gray-200 dark:bg-zinc-700 text-xs px-2 py-0.5 rounded-full text-gray-700 dark:text-gray-300">
                                        {selectedBlog.comments?.length || 0}
                                    </span>
                                </h3>

                                {/* 1. Comment Input */}
                                {session ? (
                                    <form onSubmit={(e) => handleCommentSubmit(e)} className="mb-8 relative group">
                                        <textarea
                                            className="w-full bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 pr-12 outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-y transition-shadow shadow-sm"
                                            placeholder="What are your thoughts on this?"
                                            value={mainCommentText}
                                            onChange={(e) => setMainCommentText(e.target.value)}
                                        />
                                        <button
                                            type="submit"
                                            disabled={!mainCommentText.trim()}
                                            className="absolute bottom-3 right-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            <FaPaperPlane />
                                        </button>
                                    </form>
                                ) : (
                                    <div className="text-center p-6 border border-dashed border-gray-300 dark:border-zinc-700 rounded-xl mb-8">
                                        <p className="text-gray-500 text-sm">
                                            <Link href="/auth/signin" className="text-blue-600 font-bold hover:underline">Sign in</Link> to join the discussion.
                                        </p>
                                    </div>
                                )}

                                {/* 2. Comment List */}
                                <div className="space-y-8">
                                    {selectedBlog.comments && selectedBlog.comments.length > 0 ? (
                                        selectedBlog.comments.map((comment) => (
                                            <CommentNode
                                                key={comment._id}
                                                comment={comment}
                                                session={session}
                                                activeReplyId={activeReplyId}
                                                setActiveReplyId={setActiveReplyId}
                                                replyText={replyText}
                                                setReplyText={setReplyText}
                                                handleReplySubmit={handleCommentSubmit} // Pass your submit handler
                                                handleDelete={handleDeleteComment}      // Pass your delete handler
                                                canDelete={canDelete}
                                                depth={0}
                                            />
                                        ))
                                    ) : (
                                        <div className="text-center py-10 flex flex-col items-center justify-center text-gray-400">
                                            <FaCommentAlt className="text-2xl mb-2 opacity-20" />
                                            <p className="text-sm">No comments yet. Be the first to start the conversation!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}