"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

// 1. EXTRACTED COMPONENT: Defined completely outside of StorePage!
// This guarantees React will never unmount it while typing.
const FilterSidebar = ({
  searchQuery,
  setSearchQuery,
  allSubjects,
  selectedSubjects,
  toggleSubject,
  priceRange,
  setPriceRange,
  minRating,
  setMinRating,
  resetFilters
}) => (
  <div className="space-y-6">
    {/* Search */}
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
      <div className="relative">
        <input
          type="text"
          placeholder="Search Title, Author..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-amber-200 dark:border-amber-900/30 bg-white dark:bg-stone-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all shadow-sm"
        />
        <svg className="absolute left-3 top-3.5 h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    {/* Subjects */}
    <div className="bg-gradient-to-br from-white/50 to-amber-50/30 dark:from-stone-900/50 dark:to-stone-800/30 p-4 rounded-xl border border-amber-100/50 dark:border-amber-900/20 backdrop-blur-sm">
      <h3 className="font-serif text-lg font-bold text-amber-900 dark:text-amber-300 mb-4 flex items-center gap-2">
        <span className="text-xl">📚</span> Categories
      </h3>
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
        {allSubjects.map((sub) => (
          <label key={sub} className="flex items-center gap-3 cursor-pointer group/item">
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all transform ${
              selectedSubjects.includes(sub) 
                ? "bg-gradient-to-br from-amber-500 to-orange-600 border-amber-600 shadow-md scale-110" 
                : "border-amber-300 dark:border-amber-900/50 bg-white dark:bg-stone-800 group-hover/item:border-amber-500"
            }`}>
              {selectedSubjects.includes(sub) && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
            </div>
            <input 
              type="checkbox" 
              className="hidden" 
              checked={selectedSubjects.includes(sub)} 
              onChange={() => toggleSubject(sub)} 
            />
            <span className={`text-sm transition-all ${selectedSubjects.includes(sub) ? 'text-amber-700 dark:text-amber-400 font-semibold' : 'text-stone-600 dark:text-stone-400 group-hover/item:text-amber-700 dark:group-hover/item:text-amber-500'}`}>{sub}</span>
          </label>
        ))}
      </div>
    </div>

    {/* Price Range */}
    <div className="bg-gradient-to-br from-white/50 to-orange-50/30 dark:from-stone-900/50 dark:to-stone-800/30 p-4 rounded-xl border border-orange-100/50 dark:border-orange-900/20 backdrop-blur-sm">
      <h3 className="font-serif text-lg font-bold text-orange-900 dark:text-orange-300 mb-4 flex items-center gap-2">
        <span className="text-xl">💰</span> Price Range
      </h3>
      <input
        type="range"
        min="0"
        max="2000"
        step="50"
        value={priceRange[1]}
        onChange={(e) => setPriceRange([0, Number(e.target.value)])}
        className="w-full h-3 bg-gradient-to-r from-orange-200 to-orange-300 dark:from-orange-900/30 dark:to-orange-900/50 rounded-lg appearance-none cursor-pointer accent-orange-500 shadow-sm"
      />
      <div className="flex justify-between text-sm text-stone-600 dark:text-stone-400 mt-3 font-mono font-bold">
        <span>₹0</span>
        <span>₹{priceRange[1]}+</span>
      </div>
    </div>

    {/* Rating */}
    <div className="bg-gradient-to-br from-white/50 to-yellow-50/30 dark:from-stone-900/50 dark:to-stone-800/30 p-4 rounded-xl border border-yellow-100/50 dark:border-yellow-900/20 backdrop-blur-sm">
      <h3 className="font-serif text-lg font-bold text-yellow-900 dark:text-yellow-300 mb-4 flex items-center gap-2">
        <span className="text-xl">⭐</span> Customer Rating
      </h3>
      <div className="space-y-2">
        {[4, 3, 2, 1].map((star) => (
          <button
            key={star}
            onClick={() => setMinRating(minRating === star ? 0 : star)}
            className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg transition-all transform ${
              minRating === star 
                ? "bg-yellow-100 dark:bg-yellow-900/40 border-2 border-yellow-400 dark:border-yellow-600 scale-105" 
                : "hover:bg-stone-100 dark:hover:bg-stone-800 border border-transparent hover:border-yellow-200 dark:hover:border-yellow-900/50"
            }`}
          >
            <div className="flex text-yellow-500 text-lg">
              {"★".repeat(star)}{"☆".repeat(5 - star)}
            </div>
            <span className="text-sm text-stone-600 dark:text-stone-400 font-medium">& Up</span>
          </button>
        ))}
      </div>
    </div>
    
    <button 
      onClick={resetFilters} 
      className="w-full py-3 text-sm font-bold text-white bg-gradient-to-r from-stone-700 to-stone-800 hover:from-stone-800 hover:to-stone-900 rounded-lg transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
    >
      🔄 Reset All Filters
    </button>
  </div>
);

