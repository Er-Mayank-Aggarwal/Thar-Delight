"use client";

import { useState } from "react";
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { trackOrderPublic } from "@/app/actions/track-actions";

const STATUS_STEPS = ["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED"];

export default function TrackOrderPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setOrder(null);

    const res = await trackOrderPublic(query.trim());
    if (res.success) {
      setOrder(res.order);
    } else {
      setError(res.error || "Order not found");
    }
    setLoading(false);
  };

  const getStepIndex = (status) => {
    const idx = STATUS_STEPS.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  return (
    <div className="bg-brand-warm-white min-h-screen py-12 lg:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-brand-gold text-xs font-bold tracking-widest uppercase mb-2">Order Tracking</p>
          <h1 className="font-serif text-3xl sm:text-4xl text-brand-brown font-bold mb-3">Track Your Shipment</h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Enter your Order ID (from invoice or SMS) or the 10-digit phone number used during checkout.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-sand/60 shadow-sm mb-8">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Order ID (e.g. #THAR-1234) or Phone Number"
                className="w-full pl-11 pr-4 py-3.5 bg-brand-cream/40 border border-brand-sand/80 rounded-2xl text-brand-brown placeholder-gray-400 focus:outline-none focus:border-brand-gold transition-colors text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-8 py-3.5 bg-brand-gold hover:bg-brand-gold-dark text-white font-semibold rounded-2xl transition-all shadow-md shadow-brand-gold/20 disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:w-auto"
            >
              {loading ? "Searching..." : "Track Order"}
              <ArrowRight size={16} />
            </button>
          </form>

          {error && (
            <p className="text-red-500 text-sm mt-4 text-center bg-red-50 py-2.5 px-4 rounded-xl border border-red-100">
              {error}
            </p>
          )}
        </div>

        {/* Order Result */}
        {order && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-sand/60 shadow-md animate-fade-in-up space-y-8">
            
            {/* Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-brand-sand/40">
              <div>
                <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">Order ID</span>
                <p className="font-serif text-2xl font-bold text-brand-brown">#{order.shortId}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">Current Status</span>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                    order.orderStatus === "DELIVERED"
                      ? "bg-emerald-100 text-emerald-800"
                      : order.orderStatus === "CANCELLED"
                      ? "bg-red-100 text-red-800"
                      : "bg-brand-gold/15 text-brand-gold-dark"
                  }`}>
                    {order.orderStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Step Progress Visualizer */}
            {order.orderStatus !== "CANCELLED" && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-6">Delivery Progress</h3>
                <div className="relative flex items-center justify-between">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-sand/40 w-full z-0" />
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-gold transition-all duration-500 z-0"
                    style={{
                      width: `${(getStepIndex(order.orderStatus) / (STATUS_STEPS.length - 1)) * 100}%`,
                    }}
                  />

                  {STATUS_STEPS.map((step, idx) => {
                    const isDone = getStepIndex(order.orderStatus) >= idx;
                    const isCurrent = order.orderStatus === step;

                    return (
                      <div key={step} className="relative z-10 flex flex-col items-center">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isDone
                              ? "bg-brand-gold text-white shadow-md shadow-brand-gold/30"
                              : "bg-white border-2 border-brand-sand text-gray-400"
                          } ${isCurrent ? "ring-4 ring-brand-gold/20" : ""}`}
                        >
                          {isDone ? <CheckCircle2 size={16} /> : idx + 1}
                        </div>
                        <span className={`text-[11px] font-semibold mt-2 capitalize hidden sm:block ${
                          isDone ? "text-brand-brown" : "text-gray-400"
                        }`}>
                          {step.toLowerCase()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Shipment Details if Available */}
            {order.shipment && (
              <div className="bg-brand-cream/30 p-5 rounded-2xl border border-brand-sand/60 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Courier Partner</p>
                  <p className="text-base font-bold text-brand-brown mt-0.5">{order.shipment.courierName || "Standard Express"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">AWB Tracking Number</p>
                  <p className="text-base font-mono font-bold text-brand-gold mt-0.5">{order.shipment.trackingNumber || "Pending generation"}</p>
                </div>
              </div>
            )}

            {/* Destination & Items */}
            <div className="pt-4 border-t border-brand-sand/40 space-y-4">
              {order.destination && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={16} className="text-brand-gold flex-shrink-0" />
                  <span>Delivering to <strong>{order.destination}</strong></span>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Order Items ({order.items.length})</h4>
                <div className="space-y-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-brand-cream/20 rounded-xl border border-brand-sand/30 text-sm">
                      <span className="font-medium text-brand-brown">{item.name}</span>
                      <span className="text-xs text-gray-500 bg-white px-2.5 py-1 rounded-full border border-brand-sand/50">Qty: {item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-brand-sand/40 text-center">
              <Link
                href={`/invoice/${order.id}`}
                className="text-xs font-bold text-brand-gold hover:underline uppercase tracking-wider"
              >
                View Full Itemized Invoice →
              </Link>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

