"use client";

import { useEffect, useState, use } from "react";
import { useCart } from "@/context/CartContext";

export default function ProductPage({ params }) {
  // Unwrap params for Next.js 15
  const { id } = use(params);
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Review States
  const [reviewData, setReviewData] = useState({ user: "", rating: 5, comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0); // For star hover effect

  // Wooden theme styles
  const woodBG = {
    backgroundImage: `
      linear-gradient(180deg, #efe0c8 0%, #e6cfab 30%, #d4ad72 60%, #b98a4a 100%),
      repeating-linear-gradient(90deg, rgba(0,0,0,0.03) 0 2px, rgba(255,255,255,0.02) 2px 6px),
      linear-gradient(180deg, rgba(0,0,0,0.03), rgba(255,255,255,0.02))
    `,
    backgroundSize: "100% 100%, 8px 100%, 100% 100%",
    backgroundColor: "#efe0c8",
  };

  const frameStyle = {
    border: "6px solid #5b3a21",
    boxShadow: "inset 0 2px 0 rgba(255,255,255,0.06), 0 8px 30px rgba(11,7,4,0.25)",
    background: "linear-gradient(180deg,#fff8ef, #f4e6cf)",
  };

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
        setHoverRating(0);
        fetchProduct();
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
    <div className="max-w-6xl mx-auto p-4 md:p-8 font-serif" style={woodBG}>
      {/* Product Details (Framed) */}
      <div style={frameStyle} className="p-6 rounded-lg">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="rounded overflow-hidden shadow-inner bg-stone-100">
            <img src={product.coverImage} alt={product.name} className="w-full h-full object-cover" />
          </div>

          <div>
            <h1 className="text-4xl font-bold mb-2 text-[#3b271b]">{product.name}</h1>
            
            {/* Display Rating Stars */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-600 text-2xl">
                {"★".repeat(Math.round(product.rating))}
                <span className="text-gray-400">{"★".repeat(5 - Math.round(product.rating))}</span>
              </div>
              <span className="text-gray-600 text-sm font-sans mt-1">({product.totalRatings} reviews)</span>
            </div>

            <p className="text-3xl font-bold mb-6 text-[#3b271b]">₹{product.price}</p>
            <p className="text-gray-700 mb-8">{product.description}</p>
            <button 
              onClick={() => addToCart(product)}
              className="bg-[#5b3a21] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#482713] transition-colors shadow-lg"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <hr className="my-12 border-stone-400/30" />

      {/* Reviews Section */}
      <div className="grid md:grid-cols-3 gap-12">
        
        {/* Review Form */}
        <div className="md:col-span-1">
          <h2 className="text-2xl font-bold mb-4 text-[#3b271b]">Write a Review</h2>
          <form onSubmit={handleReviewSubmit} className="space-y-5 bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-[#d4ad72]">
            
            {/* Interactive Star Rating Input */}
            <div>
              <label className="block text-sm font-bold text-[#5b3a21] mb-2 uppercase tracking-wide">Rating</label>
              <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewData({ ...reviewData, rating: star })}
                    onMouseEnter={() => setHoverRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                  >
                    <span 
                      className={`text-3xl transition-colors duration-200 ${
                        star <= (hoverRating || reviewData.rating) 
                          ? "text-yellow-500 drop-shadow-sm" 
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1 font-sans">
                {hoverRating || reviewData.rating} out of 5 stars
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#5b3a21] mb-1">Your Name</label>
              <input 
                required
                className="w-full p-3 rounded-lg border border-stone-300 bg-white focus:ring-2 focus:ring-[#b98a4a] outline-none transition"
                placeholder="John Doe"
                value={reviewData.user}
                onChange={(e) => setReviewData({...reviewData, user: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#5b3a21] mb-1">Comment</label>
              <textarea 
                required
                rows="4"
                className="w-full p-3 rounded-lg border border-stone-300 bg-white focus:ring-2 focus:ring-[#b98a4a] outline-none transition"
                placeholder="What did you think about this book?"
                value={reviewData.comment}
                onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-[#5b3a21] text-white py-3 rounded-lg font-bold hover:bg-[#3b271b] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Posting..." : "Post Review"}
            </button>
          </form>
        </div>

        {/* Reviews List */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-6 text-[#3b271b]">Reader Reviews</h2>
          
          {(!product.reviews || product.reviews.length === 0) ? (
            <div className="p-8 border-2 border-dashed border-[#d4ad72] rounded-xl text-center text-[#5b3a21] opacity-70">
              No reviews yet. Be the first to share your thoughts!
            </div>
          ) : (
            <div className="space-y-6">
              {product.reviews?.map((rev) => (
                <div key={rev._id || Math.random()} className="bg-white/60 p-5 rounded-xl border border-stone-200 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                        <h4 className="font-bold text-lg text-[#3b271b]">{rev.user}</h4>
                        <div className="flex text-yellow-500 text-sm">
                            {"★".repeat(rev.rating)}
                            <span className="text-gray-300">{"★".repeat(5-rev.rating)}</span>
                        </div>
                    </div>
                    <span className="text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded-full font-sans">
                      {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Just now'}
                    </span>
                  </div>
                  <p className="text-stone-700 leading-relaxed font-sans">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}