// 2. MAIN COMPONENT
export default function StorePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Sort States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 2000]);
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

  const allSubjects = useMemo(() => {
    const tags = products.flatMap((p) => p.subjects || []);
    return [...new Set(tags)].sort();
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesSearch =
        (product.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSubjects =
        selectedSubjects.length === 0 ||
        selectedSubjects.some((sub) => product.subjects?.includes(sub));

      const price = Number(product.price || 0);
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
      const matchesRating = (product.rating || 0) >= minRating;

      return matchesSearch && matchesSubjects && matchesPrice && matchesRating;
    });

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
        break;
      case "price-high":
        result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
      default:
        result.sort((a, b) => ((b.createdAt || b._id) > (a.createdAt || a._id) ? 1 : -1));
        break;
    }
    return result;
  }, [products, searchQuery, selectedSubjects, priceRange, minRating, sortBy]);

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
    boxShadow: "0 12px 40px rgba(11,7,4,0.15), 0 0 1px rgba(255,255,255,0.5) inset",
    background: "linear-gradient(135deg,#fff8ef 0%, #f4e6cf 100%)",
    backdropFilter: "blur(1px)",
  };

  // --- Render Returns Below ---

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
      <header className="sticky top-0 z-30 px-4 sm:px-8 py-4" style={{ background: "#e8d2b0cc", borderBottom: "4px solid #6b3f24", boxShadow: "0 6px 20px rgba(11,7,4,0.18)" }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-amber-700 dark:text-amber-500 flex items-center gap-2">
            <span>📖</span> The Study Nook
          </h1>
          <div className="flex items-center gap-4">
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
            <button className="lg:hidden p-2 text-stone-600 dark:text-stone-300" onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex gap-10 relative">
        <aside className="hidden lg:block w-64 sticky top-24 h-fit shrink-0">
          {/* 3. Render the extracted component and pass props */}
          <FilterSidebar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            allSubjects={allSubjects}
            selectedSubjects={selectedSubjects}
            toggleSubject={toggleSubject}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            minRating={minRating}
            setMinRating={setMinRating}
            resetFilters={resetFilters}
          />
        </aside>

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
              {/* Do the same for the mobile view! */}
              <FilterSidebar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                allSubjects={allSubjects}
                selectedSubjects={selectedSubjects}
                toggleSubject={toggleSubject}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                minRating={minRating}
                setMinRating={setMinRating}
                resetFilters={resetFilters}
              />
            </div>
          </div>
        )}

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
                  <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg bg-stone-200 dark:bg-stone-800">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-r from-black/20 to-transparent z-10"></div>
                    <img
                      src={product.coverImage}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                      {product.rating >= 4.5 && (
                        <span className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 text-[10px] font-bold px-2 py-1 rounded shadow-sm border border-amber-200 dark:border-amber-700 uppercase tracking-wide">
                          Best Seller
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1 bg-transparent">
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