"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

export default function StorePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Sort States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 2000]); // Increased max range
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("newest");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

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

  // Dynamic subjects extraction
  const allSubjects = useMemo(() => {
    const tags = products.flatMap((p) => p.subjects || []);
    return [...new Set(tags)].sort();
  }, [products]);

  // Logic: Filter & Sort
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
      const matchesRating = (product.rating || 0) >= minRating;

      return matchesSearch && matchesSubjects && matchesPrice && matchesRating;
    });

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
      case "newest":
      default:
        // Fallback to ID if createdAt is missing, assuming newer IDs are higher
        result.sort((a, b) => (b.createdAt || b._id) > (a.createdAt || a._id) ? 1 : -1);
        break;
    }
    return result;
  }, [products, searchQuery, selectedSubjects, priceRange, minRating, sortBy]);

  // Helper to toggle subjects
  const toggleSubject = (sub) => {
    setSelectedSubjects((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedSubjects([]);
    setPriceRange([0, 2000]);
    setMinRating(0);
    setSortBy("newest");
  };

  // Decorative inline styles for an old-library wooden vibe
  const woodBG = {
    backgroundImage: `
      linear-gradient(180deg, #efe0c8 0%, #e6cfab 30%, #d4ad72 60%, #b98a4a 100%),
      repeating-linear-gradient(90deg, rgba(0,0,0,0.03) 0 2px, rgba(255,255,255,0.02) 2px 6px),
      linear-gradient(180deg, rgba(0,0,0,0.03), rgba(255,255,255,0.02))
    `,
    backgroundSize: "100% 100%, 8px 100%, 100% 100%",
    backgroundRepeat: "no-repeat, repeat, no-repeat",
    backgroundBlendMode: "multiply, overlay, normal",
    backgroundColor: "#efe0c8",
  };

  const frameStyle = {
    border: "6px solid #5b3a21",
    boxShadow: "inset 0 2px 0 rgba(255,255,255,0.06), 0 8px 30px rgba(11,7,4,0.25)",
    background: "linear-gradient(180deg,#fff8ef, #f4e6cf)",
  };

  // --- Render Components ---

  // Sidebar Filter Component
  const FilterSidebar = () => (
    <div className="space-y-8">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search Title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 focus:ring-2 focus:ring-amber-600 outline-none transition-all shadow-sm"
        />
        <svg className="absolute left-3 top-3.5 h-5 w-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Subjects */}
      <div>
        <h3 className="font-serif text-lg font-bold text-stone-800 dark:text-stone-200 mb-3">Categories</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
          {allSubjects.map((sub) => (
            <label key={sub} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                selectedSubjects.includes(sub) ? "bg-amber-600 border-amber-600" : "border-stone-400 bg-white dark:bg-stone-800"
              }`}>
                {selectedSubjects.includes(sub) && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </div>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={selectedSubjects.includes(sub)} 
                onChange={() => toggleSubject(sub)} 
              />
              <span className={`text-stone-600 dark:text-stone-400 group-hover:text-amber-700 dark:group-hover:text-amber-500 transition-colors`}>{sub}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-serif text-lg font-bold text-stone-800 dark:text-stone-200 mb-3">Price Range</h3>
        <input
          type="range"
          min="0"
          max="2000"
          step="50"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([0, Number(e.target.value)])}
          className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
        />
        <div className="flex justify-between text-sm text-stone-500 mt-2 font-mono">
          <span>₹0</span>
          <span>₹{priceRange[1]}+</span>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-serif text-lg font-bold text-stone-800 dark:text-stone-200 mb-3">Customer Rating</h3>
        <div className="space-y-1">
          {[4, 3, 2, 1].map((star) => (
            <button
              key={star}
              onClick={() => setMinRating(minRating === star ? 0 : star)}
              className={`flex items-center gap-2 w-full px-2 py-1.5 rounded transition-colors ${
                minRating === star ? "bg-amber-50 dark:bg-amber-900/20" : "hover:bg-stone-100 dark:hover:bg-stone-800"
              }`}
            >
              <div className="flex text-amber-500">
                {"★".repeat(star)}{"☆".repeat(5 - star)}
              </div>
              <span className="text-sm text-stone-600 dark:text-stone-400">& Up</span>
            </button>
          ))}
        </div>
      </div>
      
      <button onClick={resetFilters} className="w-full py-2 text-sm text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 underline">
        Reset All Filters
      </button>
    </div>
  );

  // --- Main View ---

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
      <div className="text-center animate-pulse">
        <div className="text-4xl mb-4">📚</div>
        <p className="font-serif text-xl text-stone-600 dark:text-stone-400">Opening the library...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950 p-4">
      <div className="max-w-md w-full bg-white dark:bg-stone-900 p-8 rounded-xl shadow-xl text-center border-t-4 border-red-500">
        <h2 className="text-2xl font-serif font-bold text-stone-800 dark:text-stone-100 mb-2">Shelf Error</h2>
        <p className="text-stone-600 dark:text-stone-400 mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-stone-800 text-white rounded hover:bg-black transition">Reload Library</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen text-stone-900 dark:text-stone-100 font-serif" style={woodBG}>
      
      {/* Top Navigation / Header */}
      <header
        className="sticky top-0 z-30 px-4 sm:px-8 py-4"
        style={{ background: "#e8d2b0cc", borderBottom: "4px solid #6b3f24", boxShadow: "0 6px 20px rgba(11,7,4,0.18)" }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-amber-700 dark:text-amber-500 flex items-center gap-2">
            <span>📖</span> The Study Nook
          </h1>
          
              <div className="flex items-center gap-4">
            {/* Sort Dropdown (Visible on Desktop) */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-stone-500 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-sm font-bold text-stone-800 dark:text-stone-200 cursor-pointer outline-none hover:text-amber-600"
              >
                <option value="newest">New Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Best Rated</option>
              </select>
            </div>

            {/* Mobile Filter Toggle */}
            <button 
              className="lg:hidden p-2 text-stone-600 dark:text-stone-300"
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex gap-10 relative">
        
        {/* Sidebar (Desktop) */}
        <aside className="hidden lg:block w-64 sticky top-24 h-fit shrink-0">
          <FilterSidebar />
        </aside>

        {/* Sidebar (Mobile Slide-over) */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)}></div>
            <div className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-stone-900 shadow-2xl p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-serif font-bold">Filters</h2>
                <button onClick={() => setIsMobileFilterOpen(false)} className="text-stone-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <FilterSidebar />
            </div>
          </div>
        )}

        {/* Product Grid */}
        <main className="flex-1 min-h-[60vh]">
                <div className="mb-6 flex items-center justify-between">
            <p className="text-stone-500 dark:text-stone-400 text-sm">
              Showing <span className="font-bold text-stone-900 dark:text-stone-100">{filteredAndSortedProducts.length}</span> results
            </p>
          </div>

          {filteredAndSortedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-xl bg-white/50 dark:bg-stone-900/50">
              <span className="text-6xl mb-4 opacity-50">🧐</span>
              <h3 className="text-xl font-serif font-bold text-stone-700 dark:text-stone-300 mb-2">No matches found</h3>
              <p className="text-stone-500 mb-6">Try searching for a different author or topic.</p>
              <button onClick={resetFilters} className="text-amber-600 font-bold hover:underline">Clear all filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredAndSortedProducts.map((product) => (
                <Link
                  href={`/store/${product._id}`}
                  key={product._id}
                  className="group relative flex flex-col rounded-lg transition-all duration-300 ease-out hover:-translate-y-1"
                  style={{ ...frameStyle }}
                >
                  {/* Image Container with "Book Spine" effect */}
                  <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg bg-stone-200 dark:bg-stone-800">
                    {/* Shadow overlay for spine effect */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-r from-black/20 to-transparent z-10"></div>
                    
                    <img
                      src={product.coverImage}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Badges */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                       {product.rating >= 4.5 && (
                        <span className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 text-[10px] font-bold px-2 py-1 rounded shadow-sm border border-amber-200 dark:border-amber-700 uppercase tracking-wide">
                          Best Seller
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1 bg-transparent">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-2">
                       {product.subjects?.slice(0, 2).map((sub, i) => (
                         <span key={i} className="text-[10px] uppercase tracking-wider font-bold text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
                           {sub}
                         </span>
                       ))}
                    </div>

                    <h3 className="font-serif font-bold text-lg text-[#3b271b] leading-tight mb-2 group-hover:text-[#5b3a21] transition-colors">
                      {product.name}
                    </h3>
                    
                    <p className="text-sm text-stone-500 dark:text-stone-400 line-clamp-2 mb-4 flex-1">
                      {product.description}
                    </p>

                        <div className="border-t border-stone-100 dark:border-stone-800 pt-3 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs text-stone-400 uppercase font-semibold">Price</span>
                        <span className="text-xl font-bold text-stone-800 dark:text-white">₹{product.price}</span>
                      </div>
                      
                      {product.rating > 0 && (
                        <div className="flex flex-col items-end">
                           <span className="text-xs text-stone-400 uppercase font-semibold">Rating</span>
                           <div className="flex items-center gap-1 text-amber-500">
                             <span className="font-bold">{product.rating}</span>
                             <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                           </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}