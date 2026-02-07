"use client";

import { useEffect, useState, use } from "react"; // 1. Import 'use'
import { buyProduct } from "@/app/actions/productActions";

export default function ProductPage({ params }) {
  // 2. Unwrap the params promise using 'use()'
  const { id } = use(params); 

  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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
      .then((data) => {
        setProduct(data);
      })
      .catch((err) => {
        console.error("Fetch Error:", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="p-8">Loading...</p>;
  
  if (error) return (
    <div className="p-8 text-red-500">
      <h2 className="text-xl font-bold">Error</h2>
      <p>{error}</p>
    </div>
  );

  if (!product) return <p className="p-8">Product not found.</p>;

  return (
    <div className="p-8 grid md:grid-cols-2 gap-10">
      <img
        src={product.coverImage}
        alt={product.name}
        className="w-full rounded-lg object-cover"
      />

      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>

        <p className="text-yellow-500 mt-2">
          ⭐ {product.rating || "No ratings yet"}
        </p>

        <p className="text-xl font-semibold mt-4">
          ₹{product.price}
        </p>

        <div className="flex gap-2 mt-3">
          {product.subjects.map((s) => (
            <span
              key={s}
              className="text-xs bg-gray-200 px-2 py-1 rounded"
            >
              #{s}
            </span>
          ))}
        </div>

        <p className="mt-4 text-gray-600">{product.description}</p>

        <p className="mt-4">
          Stock:{" "}
          <strong>
            {product.stock > 0 ? product.stock : "Out of stock"}
          </strong>
        </p>

        <button
          disabled={product.stock <= 0}
          onClick={async () => {
            await buyProduct(product._id);
            setProduct((prev) => ({
              ...prev,
              stock: prev.stock - 1,
            }));
          }}
          className="mt-6 bg-black text-white px-6 py-3 rounded disabled:opacity-50"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}