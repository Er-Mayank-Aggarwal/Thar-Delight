"use client";

import { useState, useEffect } from "react";
import {
  Star,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ChevronDown,
} from "lucide-react";
import { getAdminReviews, approveReview, deleteReview } from "@/app/actions/admin-actions";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [filterApproval, setFilterApproval] = useState("all"); // all, approved, pending

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    getAdminReviews().then(setReviews);
  }, []);

  const handleApprove = async (id) => {
    if (isProcessing) return;
    setIsProcessing(true);
    const res = await approveReview(id);
    if (res.success) {
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, isApproved: true } : r))
      );
    }
    setIsProcessing(false);
  };

  const handleReject = async (id) => {
    if (isProcessing) return;
    setIsProcessing(true);
    const res = await deleteReview(id);
    if (res.success) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
    }
    setIsProcessing(false);
  };

  const filtered = reviews.filter((r) => {
    if (filterApproval === "approved") return r.isApproved;
    if (filterApproval === "pending") return !r.isApproved;
    return true;
  });

  const pendingCount = reviews.filter((r) => !r.isApproved).length;
  const avgRating = (
    reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
  ).toFixed(1);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={
          i < rating
            ? "fill-amber-400 text-amber-400"
            : "fill-gray-200 text-gray-200"
        }
      />
    ));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif !text-brand-brown">
          Reviews & Ratings
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage customer reviews across all products
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-brand-sand/30 shadow-sm">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Average Rating
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-bold text-brand-brown">
              {avgRating}
            </span>
            <div className="flex">{renderStars(Math.round(avgRating))}</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-brand-sand/30 shadow-sm">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Total Reviews
          </p>
          <p className="text-2xl font-bold text-brand-brown mt-1">
            {reviews.length}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-brand-sand/30 shadow-sm">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Pending Approval
          </p>
          <p className="text-2xl font-bold text-brand-brown mt-1">
            {pendingCount}
            {pendingCount > 0 && (
              <span className="ml-2 inline-block w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            )}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { key: "all", label: "All Reviews" },
          { key: "pending", label: `⏳ Pending (${pendingCount})` },
          { key: "approved", label: "✓ Approved" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterApproval(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filterApproval === tab.key
                ? "bg-brand-brown text-white"
                : "bg-white text-gray-500 hover:bg-brand-cream border border-brand-sand/30"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Review Cards */}
      <div className="space-y-4">
        {filtered.map((review) => (
          <div
            key={review.id}
            className={`bg-white rounded-2xl border shadow-sm p-5 sm:p-6 transition-all ${
              !review.isApproved
                ? "border-amber-200 bg-amber-50/30"
                : "border-brand-sand/30"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              {/* Review Content */}
              <div className="flex-1 space-y-2.5">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex">{renderStars(review.rating)}</div>
                  {!review.isApproved && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700">
                      Pending Approval
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-700 leading-relaxed">
                  &ldquo;{review.comment}&rdquo;
                </p>

                <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                  <span className="font-medium text-gray-600">
                    {review.customer.name}
                  </span>
                  <span>·</span>
                  <span>{review.product.name}</span>
                  <span>·</span>
                  <span>
                    {new Date(review.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Actions */}
              {!review.isApproved && (
                <div className="flex sm:flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleApprove(review.id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-medium transition-colors"
                  >
                    <CheckCircle2 size={14} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(review.id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-medium transition-colors"
                  >
                    <XCircle size={14} />
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <MessageSquare size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500 font-medium">No reviews found</p>
          <p className="text-gray-400 text-sm mt-1">
            {filterApproval === "pending"
              ? "All reviews have been approved!"
              : "No reviews to display."}
          </p>
        </div>
      )}
    </div>
  );
}


