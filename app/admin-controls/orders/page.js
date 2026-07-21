"use client";

import { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Eye,
  X,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  Package,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  ArrowUpDown,
} from "lucide-react";
import { getAdminOrders, updateOrderStatus } from "@/app/actions/admin-actions";

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-amber-100 text-amber-700",
    icon: AlertCircle,
    dotColor: "bg-amber-500",
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-blue-100 text-blue-700",
    icon: CheckCircle2,
    dotColor: "bg-blue-500",
  },
  packed: {
    label: "Packed",
    color: "bg-indigo-100 text-indigo-700",
    icon: Package,
    dotColor: "bg-indigo-500",
  },
  shipped: {
    label: "Shipped",
    color: "bg-purple-100 text-purple-700",
    icon: Truck,
    dotColor: "bg-purple-500",
  },
  delivered: {
    label: "Delivered",
    color: "bg-emerald-100 text-emerald-700",
    icon: CheckCircle2,
    dotColor: "bg-emerald-500",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700",
    icon: AlertCircle,
    dotColor: "bg-red-500",
  },
  returned: {
    label: "Returned",
    color: "bg-gray-100 text-gray-600",
    icon: AlertCircle,
    dotColor: "bg-gray-500",
  },
};

const defaultStatus = {
  label: "Unknown",
  color: "bg-gray-100 text-gray-500",
  icon: AlertCircle,
  dotColor: "bg-gray-400",
};

