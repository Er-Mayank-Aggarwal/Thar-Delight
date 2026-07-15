"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import ProductCard from "../components/ProductCard";
import { getAllProducts, getAllCategories } from "@/app/actions/product-actions";
import { Filter, SlidersHorizontal, ArrowUpDown } from "lucide-react";

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = searchParams.get("category") || "all";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState(1200); // Max price
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);

  useEffect(() => {
    Promise.all([getAllProducts(), getAllCategories()]).then(([productsData, categoriesData]) => {
      setAllProducts(productsData);
      setFilteredProducts(productsData);
      setDbCategories(categoriesData);
    });
  }, []);

  // Sync state with query parameters
  useEffect(() => {
    const category = searchParams.get("category") || "all";
    setSelectedCategory(category);
  }, [searchParams]);

  // Handle filtering and sorting
  useEffect(() => {
    if (allProducts.length === 0) return;
    let result = [...allProducts];

    // Filter by Search Query
    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription?.toLowerCase().includes(q) ||
          p.category?.name?.toLowerCase().includes(q)
      );
    }

    // Filter by Category
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category?.slug === selectedCategory);
    }

    // Filter by Price
    result = result.filter((p) => p.price <= priceRange);

    // Sorting
    if (sortBy === "price-low-high") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high-low") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "alphabetical") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(result);
  }, [selectedCategory, sortBy, priceRange]);

  const handleCategorySelect = (categorySlug) => {
    setSelectedCategory(categorySlug);
    // Update URL query parameters
    if (categorySlug === "all") {
      router.push("/shop");
    } else {
      router.push(`/shop?category=${categorySlug}`);
    }
  };

  return (
    <div className="bg-brand-warm-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Banner header */}
        <div className="relative rounded-3xl overflow-hidden bg-brand-brown py-16 px-8 text-center mb-10 shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(195,154,95,0.15),transparent_70%)]" />
          <h1 className="font-serif text-4xl sm:text-5xl !text-white mb-4 relative z-10">
            Thar Delight Store
          </h1>
          <p className="text-white/60 text-sm sm:text-base max-w-md mx-auto relative z-10">
            Authentic, organic treats and handcrafted wooden serveware directly from local Rajasthani artisans.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">

          {/* Sidebar Filters */}
          <div className="bg-white rounded-2xl p-6 border border-brand-sand/60 h-fit space-y-8">
            <div>
              <h3 className="font-serif text-lg text-brand-brown font-semibold mb-4 flex items-center gap-2 pb-2 border-b border-brand-sand">
                <Filter size={18} className="text-brand-gold" />
                Categories
              </h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleCategorySelect("all")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${selectedCategory === "all"
                      ? "bg-brand-gold text-white font-semibold"
                      : "text-gray-500 hover:bg-brand-cream hover:text-brand-brown"
                      }`}
                  >
                    All Categories ({allProducts.length})
                  </button>
                </li>
                {dbCategories.map((cat) => {
                  const productCount = allProducts.filter(p => p.category?.slug === cat.slug).length;
                  return (
                  <li key={cat.id}>
                    <button
                      onClick={() => handleCategorySelect(cat.slug)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${selectedCategory === cat.slug
                        ? "bg-brand-gold text-white font-semibold"
                        : "text-gray-500 hover:bg-brand-cream hover:text-brand-brown"
                        }`}
                    >
                      <span>{cat.name}</span>
                      <span className={selectedCategory === cat.slug ? "text-white/80" : "text-gray-400 text-xs"}>
                        ({productCount})
                      </span>
                    </button>
                  </li>
                  );
                })}
              </ul>
            </div>

            {/* Filter by Price */}
            <div>
              <h3 className="font-serif text-lg text-brand-brown font-semibold mb-4 flex items-center gap-2 pb-2 border-b border-brand-sand">
                <SlidersHorizontal size={18} className="text-brand-gold" />
                Filter by Price
              </h3>
              <div className="space-y-4 pt-2">
                <input
                  type="range"
                  min="100"
                  max="1200"
                  step="50"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-brand-gold cursor-pointer"
                />
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Min: ₹100</span>
                  <span className="font-semibold text-brand-brown bg-brand-cream px-3 py-1 rounded-full">
                    Max: ₹{priceRange}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3 space-y-6">

            {/* Sorting & Stats */}
            <div className="bg-white rounded-2xl p-4 border border-brand-sand/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-sm text-gray-500 font-medium">
                Showing {filteredProducts.length} of {allProducts.length} products
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <ArrowUpDown size={16} className="text-brand-gold" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-brand-cream text-brand-brown border-none outline-none text-sm px-4 py-2 rounded-full font-semibold cursor-pointer w-full sm:w-auto focus:ring-2 focus:ring-brand-gold/30"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="alphabetical">Alphabetical</option>
                </select>
              </div>
            </div>

            {/* Catalog Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl py-24 text-center border border-brand-sand/60">
                <span className="text-6xl block mb-4">🔍</span>
                <h3 className="font-serif text-2xl text-brand-brown mb-2">No Products Found</h3>
                <p className="text-gray-400 text-sm max-w-xs mx-auto">
                  Try adjusting your filters or search terms to explore other products.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setPriceRange(1200);
                  }}
                  className="mt-6 px-6 py-2.5 bg-brand-gold hover:bg-brand-gold-dark text-white text-sm font-semibold rounded-full transition-all"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-warm-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-gold" />
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
