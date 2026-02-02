"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch ALL blogs (Pending & Approved)
  const fetchBlogs = async () => {
    try {
      // We pass mode=admin to get everything, not just approved ones
      // Ensure this URL is correct
      const res = await fetch("/api/blogs?mode=admin", { cache: "no-store" });
      const data = await res.json();
      setBlogs(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch blogs");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // 2. Handle Approval / Rejection
  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        // Refresh the list to show updated status
        fetchBlogs();
      }
    } catch (error) {
      alert("Something went wrong");
    }
  };

  if (loading) return <div className="p-8">Loading requests...</div>;

  // Filter to show Pending requests at the top
  const pendingBlogs = blogs.filter((b) => b.status === "pending");
  const otherBlogs = blogs.filter((b) => b.status !== "pending");

  return (
    <div className="min-h-screen bg-zinc-50 p-8 dark:bg-zinc-900">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Blog Requests</h1>
          <Link href="/dashboard" className="text-sm text-indigo-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>

        {/* --- PENDING REQUESTS SECTION --- */}
        <div className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-orange-600">
            ⚠️ Pending Approval ({pendingBlogs.length})
          </h2>

          {pendingBlogs.length === 0 ? (
            <p className="text-zinc-500">No pending requests.</p>
          ) : (
            <div className="space-y-4">
              {pendingBlogs.map((blog) => (
                <div key={blog._id} className="rounded-lg bg-white p-6 shadow-md border border-orange-100 dark:bg-black dark:border-zinc-800">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{blog.title}</h3>
                      <p className="text-sm text-zinc-500">By {blog.authorName} ({blog.authorEmail})</p>
                      <p className="mt-2 text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-900 p-2 rounded text-sm">
                        "{blog.excerpt}"
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(blog._id, "approved")}
                        className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(blog._id, "rejected")}
                        className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
                      >
                        Reject
                      </button>
                    </div>
                  </div>

                  {/* Preview Link */}
                  <div className="mt-4">
                    <Link href={`/blogs/${blog._id}`} className="text-xs text-indigo-500 underline" target="_blank">
                      Preview Content
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <hr className="my-8 border-zinc-200 dark:border-zinc-800" />

        {/* --- HISTORY SECTION --- */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">Request History</h2>
          <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Author</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {otherBlogs.map((blog) => (
                  <tr key={blog._id}>
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">{blog.title}</td>
                    <td className="px-4 py-3 text-zinc-500">{blog.authorName}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${blog.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                        }`}>
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => updateStatus(blog._id, "pending")}
                        className="text-indigo-600 hover:underline"
                      >
                        Re-evaluate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}