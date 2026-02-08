"use client";

import { useEffect, useState, use } from "react";
import { useCart } from "@/context/CartContext";

export default function ProductPage({ params }) {
  const { id } = use(params);
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Review States
  const [reviewData, setReviewData] = useState({ user: "", rating: 5, comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchProduct();
  }, [id]);

  const fetchProduct = () => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/products/${id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });
      if (res.ok) {
        setReviewData({ user: "", rating: 5, comment: "" });
        fetchProduct(); // Refresh data to show new review
      }
    } catch (err) {
      alert("Failed to post review");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!product) return <div className="p-8 text-center">Product not found.</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      {/* Existing Product Details Section */}
      <div className="grid md:grid-cols-2 gap-10">
        <img src={product.coverImage} alt={product.name} className="w-full rounded-xl shadow-lg" />
        <div>
          <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
          <p className="text-yellow-500 text-xl mb-4">
            ★ {product.rating} <span className="text-gray-400 text-sm">({product.totalRatings} reviews)</span>
          </p>
          <p className="text-3xl font-bold mb-6">₹{product.price}</p>
          <p className="text-gray-600 dark:text-gray-300 mb-8">{product.description}</p>
          <button 
            onClick={() => addToCart(product)}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>

      <hr className="my-12 border-gray-200 dark:border-gray-800" />

      {/* Reviews Section */}
      <div className="grid md:grid-cols-3 gap-12">
        {/* Left: Review Form */}
        <div className="md:col-span-1">
          <h2 className="text-2xl font-bold mb-4">Leave a Review</h2>
          <form onSubmit={handleReviewSubmit} className="space-y-4 bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
            <div>
              <label className="block text-sm font-medium mb-1">Your Name</label>
              <input 
                required
                className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600"
                value={reviewData.user}
                onChange={(e) => setReviewData({...reviewData, user: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Rating</label>
              <select 
                className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600"
                value={reviewData.rating}
                onChange={(e) => setReviewData({...reviewData, rating: e.target.value})}
              >
                {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Comment</label>
              <textarea 
                required
                rows="4"
                className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600"
                value={reviewData.comment}
                onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
              />
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-black dark:bg-white dark:text-black text-white py-2 rounded font-bold hover:opacity-80"
            >
              {isSubmitting ? "Posting..." : "Post Review"}
            </button>
          </form>
        </div>

        {/* Right: Reviews List */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-6">User Reviews</h2>
          
          {/* UPDATED LOGIC: Check if reviews exist (not undefined) AND have length */}
          {(!product.reviews || product.reviews.length === 0) ? (
            <p className="text-gray-500 italic">No reviews yet. Be the first to rate this product!</p>
          ) : (
            <div className="space-y-6">
              {/* UPDATED LOGIC: Added optional chaining (?.) just to be safe */}
              {product.reviews?.map((rev) => (
                <div key={rev._id || Math.random()} className="border-b border-gray-100 dark:border-gray-800 pb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-lg">{rev.user}</span>
                    <span className="text-yellow-500">{"★".repeat(rev.rating)}{"☆".repeat(5-rev.rating)}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{rev.comment}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Just now'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}