const statusFlow = ["pending", "confirmed", "packed", "shipped", "delivered"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, oldest-pending

  useEffect(() => {
    getAdminOrders().then((data) => {
      setOrders(data);
      setIsLoading(false);
    });
  }, []);

  // Filter orders
  let filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.displayId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || o.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Sort orders
  filteredOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === "oldest-pending") {
      // Pending/processing first, then by oldest date
      const aIsPending = a.status === "pending" || a.status === "processing";
      const bIsPending = b.status === "pending" || b.status === "processing";
      if (aIsPending && !bIsPending) return -1;
      if (!aIsPending && bIsPending) return 1;
      return new Date(a.date + "T" + (a.time || "00:00")) - new Date(b.date + "T" + (b.time || "00:00"));
    }
    if (sortBy === "oldest") {
      return new Date(a.date + "T" + (a.time || "00:00")) - new Date(b.date + "T" + (b.time || "00:00"));
    }
    // newest
    return new Date(b.date + "T" + (b.time || "00:00")) - new Date(a.date + "T" + (a.time || "00:00"));
  });

  // Update order status (persisted to DB)
  const handleStatusUpdate = async (orderId, newStatus) => {
    // Optimistic update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }

    // Persist to database
    const result = await updateOrderStatus(orderId, newStatus);
    if (!result.success) {
      // Revert on failure
      console.error("Failed to update status:", result.error);
      getAdminOrders().then(setOrders);
    }
  };

  // Get next status in flow
  const getNextStatus = (currentStatus) => {
    const currentIndex = statusFlow.indexOf(currentStatus);
    if (currentIndex < statusFlow.length - 1) {
      return statusFlow[currentIndex + 1];
    }
    return null;
  };

  // Get action button label
  const getActionLabel = (currentStatus) => {
    switch (currentStatus) {
      case "pending":
        return "Confirm Order";
      case "confirmed":
        return "Mark as Packed";
      case "packed":
        return "Mark as Shipped";
      case "shipped":
        return "Mark as Delivered";
      default:
        return null;
    }
  };

  // Status counts for quick filters
  const statusCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    packed: orders.filter((o) => o.status === "packed").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
    returned: orders.filter((o) => o.status === "returned").length,
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif !text-brand-brown">
          Orders
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Track and manage customer orders
        </p>
      </div>

      {/* Status Quick Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: "all", label: "All Orders" },
          { key: "pending", label: "Pending" },
          { key: "confirmed", label: "Confirmed" },
          { key: "packed", label: "Packed" },
          { key: "shipped", label: "Shipped" },
          { key: "delivered", label: "Delivered" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              filterStatus === tab.key
                ? "bg-brand-brown text-white shadow-sm"
                : "bg-white text-gray-500 hover:bg-brand-cream border border-brand-sand/30"
            }`}
          >
            {tab.label}
            <span
              className={`ml-1.5 text-xs ${
                filterStatus === tab.key ? "text-white/70" : "text-gray-400"
              }`}
            >
              ({statusCounts[tab.key]})
            </span>
          </button>
        ))}
      </div>

      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by order ID or customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-brand-sand/50 rounded-xl text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all"
          />
        </div>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none w-full sm:w-56 pl-4 pr-10 py-2.5 bg-white border border-brand-sand/50 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="oldest-pending">⚠ Oldest Pending First</option>
          </select>
          <ArrowUpDown
            size={16}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-brand-sand/30 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <th className="text-left px-6 py-4">Order ID</th>
                <th className="text-left px-6 py-4">Customer</th>
                <th className="text-left px-6 py-4">Items</th>
                <th className="text-left px-6 py-4">Date</th>
                <th className="text-right px-6 py-4">Total</th>
                <th className="text-center px-6 py-4">Status</th>
                <th className="text-center px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.map((order) => {
                const statusInfo = statusConfig[order.status] || defaultStatus;
                const StatusIcon = statusInfo.icon;
                const nextStatus = getNextStatus(order.status);
                const actionLabel = getActionLabel(order.status);
                return (
                  <tr
                    key={order.id}
                    className="hover:bg-brand-cream/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-mono font-medium text-brand-brown">
                      {order.displayId}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-800">
                        {order.customer.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {order.customer.phone}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {order.items.length} item
                      {order.items.length > 1 ? "s" : ""}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-500">
                        {new Date(order.date).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", 
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                      {order.time && (
                        <p className="text-[10px] text-gray-400">
                          at {order.time}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-brand-brown text-right">
                      ₹{order.total.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
                      >
                        <StatusIcon size={13} />
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 rounded-lg text-gray-400 hover:text-brand-gold hover:bg-brand-gold/10 transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        {nextStatus && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(order.id, nextStatus)
                            }
                            className="px-3 py-1.5 bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-gold-dark rounded-lg text-xs font-medium transition-colors"
                          >
                            {actionLabel}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {filteredOrders.map((order) => {
            const statusInfo = statusConfig[order.status] || defaultStatus;
            const StatusIcon = statusInfo.icon;
            const nextStatus = getNextStatus(order.status);
            const actionLabel = getActionLabel(order.status);
            return (
              <div key={order.id} className="px-5 py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono font-medium text-brand-brown">
                    {order.displayId}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}
                  >
                    <StatusIcon size={12} />
                    {statusInfo.label}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {order.customer.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {order.items.length} item
                      {order.items.length > 1 ? "s" : ""} ·{" "}
                      {new Date(order.date).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", 
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-brand-brown">
                    ₹{order.total.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors text-center"
                  >
                    View Details
                  </button>
                  {nextStatus && (
                    <button
                      onClick={() =>
                        handleStatusUpdate(order.id, nextStatus)
                      }
                      className="flex-1 px-3 py-2 bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-gold-dark rounded-xl text-xs font-medium transition-colors text-center"
                    >
                      {actionLabel}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {isLoading ? (
          <div className="text-center py-16 px-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-brown mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Package size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-500 font-medium">No orders found</p>
            <p className="text-gray-400 text-sm mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        ) : null}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-serif !text-brand-brown">
                  Order {selectedOrder.displayId}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Placed on{" "}
                  {new Date(selectedOrder.date).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", 
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-6">
              {/* Status */}
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                  Order Status
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  {statusFlow.map((status) => {
                    const info = statusConfig[status];
                    const StatusIcon = info.icon;
                    const isCurrent = selectedOrder.status === status;
                    const isPast =
                      statusFlow.indexOf(status) <
                      statusFlow.indexOf(selectedOrder.status);
                    return (
                      <button
                        key={status}
                        onClick={() =>
                          handleStatusUpdate(selectedOrder.id, status)
                        }
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all border ${
                          isCurrent
                            ? `${info.color} border-current shadow-sm`
                            : isPast
                            ? "bg-gray-50 text-gray-400 border-gray-100"
                            : "bg-white text-gray-400 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <StatusIcon size={14} />
                        {info.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                  Customer Details
                </p>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2.5">
                  <p className="text-sm font-medium text-gray-800">
                    {selectedOrder.customer.name}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Mail size={14} className="text-gray-400 flex-shrink-0" />
                    {selectedOrder.customer.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Phone size={14} className="text-gray-400 flex-shrink-0" />
                    {selectedOrder.customer.phone}
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-500">
                    <MapPin
                      size={14}
                      className="text-gray-400 flex-shrink-0 mt-0.5"
                    />
                    {selectedOrder.customer.address}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                  Items Ordered
                </p>
                <div className="space-y-2.5">
                  {selectedOrder.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          Qty: {item.qty} × ₹{item.price}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-brand-brown">
                        ₹{(item.qty * item.price).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total & Payment */}
              <div className="flex items-center justify-between bg-brand-cream rounded-xl px-4 py-3.5">
                <div className="flex items-center gap-2">
                  <CreditCard size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {selectedOrder.paymentMethod}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Total Amount</p>
                  <p className="text-lg font-bold text-brand-brown">
                    ₹{selectedOrder.total.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


