"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CreatePost() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    category: "General",
    content: "",
  });

  if (status === "loading") return <div className="p-10 text-center">Loading...</div>;
  
  // Protect the page
  if (status === "unauthenticated") {
    router.push("/api/auth/signin");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Post submitted for approval!");
        router.push("/blogs"); // Redirect to blog feed
      } else {
        const error = await res.json();
        alert(error.error || "Something went wrong");
      }
    } catch (err) {
      alert("Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12 dark:bg-black">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
        <h1 className="mb-6 text-3xl font-bold text-zinc-900 dark:text-white">Create a Post</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Title</label>
            <input
              type="text"
              required
              className="mt-1 w-full rounded-md border border-zinc-300 p-2 dark:border-zinc-700 dark:bg-zinc-800"
              placeholder="e.g. How to master React"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Category</label>
            <select
              className="mt-1 w-full rounded-md border border-zinc-300 p-2 dark:border-zinc-700 dark:bg-zinc-800"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option>General</option>
              <option>Technical</option>
              <option>Career Advice</option>
              <option>Mentorship</option>
            </select>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Short Summary (Excerpt)</label>
            <textarea
              required
              rows={2}
              className="mt-1 w-full rounded-md border border-zinc-300 p-2 dark:border-zinc-700 dark:bg-zinc-800"
              placeholder="A brief preview of your post..."
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Content</label>
            <textarea
              required
              rows={8}
              className="mt-1 w-full rounded-md border border-zinc-300 p-2 dark:border-zinc-700 dark:bg-zinc-800 font-mono text-sm"
              placeholder="Write your blog content here (Markdown or Plain text)..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-md px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}