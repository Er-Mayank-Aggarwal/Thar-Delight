"use client";

import { useState } from "react";
import {
  Search,
  ArrowUpDown,
  Users as UsersIcon,
  Mail,
  Phone,
  MapPin,
  ShieldAlert,
  ChevronDown
} from "lucide-react";
import { updateCustomerRole } from "@/app/actions/admin-actions";
import { useRouter } from "next/navigation";

export default function AdminCustomersClient({ initialCustomers }) {
  const router = useRouter();
  const [customers, setCustomers] = useState(initialCustomers);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name"); // name, orders, spent, recent
  const [sortDir, setSortDir] = useState("desc");

  if (initialCustomers !== customers && !isUpdating) {
    setCustomers(initialCustomers);
  }

  const handleRoleChange = async (userId, newRole) => {
    if (isUpdating) return;
    setIsUpdating(true);
    const res = await updateCustomerRole(userId, newRole);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error || "Failed to update role");
    }
    setIsUpdating(false);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("desc");
    }
  };

  let filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.city && c.city.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Sort
  filtered = [...filtered].sort((a, b) => {
    let compare = 0;
    switch (sortBy) {
      case "name":
        compare = a.name.localeCompare(b.name);
        break;
      case "orders":
        compare = a.totalOrders - b.totalOrders;
        break;
      case "spent":
        compare = a.totalSpent - b.totalSpent;
        break;
      case "recent":
        compare = new Date(a.lastOrderDate) - new Date(b.lastOrderDate);
        break;
      default:
        compare = 0;
    }
    return sortDir === "asc" ? compare : -compare;
  });

  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);
  const avgOrderValue = totalCustomers === 0 ? 0 : Math.round(
    totalRevenue /
      (customers.reduce((s, c) => s + c.totalOrders, 0) || 1)
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif !text-brand-brown">
          Customers
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          View and manage your customer base
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-brand-sand/30 shadow-sm">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Total Customers
          </p>
          <p className="text-2xl font-bold text-brand-brown mt-1">
            {totalCustomers}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-brand-sand/30 shadow-sm">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Total Revenue
          </p>
          <p className="text-2xl font-bold text-brand-brown mt-1">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-brand-sand/30 shadow-sm">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Avg. Order Value
          </p>
          <p className="text-2xl font-bold text-brand-brown mt-1">
            ₹{avgOrderValue.toLocaleString("en-IN")}
          </p>
        </div>
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
            placeholder="Search by name, email, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-brand-sand/50 rounded-xl text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all"
          />
        </div>
        <div className="relative">
          <select
            value={`${sortBy}-${sortDir}`}
            onChange={(e) => {
              const [field, dir] = e.target.value.split("-");
              setSortBy(field);
              setSortDir(dir);
            }}
            className="appearance-none w-full sm:w-52 pl-4 pr-10 py-2.5 bg-white border border-brand-sand/50 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all cursor-pointer"
          >
            <option value="name-asc">Name (A → Z)</option>
            <option value="name-desc">Name (Z → A)</option>
            <option value="spent-desc">Highest Spent</option>
            <option value="spent-asc">Lowest Spent</option>
            <option value="orders-desc">Most Orders</option>
            <option value="orders-asc">Fewest Orders</option>
            <option value="recent-desc">Recently Active</option>
            <option value="recent-asc">Least Recently Active</option>
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-brand-sand/30 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <th className="text-left px-6 py-4">Customer</th>
                <th className="text-left px-6 py-4">Contact</th>
                <th className="text-left px-6 py-4">Role</th>
                <th className="text-left px-6 py-4">City</th>
                <th
                  className="text-center px-6 py-4 cursor-pointer hover:text-gray-600 transition-colors"
                  onClick={() => handleSort("orders")}
                >
                  <span className="inline-flex items-center gap-1">
                    Orders <ArrowUpDown size={12} />
                  </span>
                </th>
                <th
                  className="text-right px-6 py-4 cursor-pointer hover:text-gray-600 transition-colors"
                  onClick={() => handleSort("spent")}
                >
                  <span className="inline-flex items-center gap-1">
                    Total Spent <ArrowUpDown size={12} />
                  </span>
                </th>
                <th
                  className="text-right px-6 py-4 cursor-pointer hover:text-gray-600 transition-colors"
                  onClick={() => handleSort("recent")}
                >
                  <span className="inline-flex items-center gap-1">
                    Last Order <ArrowUpDown size={12} />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-brand-cream/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-gold/20 to-brand-gold-light/30 flex items-center justify-center text-brand-gold-dark font-bold text-sm flex-shrink-0">
                        {customer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {customer.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          Since{" "}
                          {new Date(customer.joinedDate).toLocaleDateString(
                            "en-IN",
                            { month: "short", year: "numeric" }
                          )}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-gray-500">{customer.email}</p>
                    <p className="text-xs text-gray-400">{customer.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={customer.role}
                      disabled={isUpdating || customer.role === "OWNER"}
                      onChange={(e) => handleRoleChange(customer.id, e.target.value)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full cursor-pointer focus:outline-none appearance-none disabled:opacity-50 ${
                        customer.role === "ADMIN" || customer.role === "OWNER"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <option value="CUSTOMER">Customer</option>
                      <option value="ADMIN">Admin</option>
                      {customer.role === "OWNER" && <option value="OWNER">Owner</option>}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                      <MapPin size={13} className="text-gray-400" />
                      {customer.city}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-semibold text-brand-brown">
                      {customer.totalOrders}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-semibold text-brand-brown">
                      ₹{customer.totalSpent.toLocaleString("en-IN")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-500">
                    {new Date(customer.lastOrderDate).toLocaleDateString(
                      "en-IN",
                      { day: "numeric", month: "short" }
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {filtered.map((customer) => (
            <div key={customer.id} className="px-5 py-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-gold/20 to-brand-gold-light/30 flex items-center justify-center text-brand-gold-dark font-bold text-sm flex-shrink-0">
                  {customer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
                      {customer.name}
                      {customer.role !== "CUSTOMER" && (
                        <ShieldAlert size={12} className="text-purple-600" />
                      )}
                    </p>
                    <span className="text-sm font-semibold text-brand-brown flex-shrink-0">
                      ₹{customer.totalSpent.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {customer.city} · {customer.totalOrders} orders
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Mail size={11} /> {customer.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <UsersIcon size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-500 font-medium">No customers found</p>
          </div>
        )}
      </div>
    </div>
  );
}
