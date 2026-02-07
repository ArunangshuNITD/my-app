"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function StorePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/products")
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to fetch products");
        }
        return res.json();
      })
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Products fetch error:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-8">Loading products...</p>;
  if (error)
    return (
      <div className="p-8 text-red-500">
        <h2 className="text-xl font-bold">Error</h2>
        <p>{error}</p>
      </div>
    );

  if (!products.length) return <p className="p-8">No products found.</p>;

  return (
    <div className="p-8 grid md:grid-cols-3 gap-6">
      {products.map((product) => (
        <Link
          href={`/store/${product._id}`}
          key={product._id}
          className="border rounded-lg overflow-hidden hover:shadow-lg"
        >
          <img
            src={product.coverImage}
            alt={product.name}
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-600">₹{product.price}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}