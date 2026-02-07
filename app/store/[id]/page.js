"use client";

import { useEffect, useState, use } from "react";
import { useCart } from "@/context/CartContext"; // Import Context

export default function ProductPage({ params }) {
  const { id } = use(params);
  const { addToCart } = useCart(); // Get addToCart function

  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdded, setIsAdded] = useState(false); // Visual feedback state

  useEffect(() => {
    if (!id) return;

    fetch(`/api/products/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to fetch product");
        }
        return res.json();
      })
      .then((data) => setProduct(data))
      .catch((err) => {
        console.error("Fetch Error:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000); // Reset button after 2s
  };

  if (loading) return <div className="p-8 text-center">Loading product...</div>;
  
  if (error) return (
    <div className="p-8 text-center text-red-500">
      <h2 className="text-xl font-bold">Error</h2>
      <p>{error}</p>
    </div>
  );

  if (!product) return <div className="p-8 text-center">Product not found.</div>;

  return (
    <div className="p-8 grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
      <img
        src={product.coverImage}
        alt={product.name}
        className="w-full rounded-xl object-cover shadow-lg"
      />

      <div className="flex flex-col justify-center">
        <h1 className="text-4xl font-bold mb-2">{product.name}</h1>

        <p className="text-yellow-500 text-lg mb-4">
          ⭐ {product.rating || "No ratings yet"}
        </p>

        <p className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          ₹{product.price}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {product.subjects?.map((s) => (
            <span key={s} className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700">
              #{s}
            </span>
          ))}
        </div>

        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
          {product.description}
        </p>

        <p className="mb-6">
          Status:{" "}
          <span className={`font-bold ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </p>

        <button
          disabled={product.stock <= 0}
          onClick={handleAddToCart}
          className={`w-full md:w-auto px-8 py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 ${
            isAdded 
              ? "bg-green-600 text-white" 
              : "bg-black dark:bg-white dark:text-black text-white hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
          }`}
        >
          {isAdded ? "Added to Cart! ✓" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}