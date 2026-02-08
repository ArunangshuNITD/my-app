"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

export default function StorePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Sort States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]); // now multi-select
  const [priceRange, setPriceRange] = useState([0, 1000]);      // min-max price in ₹
  const [minRating, setMinRating] = useState(0);               // 0 = any, 1-5
  const [sortBy, setSortBy] = useState("newest");              // newest | price-low | price-high | rating | trending

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

  // Dynamic subjects
  const allSubjects = useMemo(() => {
    const tags = products.flatMap((p) => p.subjects || []);
    return [...new Set(tags)].sort();
  }, [products]);

  // Filtered & Sorted Products
  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        false;

      const matchesSubjects =
        selectedSubjects.length === 0 ||
        selectedSubjects.some((sub) => product.subjects?.includes(sub));

      const price = Number(product.price);
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];

      const matchesRating = product.rating >= minRating;

      return matchesSearch && matchesSubjects && matchesPrice && matchesRating;
    });

    // Sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-high":
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "trending":
        // Proxy: rating * totalRatings (higher engagement = trending)
        result.sort((a, b) => (b.rating * (b.totalRatings || 1)) - (a.rating * (a.totalRatings || 1)));
        break;
      case "newest":
      default:
        // Assume you add createdAt field or sort by _id reverse
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
    }

    return result;
  }, [products, searchQuery, selectedSubjects, priceRange, minRating, sortBy]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedSubjects([]);
    setPriceRange([0, 1000]);
    setMinRating(0);
    setSortBy("newest");
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl font-medium text-gray-700 dark:text-gray-300">Loading amazing notes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-10 text-center border border-red-100 dark:border-red-900/40">
          <h2 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">Oops!</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-lg transition shadow-md hover:shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Explore Study Notes
          </h1>

          <div className="relative w-full lg:w-80">
            <input
              type="text"
              placeholder="Search notes, subjects, authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm transition-all"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {/* Top Filters Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1 flex items-center gap-3">
                <div className="hidden sm:block text-sm text-gray-600 dark:text-gray-300 font-medium">Subjects:</div>
                <div className="flex gap-2 overflow-x-auto py-1">
                  {allSubjects.map((sub) => {
                    const active = selectedSubjects.includes(sub);
                    return (
                      <button
                        key={sub}
                        onClick={() =>
                          setSelectedSubjects((prev) => (active ? prev.filter((s) => s !== sub) : [...prev, sub]))
                        }
                        className={`whitespace-nowrap px-3 py-1.5 rounded-full border text-sm transition ${
                          active
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600"
                        }`}
                      >
                        {sub}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-3 ml-auto">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                >
                  <option value="newest">Newest</option>
                  <option value="trending">Trending</option>
                  <option value="rating">Top Rated</option>
                  <option value="price-low">Price ⬆</option>
                  <option value="price-high">Price ⬇</option>
                </select>

                <button
                  onClick={resetFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <label className="text-sm text-gray-600 dark:text-gray-300 mb-2 block">Price max: ₹{priceRange[1]}</label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="50"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-600 dark:text-gray-300">Min Rating:</div>
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      onClick={() => setMinRating(val)}
                      className={`px-3 py-1 rounded-md text-sm transition ${
                        minRating === val ? "bg-yellow-100 dark:bg-yellow-900/40" : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {val === 0 ? "Any" : "★".repeat(val)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1">
            {filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-24 bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600">
                <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  No notes found
                </h2>
                <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
                  Try adjusting filters or search terms
                </p>
                <button
                  onClick={resetFilters}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition shadow-md"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
                {filteredAndSortedProducts.map((product) => (
                  <Link
                    href={`/store/${product._id}`}
                    key={product._id}
                    className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col h-full transform hover:-translate-y-1"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                      <img
                        src={product.coverImage}
                        alt={product.name}
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />
                      {product.subjects?.length > 0 && (
                        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                          {product.subjects.slice(0, 2).map((sub, i) => (
                            <span
                              key={i}
                              className="bg-black/70 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium"
                            >
                              {sub}
                            </span>
                          ))}
                        </div>
                      )}
                      {product.rating > 4.5 && (
                        <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                          Trending
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-3">
                        {product.name}
                      </h3>

                      <div className="mt-auto space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                            ₹{Number(product.price).toLocaleString("en-IN")}
                          </p>
                          {product.rating > 0 && (
                            <div className="flex items-center gap-1 text-yellow-500 font-medium">
                              <span className="text-xl">★</span>
                              {product.rating.toFixed(1)}
                              <span className="text-gray-500 dark:text-gray-400 text-sm">
                                ({product.totalRatings || 0})
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}