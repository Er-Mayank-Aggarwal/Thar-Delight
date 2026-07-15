"use client";

import { useState, useEffect } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Minus,
  Plus,
  Package,
  Search,
  ArrowUpDown,
  ImageIcon,
} from "lucide-react";
import { getAllInventory, updateStock } from "@/app/actions/inventory-actions";

export default function AdminInventory() {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getAllInventory().then(data => {
      const mapped = data.map(item => ({
        ...item,
        productName: item.product.name,
        categoryName: item.product.category?.name || "Unknown",
        image: item.product.images?.[0]?.url || null,
      }));
      setStock(mapped);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const [filterView, setFilterView] = useState("all"); // all, low, ok
  const [sortBy, setSortBy] = useState("name"); // name, stock-asc, stock-desc
  const [adjustModal, setAdjustModal] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState("");

  // Filter
  let filtered = stock.filter((item) =>
    item.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filterView === "low") {
    filtered = filtered.filter((i) => i.quantity <= i.lowStockThreshold);
  } else if (filterView === "ok") {
    filtered = filtered.filter((i) => i.quantity > i.lowStockThreshold);
  }

  // Sort
  if (sortBy === "stock-asc") {
    filtered.sort((a, b) => a.quantity - b.quantity);
  } else if (sortBy === "stock-desc") {
    filtered.sort((a, b) => b.quantity - a.quantity);
  } else {
    filtered.sort((a, b) => a.productName.localeCompare(b.productName));
  }

  const lowStockCount = stock.filter(
    (i) => i.quantity <= i.lowStockThreshold
  ).length;

  // Adjust stock
  const handleAdjust = async () => {
    if (!adjustModal || adjustAmount === "") return;
    const newStock = Math.max(0, Number(adjustAmount));
    
    const result = await updateStock(adjustModal.productId, newStock);
    
    if (result.success) {
      setStock((prev) =>
        prev.map((item) =>
          item.productId === adjustModal.productId
            ? { ...item, quantity: newStock }
            : item
        )
      );
    } else {
      console.error("Failed to update stock:", result.error);
    }

    setAdjustModal(null);
    setAdjustAmount("");
  };

  const getStockLevel = (item) => {
    if (item.quantity === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-700", barColor: "bg-red-500" };
    if (item.quantity <= item.lowStockThreshold) return { label: "Low Stock", color: "bg-amber-100 text-amber-700", barColor: "bg-amber-500" };
    return { label: "In Stock", color: "bg-emerald-100 text-emerald-700", barColor: "bg-emerald-500" };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-400 text-sm">Loading inventory...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif !text-brand-brown">
          Inventory
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Track stock levels and restock products
        </p>
      </div>

      {/* Low Stock Alert */}
      {lowStockCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-start gap-3">
          <AlertTriangle size={20} className="text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              {lowStockCount} product{lowStockCount > 1 ? "s" : ""} running low on stock
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              These items need to be restocked soon to avoid going out of stock.
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-brand-sand/50 rounded-xl text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all"
          />
        </div>
        <div className="flex gap-2">
          {[
            { key: "all", label: "All" },
            { key: "low", label: "⚠ Low Stock" },
            { key: "ok", label: "✓ In Stock" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterView(tab.key)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                filterView === tab.key
                  ? "bg-brand-brown text-white"
                  : "bg-white text-gray-500 hover:bg-brand-cream border border-brand-sand/30"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          onClick={() =>
            setSortBy((prev) =>
              prev === "stock-asc" ? "stock-desc" : "stock-asc"
            )
          }
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-brand-sand/30 rounded-xl text-sm text-gray-500 hover:bg-brand-cream transition-all"
        >
          <ArrowUpDown size={16} />
          Sort by Qty
        </button>
      </div>

      {/* Inventory Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((item) => {
          const level = getStockLevel(item);
          const stockPercent = Math.min(
            100,
            (item.quantity / (item.lowStockThreshold * 5)) * 100
          );
          return (
            <div
              key={item.productId}
              className="bg-white rounded-2xl border border-brand-sand/30 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Product Image */}
              <div className="h-32 bg-brand-cream flex items-center justify-center overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon size={32} className="text-gray-300" />
                )}
              </div>

              <div className="p-4 space-y-3">
                {/* Name & Category */}
                <div>
                  <p className="text-sm font-semibold text-gray-800 leading-tight">
                    {item.productName}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {item.categoryName}
                  </p>
                </div>

                {/* Stock Bar */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-2xl font-bold text-brand-brown">
                      {item.quantity}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${level.color}`}
                    >
                      {level.label}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${level.barColor}`}
                      style={{ width: `${stockPercent}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Low threshold: {item.lowStockThreshold}
                  </p>
                </div>

                {/* Adjust Button */}
                <button
                  onClick={() => {
                    setAdjustModal(item);
                    setAdjustAmount(item.quantity);
                  }}
                  className="w-full px-4 py-2 bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-gold-dark rounded-xl text-xs font-medium transition-colors"
                >
                  Adjust Stock
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Package size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500 font-medium">No items found</p>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {adjustModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-serif !text-brand-brown mb-1">
              Adjust Stock
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {adjustModal.productName}
            </p>

            <div className="bg-gray-50 rounded-xl p-4 mb-5">
              <p className="text-xs text-gray-400 text-center mb-3">
                Current stock: <span className="font-semibold text-gray-600">{adjustModal.quantity}</span> units
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  New Stock Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="Enter new quantity"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-center text-2xl font-bold text-brand-brown focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setAdjustModal(null);
                  setAdjustAmount(0);
                }}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdjust}
                disabled={adjustAmount === ""}
                className="flex-1 px-4 py-2.5 bg-brand-gold hover:bg-brand-gold-dark disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-colors"
              >
                Update Stock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


