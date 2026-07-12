"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  X,
  Tag,
  Copy,
  CheckCircle2,
  XCircle,
  IndianRupee,
  Percent,
  Calendar,
} from "lucide-react";
import {
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCoupon,
} from "@/app/actions/coupon-actions";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const emptyForm = {
    code: "",
    discountType: "PERCENTAGE",
    value: "",
    minimumOrder: "",
    maximumDiscount: "",
    usageLimit: "",
    expiresAt: "",
    isActive: true,
  };
  const [formData, setFormData] = useState(emptyForm);

  // Load coupons from DB
  useEffect(() => {
    getAllCoupons()
      .then((data) => {
        setCoupons(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAdd = () => {
    setEditingCoupon(null);
    setFormData(emptyForm);
    setError(null);
    setShowModal(true);
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      value: coupon.value,
      minimumOrder: coupon.minimumOrder || "",
      maximumDiscount: coupon.maximumDiscount || "",
      usageLimit: coupon.usageLimit || "",
      expiresAt: coupon.expiresAt
        ? new Date(coupon.expiresAt).toISOString().split("T")[0]
        : "",
      isActive: coupon.isActive,
    });
    setError(null);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.code || !formData.value) return;
    setSaving(true);
    setError(null);

    const payload = {
      code: formData.code,
      discountType: formData.discountType,
      value: Number(formData.value),
      minimumOrder: formData.minimumOrder ? Number(formData.minimumOrder) : null,
      maximumDiscount: formData.maximumDiscount
        ? Number(formData.maximumDiscount)
        : null,
      usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
      expiresAt: formData.expiresAt || null,
      isActive: formData.isActive,
    };

    let result;
    if (editingCoupon) {
      result = await updateCoupon(editingCoupon.id, payload);
    } else {
      result = await createCoupon(payload);
    }

    if (result.success) {
      const updated = await getAllCoupons();
      setCoupons(updated);
      setShowModal(false);
      setFormData(emptyForm);
    } else {
      setError(result.error);
    }

    setSaving(false);
  };

  const handleDelete = async (id) => {
    const result = await deleteCoupon(id);
    if (result.success) {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    } else {
      alert(result.error);
    }
    setShowDeleteConfirm(null);
  };

  const handleToggle = async (id) => {
    const result = await toggleCoupon(id);
    if (result.success) {
      setCoupons((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
      );
    }
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const activeCoupons = coupons.filter((c) => c.isActive).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-400 text-sm">Loading coupons...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif !text-brand-brown">
            Coupons & Discounts
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {activeCoupons} active coupon{activeCoupons !== 1 ? "s" : ""} ·{" "}
            {coupons.length} total
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-gold hover:bg-brand-gold-dark text-white font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md text-sm"
        >
          <Plus size={18} />
          Create Coupon
        </button>
      </div>

      {/* Coupon Cards */}
      {coupons.length === 0 ? (
        <div className="text-center py-16">
          <Tag size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500 font-medium">No coupons yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Create your first coupon to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {coupons.map((coupon) => {
            const isExpired =
              coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
            const usagePercent = coupon.usageLimit
              ? Math.round((coupon.timesUsed / coupon.usageLimit) * 100)
              : 0;
            return (
              <div
                key={coupon.id}
                className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
                  coupon.isActive && !isExpired
                    ? "border-brand-sand/30 hover:shadow-md"
                    : "border-gray-200 opacity-70"
                }`}
              >
                {/* Top strip */}
                <div
                  className={`h-1.5 ${
                    coupon.isActive && !isExpired
                      ? "bg-gradient-to-r from-brand-gold to-brand-gold-light"
                      : "bg-gray-200"
                  }`}
                />

                <div className="p-5 space-y-4">
                  {/* Code & Status */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-lg font-bold text-brand-brown tracking-wider">
                          {coupon.code}
                        </span>
                        <button
                          onClick={() => handleCopy(coupon.code)}
                          className="p-1 rounded text-gray-400 hover:text-brand-gold transition-colors"
                          title="Copy code"
                        >
                          {copiedCode === coupon.code ? (
                            <CheckCircle2
                              size={14}
                              className="text-emerald-500"
                            />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                        isExpired
                          ? "bg-gray-100 text-gray-500"
                          : coupon.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {isExpired
                        ? "Expired"
                        : coupon.isActive
                        ? "Active"
                        : "Paused"}
                    </span>
                  </div>

                  {/* Discount Info */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 bg-brand-cream rounded-lg px-3 py-2">
                      {coupon.discountType === "PERCENTAGE" ? (
                        <Percent size={16} className="text-brand-gold" />
                      ) : (
                        <IndianRupee size={16} className="text-brand-gold" />
                      )}
                      <span className="text-lg font-bold text-brand-brown">
                        {coupon.discountType === "PERCENTAGE"
                          ? `${coupon.value}%`
                          : `₹${coupon.value}`}
                      </span>
                      <span className="text-xs text-gray-400 ml-1">off</span>
                    </div>
                    {coupon.minimumOrder > 0 && (
                      <p className="text-xs text-gray-400">
                        Min. order: ₹{coupon.minimumOrder}
                      </p>
                    )}
                  </div>

                  {/* Usage Bar */}
                  {coupon.usageLimit && (
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-400">
                          {coupon.timesUsed} / {coupon.usageLimit} used
                        </span>
                        <span className="text-gray-400">{usagePercent}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-brand-gold transition-all"
                          style={{ width: `${usagePercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Expiry & Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar size={12} />
                      {coupon.expiresAt
                        ? `Expires: ${new Date(
                            coupon.expiresAt
                          ).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}`
                        : "No expiry"}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggle(coupon.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          coupon.isActive
                            ? "text-emerald-500 hover:bg-emerald-50"
                            : "text-gray-400 hover:bg-gray-50"
                        }`}
                        title={coupon.isActive ? "Pause" : "Activate"}
                      >
                        {coupon.isActive ? (
                          <CheckCircle2 size={16} />
                        ) : (
                          <XCircle size={16} />
                        )}
                      </button>
                      <button
                        onClick={() => handleEdit(coupon)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(coupon.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <h3 className="text-lg font-serif !text-brand-brown mb-2">
                Delete Coupon?
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                This coupon will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h3 className="text-lg font-serif !text-brand-brown">
                {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                  {error}
                </div>
              )}

              {/* Code */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Coupon Code <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="e.g., SUMMER25"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all"
                />
              </div>

              {/* Discount Type & Value */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Discount Type
                  </label>
                  <div className="flex rounded-xl border border-gray-200 overflow-hidden">
                    <button
                      onClick={() =>
                        setFormData({
                          ...formData,
                          discountType: "PERCENTAGE",
                        })
                      }
                      className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                        formData.discountType === "PERCENTAGE"
                          ? "bg-brand-gold text-white"
                          : "bg-white text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      % Percent
                    </button>
                    <button
                      onClick={() =>
                        setFormData({ ...formData, discountType: "FIXED" })
                      }
                      className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                        formData.discountType === "FIXED"
                          ? "bg-brand-gold text-white"
                          : "bg-white text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      ₹ Fixed
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Value <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        value: e.target.value,
                      })
                    }
                    placeholder={
                      formData.discountType === "PERCENTAGE" ? "10" : "50"
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all"
                  />
                </div>
              </div>

              {/* Min Order & Max Uses */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Min. Order (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.minimumOrder}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minimumOrder: e.target.value,
                      })
                    }
                    placeholder="200"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Max Uses
                  </label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        usageLimit: e.target.value,
                      })
                    }
                    placeholder="100"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all"
                  />
                </div>
              </div>

              {/* Max Discount */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Max Discount (₹){" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="number"
                  value={formData.maximumDiscount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maximumDiscount: e.target.value,
                    })
                  }
                  placeholder="500"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all"
                />
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Expires On
                </label>
                <input
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) =>
                    setFormData({ ...formData, expiresAt: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Active</p>
                  <p className="text-xs text-gray-400">
                    Enable or disable this coupon
                  </p>
                </div>
                <button
                  onClick={() =>
                    setFormData({ ...formData, isActive: !formData.isActive })
                  }
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 ${
                    formData.isActive ? "bg-emerald-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                      formData.isActive ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex gap-3 px-6 py-5 border-t border-gray-100">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.code || !formData.value || saving}
                className="flex-1 px-4 py-2.5 bg-brand-gold hover:bg-brand-gold-dark disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-colors"
              >
                {saving
                  ? "Saving..."
                  : editingCoupon
                  ? "Save Changes"
                  : "Create Coupon"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
