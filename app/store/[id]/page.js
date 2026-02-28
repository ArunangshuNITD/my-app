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

  // Enhanced creative background
  const woodBG = {
    backgroundImage: `
      linear-gradient(135deg, #f8f5f0 0%, #f0e6d8 25%, #efe0c8 50%, #e6cfab 75%, #d4ad72 100%),
      radial-gradient(circle at 20% 50%, rgba(255,200,100,0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(180,100,50,0.1) 0%, transparent 50%)
    `,
    backgroundSize: "100% 100%, 100% 100%, 100% 100%",
    backgroundAttachment: "fixed",
    backgroundColor: "#efe0c8",
  };

  const frameStyle = {
    border: "none",
    boxShadow: "0 20px 60px rgba(11,7,4,0.2), 0 0 1px rgba(255,255,255,0.5) inset",
    background: "linear-gradient(135deg,#fff8ef 0%, #f4e6cf 100%)",
    backdropFilter: "blur(1px)",
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={woodBG}>
      <div className="text-center animate-pulse">
        <div className="text-6xl mb-4">📚</div>
        <p className="font-serif text-2xl text-amber-900">Loading your book...</p>
      </div>
    </div>
  );
  
  if (!product) return (
    <div className="min-h-screen flex items-center justify-center" style={woodBG}>
      <div className="text-center">
        <div className="text-6xl mb-4">🔍</div>
        <p className="font-serif text-2xl text-amber-900">Product not found.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen font-serif" style={woodBG}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        
        {/* Product Details Card */}
        <div style={frameStyle} className="p-8 md:p-12 rounded-2xl mb-16 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            
            {/* Product Image */}
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-amber-400/30 to-orange-400/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative rounded-xl overflow-hidden shadow-2xl bg-stone-100 dark:bg-stone-800 aspect-[3/4]">
                <img 
                  src={product.coverImage} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-amber-900 via-orange-800 to-amber-800">
                  {product.name}
                </h1>
                
                {/* Rating with enhanced visuals */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex text-3xl gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`transition-transform ${i < Math.round(product.rating) ? 'text-amber-500 drop-shadow-lg' : 'text-stone-300'}`}>
                        ★
                      </span>
                    ))}
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-amber-900">{product.rating?.toFixed(1) || 'N/A'}</span>
                    <p className="text-sm text-stone-600 dark:text-stone-400">({product.totalRatings || 0} reviews)</p>
                  </div>
                </div>
              </div>

              {/* Price Card */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6 rounded-xl border-2 border-amber-200 dark:border-amber-800/50 shadow-md">
                <p className="text-sm text-stone-600 dark:text-stone-400 font-semibold uppercase tracking-wide mb-2">Price</p>
                <p className="text-4xl font-bold text-amber-900 dark:text-amber-400">₹{product.price}</p>
              </div>

              {/* Description */}
              <p className="text-lg text-stone-700 dark:text-stone-300 leading-relaxed">
                {product.description}
              </p>

              {/* Tags */}
              {product.subjects && product.subjects.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4">
                  {product.subjects.map((subject, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50"
                    >
                      #{subject}
                    </span>
                  ))}
                </div>
              )}

              {/* Add to Cart Button */}
              <button 
                onClick={() => addToCart(product)}
                className="w-full group relative overflow-hidden bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-800 hover:to-orange-800 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-2xl active:scale-95"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span>🛒</span> Add to Cart
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Divider */}
        <div className="flex items-center gap-4 my-16">
          <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
          <span className="text-3xl">📖</span>
          <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
        </div>

        {/* Reviews Section */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Review Form */}
          <div className="md:col-span-1">
            <div style={frameStyle} className="p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-900 to-red-900 flex items-center gap-2">
                <span>✍️</span> Write a Review
              </h2>
              
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                
                {/* Star Rating Input */}
                <div>
                  <label className="block text-sm font-bold text-amber-900 dark:text-amber-300 mb-3 uppercase tracking-wide">Rating</label>
                  <div className="flex gap-1 mb-2" onMouseLeave={() => setHoverRating(0)}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewData({ ...reviewData, rating: star })}
                        onMouseEnter={() => setHoverRating(star)}
                        className="focus:outline-none transition-all transform hover:scale-125 active:scale-95"
                      >
                        <span 
                          className={`text-4xl transition-all duration-200 drop-shadow-sm ${
                            star <= (hoverRating || reviewData.rating) 
                              ? "text-yellow-500 scale-110" 
                              : "text-stone-300"
                          }`}
                        >
                          ★
                        </span>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400 font-sans italic">
                    {hoverRating || reviewData.rating} out of 5 stars
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-amber-900 dark:text-amber-300 mb-2">Your Name</label>
                  <input 
                    required
                    className="w-full px-4 py-2 rounded-lg border-2 border-amber-200 dark:border-amber-900/50 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                    placeholder="Your name here"
                    value={reviewData.user}
                    onChange={(e) => setReviewData({...reviewData, user: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-amber-900 dark:text-amber-300 mb-2">Your Thoughts</label>
                  <textarea 
                    required
                    rows="4"
                    className="w-full px-4 py-2 rounded-lg border-2 border-amber-200 dark:border-amber-900/50 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Share your thoughts about this book..."
                    value={reviewData.comment}
                    onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full group relative overflow-hidden bg-gradient-to-r from-orange-700 to-red-700 hover:from-orange-800 hover:to-red-800 disabled:from-stone-400 disabled:to-stone-500 text-white py-3 rounded-lg font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg"
                >
                  <span className="relative z-10">
                    {isSubmitting ? "⏳ Posting..." : "📤 Post Review"}
                  </span>
                </button>
              </form>
            </div>
          </div>

          {/* Reviews List */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-purple-900 flex items-center gap-2">
              <span>💬</span> Reader Reviews
            </h2>
            
            {(!product.reviews || product.reviews.length === 0) ? (
              <div className="p-10 border-2 border-dashed border-amber-300 dark:border-amber-900/40 rounded-2xl text-center">
                <div className="text-5xl mb-3 opacity-50">📝</div>
                <p className="text-lg text-stone-600 dark:text-stone-400 font-medium">
                  No reviews yet. Be the first to share your thoughts!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {product.reviews?.map((rev, idx) => (
                  <div 
                    key={rev._id || idx} 
                    className="group bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm p-6 rounded-xl border-2 border-stone-200 dark:border-stone-800 hover:border-amber-300 dark:hover:border-amber-800 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-lg text-amber-900 dark:text-amber-400">{rev.user}</h4>
                        <div className="flex gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <span 
                              key={i} 
                              className={`text-lg transition-transform ${i < rev.rating ? 'text-yellow-500 drop-shadow' : 'text-stone-300'}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-full font-sans font-semibold">
                        {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Just now'}
                      </span>
                    </div>
                    <p className="text-stone-700 dark:text-stone-300 leading-relaxed font-sans">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}