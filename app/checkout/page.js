"use client";

import { useState } from "react";
import { useCart } from "../context/CartContext";
import { placeOrder } from "../actions/checkout-actions";
import { syncClientCartToDb } from "../actions/cart-actions";
import { validateCoupon } from "../actions/coupon-validate-actions";
import { getUserAddresses, getUserProfile } from "../actions/user-actions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { CheckCircle2, ShieldCheck, Truck, Lock } from "lucide-react";
import Link from "next/link";

export default function Checkout() {
  const { cart, cartTotal, clearCart, loading } = useCart();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    saveAddress: true,
    couponCode: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    async function loadUserData() {
      try {
        const [profileRes, addressesRes] = await Promise.all([
          getUserProfile(),
          getUserAddresses()
        ]);
        
        if (!profileRes) {
          router.push("/account");
          return;
        }

        if (profileRes) {
          setFormData(prev => ({
            ...prev,
            email: prev.email || profileRes.email || "",
            firstName: prev.firstName || profileRes.name?.split(" ")[0] || "",
            lastName: prev.lastName || profileRes.name?.split(" ").slice(1).join(" ") || "",
            phone: prev.phone || profileRes.phone || ""
          }));
        }

        if (Array.isArray(addressesRes) && addressesRes.length > 0) {
          setSavedAddresses(addressesRes);
          const defaultAddr = addressesRes.find(a => a.isDefault) || addressesRes[0];
          setSelectedAddressId(defaultAddr.id);
          setIsAddingNew(false);
          
          setFormData(prev => ({
            ...prev,
            firstName: defaultAddr.fullName.split(" ")[0] || prev.firstName,
            lastName: defaultAddr.fullName.split(" ").slice(1).join(" ") || prev.lastName,
            phone: defaultAddr.phone || prev.phone,
            address: defaultAddr.addressLine1 || "",
            city: defaultAddr.city || "",
            state: defaultAddr.state || "",
            zipCode: defaultAddr.pincode || ""
          }));
        }
      } catch (err) {
        console.error("Failed to load user data", err);
      } finally {
        setIsLoadingAddresses(false);
      }
    }
    loadUserData();
  }, []);

  const handleSelectAddress = (address) => {
    setSelectedAddressId(address.id);
    setIsAddingNew(false);
    setFormData(prev => ({
      ...prev,
      firstName: address.fullName.split(" ")[0] || prev.firstName,
      lastName: address.fullName.split(" ").slice(1).join(" ") || prev.lastName,
      phone: address.phone || prev.phone,
      address: address.addressLine1 || "",
      city: address.city || "",
      state: address.state || "",
      zipCode: address.pincode || ""
    }));
  };

  const handleAddNewClick = () => {
    setSelectedAddressId(null);
    setIsAddingNew(true);
    setFormData(prev => ({
      ...prev,
      address: "",
      city: "",
      state: "",
      zipCode: ""
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    if (!form.checkValidity()) {
      const errors = {};
      const elements = form.elements;
      let firstInvalid = null;
      
      for (let i = 0; i < elements.length; i++) {
        if (!elements[i].validity.valid && elements[i].name) {
          errors[elements[i].name] = elements[i].validationMessage;
          if (!firstInvalid) firstInvalid = elements[i];
        }
      }
      setFormErrors(errors);
      
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalid.focus();
      }
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    setError(null);

    const syncRes = await syncClientCartToDb(cart);
    if (!syncRes?.success) {
      setError(syncRes?.error || "Failed to sync cart.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      ...formData,
      addressId: isAddingNew ? undefined : selectedAddressId
    };

    const res = await placeOrder(payload);

    if (res.success) {
      setSuccess(true);
      setOrderId(res.orderId);
      clearCart();
    } else {
      setError(res.error);
    }
    
    setIsSubmitting(false);
  };

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    setCouponError("");
    
    const res = await validateCoupon(couponInput, cartTotal);
    if (res.success) {
      setAppliedCoupon(res.couponCode);
      setDiscountAmount(res.discount);
      setFormData(prev => ({ ...prev, couponCode: res.couponCode }));
      setCouponInput("");
    } else {
      setCouponError(res.error);
    }
    setIsApplyingCoupon(false);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setFormData(prev => ({ ...prev, couponCode: "" }));
  };

  if (success) {
    return (
      <div className="min-h-[70vh] bg-brand-warm-white flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 text-center border border-brand-sand/60 shadow-xl animate-fade-in-up">
          <div className="inline-flex p-4 bg-emerald-50 text-emerald-500 rounded-full mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="font-serif text-3xl text-brand-brown mb-2 font-bold">Order Confirmed!</h1>
          <p className="text-gray-500 mb-6">
            Thank you for your purchase. Your order <span className="font-semibold text-brand-brown">#{orderId.slice(0,8).toUpperCase()}</span> has been placed successfully.
          </p>
          <div className="space-y-3">
            <Link 
              href="/account"
              className="block w-full py-3.5 bg-brand-gold hover:bg-brand-gold-dark text-white font-semibold rounded-full transition-all"
            >
              Track Order Status
            </Link>
            <Link 
              href="/shop"
              className="block w-full py-3.5 bg-brand-cream text-brand-brown hover:bg-brand-sand/50 font-semibold rounded-full transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center bg-brand-warm-white py-20">
        <div className="w-10 h-10 border-4 border-brand-sand border-t-brand-gold rounded-full animate-spin mb-4"></div>
        <p className="text-brand-brown font-medium animate-pulse">Loading checkout...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center bg-brand-warm-white py-20">
        <h2 className="font-serif text-2xl text-brand-brown mb-4">Your cart is empty</h2>
        <Link href="/shop" className="px-8 py-3 bg-brand-gold text-white rounded-full hover:bg-brand-gold-dark font-medium transition-colors">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-brand-warm-white min-h-screen py-10 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="font-serif text-3xl sm:text-4xl text-brand-brown font-bold mb-4">
            Secure Checkout
          </h1>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1.5"><Lock size={16} className="text-brand-gold"/> 256-bit Encryption</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-brand-gold"/> Quality Guarantee</span>
            <span className="flex items-center gap-1.5"><Truck size={16} className="text-brand-gold"/> Fast Shipping</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Left Column: Form */}
          <div className="flex-1 order-2 lg:order-1">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-sand/60 shadow-sm">
              <form onSubmit={handleSubmit} noValidate className="space-y-8">
                
                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                    {error}
                  </div>
                )}

                {/* Contact Section */}
                <section>
                  <h2 className="text-lg font-serif font-semibold text-brand-brown mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-gold text-white flex items-center justify-center text-xs">1</span>
                    Contact Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</label>
                      <input type="email" name="email" required value={formData.email} onChange={handleChange} className={`w-full px-4 py-3 bg-brand-cream/50 border rounded-xl text-brand-brown placeholder-gray-400 focus:outline-none focus:border-brand-gold transition-colors ${formErrors.email ? 'border-red-500 bg-red-50/50' : 'border-brand-sand'}`} placeholder="hello@example.com" />
                      {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">First Name</label>
                      <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} className={`w-full px-4 py-3 bg-brand-cream/50 border rounded-xl text-brand-brown placeholder-gray-400 focus:outline-none focus:border-brand-gold transition-colors ${formErrors.firstName ? 'border-red-500 bg-red-50/50' : 'border-brand-sand'}`} placeholder="Rahul" />
                      {formErrors.firstName && <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Name</label>
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={`w-full px-4 py-3 bg-brand-cream/50 border rounded-xl text-brand-brown placeholder-gray-400 focus:outline-none focus:border-brand-gold transition-colors ${formErrors.lastName ? 'border-red-500 bg-red-50/50' : 'border-brand-sand'}`} placeholder="Sharma" />
                      {formErrors.lastName && <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>}
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone Number</label>
                      <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} maxLength="10" pattern="[0-9]{10}" title="10 digit phone number" className={`w-full px-4 py-3 bg-brand-cream/50 border rounded-xl text-brand-brown focus:outline-none focus:border-brand-gold transition-colors ${formErrors.phone ? 'border-red-500 bg-red-50/50' : 'border-brand-sand'}`} />
                      {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                    </div>
                  </div>
                </section>

                <hr className="border-brand-sand/40" />

                {/* Shipping Section */}
                <section>
                  <h2 className="text-lg font-serif font-semibold text-brand-brown mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-gold text-white flex items-center justify-center text-xs">2</span>
                    Shipping Address
                  </h2>

                  {savedAddresses.length > 0 && (
                    <div className="mb-6 space-y-3">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Select Saved Address</label>
                      <div className="flex flex-col gap-2">
                        {savedAddresses.map((addr) => (
                          <div 
                            key={addr.id} 
                            onClick={() => handleSelectAddress(addr)}
                            className={`p-3 border rounded-xl cursor-pointer transition-all text-sm ${selectedAddressId === addr.id ? 'border-brand-gold bg-brand-gold/5 shadow-sm' : 'border-brand-sand/60 hover:border-brand-gold/50 hover:bg-brand-cream/30'}`}
                          >
                            <p className="font-semibold text-brand-brown">{addr.fullName} <span className="text-gray-400 font-normal ml-2">{addr.phone}</span></p>
                            <p className="text-gray-500 truncate">{addr.addressLine1}, {addr.city}, {addr.state} {addr.pincode}</p>
                          </div>
                        ))}
                      </div>
                      {!isAddingNew && (
                        <button type="button" onClick={handleAddNewClick} className="mt-2 text-sm font-semibold text-brand-gold hover:text-brand-gold-dark transition-colors">
                          + Add a new address
                        </button>
                      )}
                    </div>
                  )}

                  {isAddingNew && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Street Address</label>
                        <input type="text" name="address" required value={formData.address} onChange={handleChange} className={`w-full px-4 py-3 bg-brand-cream/50 border rounded-xl text-brand-brown placeholder-gray-400 focus:outline-none focus:border-brand-gold transition-colors ${formErrors.address ? 'border-red-500 bg-red-50/50' : 'border-brand-sand'}`} placeholder="123 Market Street, Apt 4" />
                        {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">City</label>
                        <input type="text" name="city" required value={formData.city} onChange={handleChange} className={`w-full px-4 py-3 bg-brand-cream/50 border rounded-xl text-brand-brown placeholder-gray-400 focus:outline-none focus:border-brand-gold transition-colors ${formErrors.city ? 'border-red-500 bg-red-50/50' : 'border-brand-sand'}`} placeholder="Mumbai" />
                        {formErrors.city && <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">State</label>
                        <input type="text" name="state" required value={formData.state} onChange={handleChange} className={`w-full px-4 py-3 bg-brand-cream/50 border rounded-xl text-brand-brown placeholder-gray-400 focus:outline-none focus:border-brand-gold transition-colors ${formErrors.state ? 'border-red-500 bg-red-50/50' : 'border-brand-sand'}`} placeholder="Maharashtra" />
                        {formErrors.state && <p className="text-red-500 text-xs mt-1">{formErrors.state}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">ZIP / Postal Code</label>
                        <input type="text" name="zipCode" required value={formData.zipCode} onChange={handleChange} className={`w-full px-4 py-3 bg-brand-cream/50 border rounded-xl text-brand-brown placeholder-gray-400 focus:outline-none focus:border-brand-gold transition-colors ${formErrors.zipCode ? 'border-red-500 bg-red-50/50' : 'border-brand-sand'}`} placeholder="400001" />
                        {formErrors.zipCode && <p className="text-red-500 text-xs mt-1">{formErrors.zipCode}</p>}
                      </div>
                      
                      <div className="mt-4 flex items-center gap-2 sm:col-span-2">
                        <input type="checkbox" id="saveAddress" name="saveAddress" checked={formData.saveAddress} onChange={handleChange} className="w-4 h-4 text-brand-gold rounded border-gray-300 focus:ring-brand-gold" />
                        <label htmlFor="saveAddress" className="text-sm text-gray-600">Save this address to my account for next time</label>
                      </div>
                    </div>
                  )}
                </section>

                <hr className="border-brand-sand/40" />

                {/* Payment (Mock) */}
                <section>
                  <h2 className="text-lg font-serif font-semibold text-brand-brown mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-gold text-white flex items-center justify-center text-xs">3</span>
                    Payment Method
                  </h2>
                  <div className="p-4 border-2 border-brand-gold bg-brand-gold/5 rounded-xl flex items-center gap-3">
                    <input type="radio" readOnly checked className="w-4 h-4 text-brand-gold" />
                    <div>
                      <p className="font-semibold text-brand-brown">Cash on Delivery (COD)</p>
                      <p className="text-xs text-gray-500">Pay with cash upon delivery.</p>
                    </div>
                  </div>
                </section>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-brand-gold hover:bg-brand-gold-dark text-white font-bold text-lg rounded-xl transition-all shadow-xl shadow-brand-gold/20 disabled:opacity-50 flex items-center justify-center"
                >
                  {isSubmitting ? "Processing Order..." : "Place Order Now"}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:w-[400px] xl:w-[450px] order-1 lg:order-2">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-sand/60 shadow-sm sticky top-32">
              <h2 className="font-serif text-xl font-bold text-brand-brown mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-16 bg-brand-cream rounded-lg overflow-hidden flex-shrink-0 border border-brand-sand/40">
                      <img src={item.image || item.images?.[0]?.url || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E"} alt={item.name} className="w-full h-full object-cover" />
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-gray-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-sm font-medium text-brand-brown line-clamp-1">{item.name}</p>
                      <p className="text-sm text-gray-500">₹{item.price}</p>
                    </div>
                    <div className="pt-1 text-right">
                      <p className="text-sm font-bold text-brand-brown">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-brand-sand/40 text-sm text-gray-600">
                {/* Coupon Section */}
                <div className="pb-4 mb-2 border-b border-brand-sand/30">
                  <h3 className="font-semibold text-brand-brown mb-2 text-xs uppercase tracking-wider">Discount Code</h3>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-2 rounded-lg text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{appliedCoupon}</span>
                        <span className="text-emerald-600/80">-₹{discountAmount}</span>
                      </div>
                      <button type="button" onClick={handleRemoveCoupon} className="text-emerald-700 hover:text-emerald-900 font-medium">Remove</button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          placeholder="Enter coupon code"
                          className="flex-1 px-3 py-2 border border-brand-sand rounded-lg text-sm focus:outline-none focus:border-brand-gold uppercase"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          disabled={!couponInput.trim() || isApplyingCoupon}
                          className="px-4 py-2 bg-brand-brown text-white text-sm font-semibold rounded-lg hover:bg-brand-brown-light disabled:opacity-50 transition-colors"
                        >
                          {isApplyingCoupon ? "..." : "Apply"}
                        </button>
                      </div>
                      {couponError && <p className="text-red-500 text-xs">{couponError}</p>}
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-brand-brown">₹{cartTotal.toLocaleString("en-IN")}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span className="font-medium">-₹{discountAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span className="font-medium text-brand-brown">₹{((cartTotal - discountAmount) * 0.18).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={(cartTotal - discountAmount) > 500 ? "text-emerald-500 font-medium" : "text-brand-brown font-medium"}>
                    {(cartTotal - discountAmount) > 500 ? "Free" : "₹50"}
                  </span>
                </div>
                <div className="flex justify-between pt-4 border-t border-dashed border-brand-sand/60 text-lg font-bold text-brand-brown">
                  <span>Total</span>
                  <span>₹{((cartTotal - discountAmount) + ((cartTotal - discountAmount) * 0.18) + ((cartTotal - discountAmount) > 500 ? 0 : 50)).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
