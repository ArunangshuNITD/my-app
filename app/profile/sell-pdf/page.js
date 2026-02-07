"use client";

import { useState } from "react";
import { createProduct } from "@/app/actions/productActions";
import { FaFilePdf, FaUpload, FaTag } from "react-icons/fa";

export default function SellPdfPage() {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const pdfFile = form.pdf.files[0];

    if (!pdfFile) {
      alert("Please select a PDF");
      setLoading(false);
      return;
    }

    // 1️⃣ Upload PDF
    const uploadData = new FormData();
    uploadData.append("file", pdfFile);

    const uploadRes = await fetch("/api/upload-pdf", {
      method: "POST",
      body: uploadData,
    });

    if (!uploadRes.ok) {
      alert("PDF upload failed");
      setLoading(false);
      return;
    }

    const { url } = await uploadRes.json();

    // 2️⃣ Create product
    const productData = new FormData();
    productData.append("name", form.name.value);
    productData.append("description", form.description.value);
    productData.append("price", form.price.value);
    productData.append("stock", form.stock.value);
    productData.append("subjects", form.subjects.value);
    productData.append("pdfUrl", url);

    await createProduct(productData);

    setLoading(false);
    alert("PDF listed successfully!");
    form.reset();
    setFileName("");
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-8 space-y-6"
      >
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Sell Your PDF
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Upload notes, guides, or study material to sell.
          </p>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            PDF Title
          </label>
          <input
            name="name"
            placeholder="JEE Physics Complete Notes"
            required
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Well-structured notes with solved examples and PYQs."
            required
            rows={4}
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Price & Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Price (₹)
            </label>
            <input
              name="price"
              type="number"
              required
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Stock
            </label>
            <input
              name="stock"
              type="number"
              required
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Subjects */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-2">
            <FaTag /> Subjects
          </label>
          <input
            name="subjects"
            placeholder="Physics, Maths"
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Upload PDF
          </label>
          <label className="flex items-center gap-3 cursor-pointer border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition">
            <FaFilePdf className="text-red-500 text-2xl" />
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {fileName || "Click to select a PDF file"}
            </span>
            <input
              name="pdf"
              type="file"
              accept="application/pdf"
              required
              hidden
              onChange={e => setFileName(e.target.files?.[0]?.name || "")}
            />
          </label>
        </div>

        {/* Submit */}
        <button
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-2.5 rounded-lg font-medium transition"
        >
          <FaUpload />
          {loading ? "Uploading..." : "Sell PDF"}
        </button>
      </form>
    </div>
  );
}