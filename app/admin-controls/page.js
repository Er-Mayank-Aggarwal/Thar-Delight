export const revalidate = 30;
import Link from "next/link";
import {
  IndianRupee,
  ShoppingCart,
  Package,
  ArrowRight,
  CheckCircle2,
  Truck,
  AlertCircle,
  Star,
  AlertTriangle,
  Users,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-amber-100 text-amber-700",
    icon: AlertCircle,
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-blue-100 text-blue-700",
    icon: CheckCircle2,
  },
  packed: {
    label: "Packed",
    color: "bg-indigo-100 text-indigo-700",
    icon: Package,
  },
  shipped: {
    label: "Shipped",
    color: "bg-purple-100 text-purple-700",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    color: "bg-emerald-100 text-emerald-700",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700",
    icon: AlertCircle,
  },
  returned: {
    label: "Returned",
    color: "bg-gray-100 text-gray-700",
    icon: AlertCircle,
  },
};

const defaultStatus = {
  label: "Unknown",
  color: "bg-gray-100 text-gray-500",
  icon: AlertCircle,
};

export default async function AdminDashboard() {
  const [
    totalProducts,
    inventory,
    recentDbOrders,
    revenueAgg,
    totalOrders,
    totalCustomers,
    pendingOrders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.inventory.findMany({
      where: { quantity: { lte: 10 } },
      include: { product: { select: { name: true } } },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { user: true },
    }),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.count({
      where: { orderStatus: { in: ["PENDING", "CONFIRMED"] } },
    }),
  ]);

  const recentOrders = recentDbOrders.map(order => ({
    id: order.id.slice(0, 8).toUpperCase(),
    customer: { name: order.user?.name || "Guest" },
    date: order.createdAt,
    time: order.createdAt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    total: order.total,
    status: order.orderStatus.toLowerCase(),
  }));

  const bestSellers = []; // Will populate when real orders come in

  const lowStockItems = inventory
    .filter((i) => i.quantity <= i.lowStockThreshold)
    .map((i) => ({ ...i, productName: i.product.name }));

  const totalRevenue = revenueAgg._sum.total || 0;
  
  const pendingReviews = 0; // isApproved was removed from DB schema

  const stats = [
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      iconColor: "#10b981",
      bgLight: "bg-emerald-50",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingCart,
      iconColor: "#3b82f6",
      bgLight: "bg-blue-50",
    },
    {
      title: "Customers",
      value: totalCustomers,
      icon: Users,
      iconColor: "#8b5cf6",
      bgLight: "bg-violet-50",
    },
    {
      title: "Needs Attention",
      value: pendingOrders,
      icon: AlertCircle,
      iconColor: "#f59e0b",
      bgLight: "bg-amber-50",
    },
  ];

  // Max qty for bar chart scaling
  const maxQty = bestSellers.length > 0 ? bestSellers[0].qty : 1;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif !text-brand-brown">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back! Here&apos;s what&apos;s happening with your store.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-brand-sand/30 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {stat.title}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-brand-brown mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.bgLight} p-2.5 rounded-xl`}>
                  <Icon size={22} style={{ color: stat.iconColor }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alerts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <Link
            href="/admin-controls/inventory"
            className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-start gap-3 hover:bg-amber-100/50 transition-colors group"
          >
            <AlertTriangle
              size={20}
              className="text-amber-500 mt-0.5 flex-shrink-0"
            />
            <div>
              <p className="text-sm font-semibold text-amber-800">
                {lowStockItems.length} product
                {lowStockItems.length > 1 ? "s" : ""} low on stock
              </p>
              <p className="text-xs text-amber-600 mt-0.5">
                {lowStockItems.map((i) => i.productName).join(", ")}
              </p>
              <span className="text-xs text-amber-700 font-medium mt-1 inline-flex items-center gap-1 group-hover:underline">
                Go to Inventory <ArrowRight size={12} />
              </span>
            </div>
          </Link>
        )}

        {/* Pending Reviews Alert */}
        {pendingReviews > 0 && (
          <Link
            href="/admin-controls/reviews"
            className="bg-blue-50 border border-blue-200 rounded-2xl px-5 py-4 flex items-start gap-3 hover:bg-blue-100/50 transition-colors group"
          >
            <Star
              size={20}
              className="text-blue-500 mt-0.5 flex-shrink-0"
            />
            <div>
              <p className="text-sm font-semibold text-blue-800">
                {pendingReviews} review{pendingReviews > 1 ? "s" : ""} waiting
                for approval
              </p>
              <p className="text-xs text-blue-600 mt-0.5">
                New customer reviews need your attention
              </p>
              <span className="text-xs text-blue-700 font-medium mt-1 inline-flex items-center gap-1 group-hover:underline">
                Review Now <ArrowRight size={12} />
              </span>
            </div>
          </Link>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Orders — 3 columns */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-brand-sand/30 overflow-hidden">
          <div className="flex items-center justify-between px-5 sm:px-6 py-5 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-serif !text-brand-brown">
                Recent Orders
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Latest orders from your customers
              </p>
            </div>
            <Link
              href="/admin-controls/orders"
              className="text-sm text-brand-gold hover:text-brand-gold-dark font-medium flex items-center gap-1 transition-colors"
            >
              View All
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="divide-y divide-gray-50">
            {recentOrders.map((order) => {
              const statusInfo = statusConfig[order.status] || defaultStatus;
              const StatusIcon = statusInfo.icon;
              return (
                <div
                  key={order.id}
                  className="px-5 sm:px-6 py-4 flex items-center justify-between hover:bg-brand-cream/20 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {order.customer.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {order.id} ·{" "}
                        {new Date(order.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                        {order.time && ` at ${order.time}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-sm font-semibold text-brand-brown hidden sm:block">
                      ₹{order.total.toLocaleString("en-IN")}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
                    >
                      <StatusIcon size={12} />
                      <span className="hidden sm:inline">
                        {statusInfo.label}
                      </span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Best Sellers — 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-brand-sand/30 overflow-hidden">
          <div className="px-5 sm:px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-serif !text-brand-brown">
              Best Sellers
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Top products by quantity sold
            </p>
          </div>

          <div className="px-5 sm:px-6 py-4 space-y-4">
            {bestSellers.map((item, index) => (
              <div key={item.name} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0
                          ? "bg-brand-gold text-white"
                          : index === 1
                          ? "bg-gray-300 text-white"
                          : "bg-brand-cream text-brand-brown"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-700 truncate max-w-[140px]">
                      {item.name}
                    </span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-sm font-bold text-brand-brown">
                      {item.qty}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">sold</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      index === 0
                        ? "bg-brand-gold"
                        : index === 1
                        ? "bg-brand-gold-light"
                        : "bg-brand-sand"
                    }`}
                    style={{
                      width: `${(item.qty / maxQty) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-[10px] text-gray-400">
                  Revenue: ₹{item.revenue.toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

