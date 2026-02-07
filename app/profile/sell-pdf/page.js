"use client";

import { useState } from "react";
import { createProduct } from "@/app/actions/productActions";
import { FaFilePdf, FaImage, FaUpload, FaTag } from "react-icons/fa";

export default function SellPdfPage() {
  const [loading, setLoading] = useState(false);
  const [pdfName, setPdfName] = useState("");
  const [imageName, setImageName] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const pdfFile = form.pdf.files[0];
    const imageFile = form.thumbnail.files[0];

    // Validation
    if (!pdfFile) {
      alert("Please select a PDF file.");
      setLoading(false);
      return;
    }
    if (!imageFile) {
      alert("Please select a Cover Image.");
      setLoading(false);
      return;
    }

    try {
      // 1️⃣ Upload PDF
      const pdfData = new FormData();
      pdfData.append("file", pdfFile);
      
      const pdfRes = await fetch("/api/upload-pdf", { 
        method: "POST", 
        body: pdfData 
      });
      
      if (!pdfRes.ok) throw new Error("PDF upload failed");
      const { url: pdfUrl } = await pdfRes.json();

      // 2️⃣ Upload Cover Image (Reusing similar logic, ensure you have an API route for images)
      // If you don't have a separate route, you can use a generic upload route
      const imgData = new FormData();
      imgData.append("file", imageFile);

      const imgRes = await fetch("/api/upload-image", { // Make sure this route exists
        method: "POST", 
        body: imgData 
      });

      if (!imgRes.ok) throw new Error("Image upload failed");
      const { url: imageUrl } = await imgRes.json();

      // 3️⃣ Create Product
      const productData = new FormData();
      productData.append("name", form.name.value);
      productData.append("description", form.description.value);
      productData.append("price", form.price.value);
      productData.append("stock", form.stock.value);
      productData.append("subjects", form.subjects.value);
      productData.append("pdfUrl", pdfUrl);     // Save PDF Link
      productData.append("coverImage", imageUrl); // Save Image Link

      await createProduct(productData);

      alert("PDF listed successfully!");
      form.reset();
      setPdfName("");
      setImageName("");

    } catch (error) {
      console.error(error);
      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center px-4 py-10">
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
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white"
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
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white"
            />
          </div>
        </div>

        {/* Subjects */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-2">
            <FaTag /> Subjects (comma separated)
          </label>
          <input
            name="subjects"
            placeholder="Physics, Maths"
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white"
          />
        </div>

        {/* --- File Uploads Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* PDF Upload */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Upload PDF File
            </label>
            <label className="flex flex-col items-center justify-center cursor-pointer border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition text-center h-32">
              <FaFilePdf className="text-red-500 text-3xl mb-2" />
              <span className="text-xs text-zinc-600 dark:text-zinc-400 break-all px-2">
                {pdfName || "Select PDF"}
              </span>
              <input
                name="pdf"
                type="file"
                accept="application/pdf"
                required
                hidden
                onChange={(e) => setPdfName(e.target.files?.[0]?.name || "")}
              />
            </label>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Upload Cover Image
            </label>
            <label className="flex flex-col items-center justify-center cursor-pointer border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition text-center h-32">
              <FaImage className="text-blue-500 text-3xl mb-2" />
              <span className="text-xs text-zinc-600 dark:text-zinc-400 break-all px-2">
                {imageName || "Select Image (JPG/PNG)"}
              </span>
              <input
                name="thumbnail"
                type="file"
                accept="image/*"
                required
                hidden
                onChange={(e) => setImageName(e.target.files?.[0]?.name || "")}
              />
            </label>
          </div>

        </div>

        {/* Submit Button */}
        <button
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 rounded-lg font-medium transition mt-4"
        >
          {loading ? (
            <span>Processing...</span>
          ) : (
            <>
              <FaUpload /> Publish Product
            </>
          )}
        </button>
      </form>
    </div>
  );
}