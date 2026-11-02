"use client";

import { useState, useRef } from "react";
import { User, MapPin, Package, LogOut, Camera, Edit2, AlertCircle, Trash2, CheckCircle2, Plus, Download, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { updateUserProfile, updateUserAvatar, addAddress, deleteAddress, setDefaultAddress } from "@/app/actions/user-actions";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam",
  "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir",
  "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
  "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];


function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-brand-sand/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="bg-brand-cream/30 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-brand-sand/60">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Order ID</p>
          <p className="text-sm font-medium text-brand-brown">#{order.id.slice(0,8).toUpperCase()}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Date</p>
          <p className="text-sm font-medium text-brand-brown">{new Date(order.createdAt).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata",  timeZone: "Asia/Kolkata" })}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Total</p>
          <p className="text-sm font-bold text-brand-brown">₹{order.total.toLocaleString("en-IN")}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
            {order.orderStatus || order.status}
          </span>
          <Link 
            href={`/invoice/${order.id}`}
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1 bg-white border border-brand-sand rounded-full text-xs font-semibold text-brand-brown hover:text-brand-gold transition-colors"
          >
            <Download size={14} /> Bill
          </Link>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="relative w-16 h-16 bg-brand-cream rounded-lg overflow-hidden border border-brand-sand/40 flex-shrink-0">
                <Image
                  src={item.product.image || item.product.images?.[0]?.url || "https://res.cloudinary.com/sjl1rfvu/image/upload/v1785395003/thar-delight/placeholder.jpg"}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.srcset = "";
                    e.currentTarget.src = "https://res.cloudinary.com/sjl1rfvu/image/upload/v1785395003/thar-delight/placeholder.jpg";
                  }}
                />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-brand-brown line-clamp-1">{item.product.name}</h4>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
              <div className="text-right font-medium text-sm text-brand-brown">
                ₹{item.price.toLocaleString("en-IN")}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-brand-sand/40">
          <button 
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-between w-full text-sm font-semibold text-brand-brown hover:text-brand-gold transition-colors"
          >
            <span className="flex items-center gap-2"><FileText size={16}/> Order Status & Tracking</span>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          {expanded && (
            <div className="mt-4 p-4 bg-brand-cream/30 rounded-xl space-y-4 text-sm animate-fade-in-up">
              {order.history && order.history.length > 0 ? (
                <div className="space-y-4">
                  {order.history.map((h, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-brand-gold text-white flex items-center justify-center shrink-0">
                          <CheckCircle2 size={14} />
                        </div>
                        {i !== order.history.length - 1 && <div className="w-0.5 h-full bg-brand-sand/60 my-1"></div>}
                      </div>
                      <div className="pb-4">
                        <h4 className="font-semibold text-brand-brown text-sm">{h.status}</h4>
                        <span className="text-xs text-gray-500">{new Date(h.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata",  timeZone: "Asia/Kolkata" })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No tracking updates yet.</p>
              )}

              {order.shipment && (
                <div className="mt-4 pt-4 border-t border-brand-sand/40">
                  <h4 className="font-semibold text-brand-brown mb-2">Shipment Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-gray-600">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400">Courier</p>
                      <p>{order.shipment.courierName || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400">Tracking #</p>
                      <p>{order.shipment.trackingNumber || "N/A"}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function UserProfile({ user, orders, addresses }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState(user.image || null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    gender: user.gender || "",
    dob: user.dob || ""
  });
  
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    street: "",
    landmark: "",
    city: "",
    district: "",
    state: "",
    zipCode: "",
    isDefault: false
  });
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [pincodeError, setPincodeError] = useState("");

  const router = useRouter();

  const handleAvatarSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size exceeds 5MB. Please select a smaller image.");
      return;
    }

    setIsUploadingAvatar(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target?.result;
      if (!base64Data) {
        setIsUploadingAvatar(false);
        return;
      }

      const res = await updateUserAvatar(base64Data);
      if (res.success) {
        setAvatarUrl(base64Data);
        router.refresh();
      } else {
        setError(res.error);
      }
      setIsUploadingAvatar(false);
    };
    reader.readAsDataURL(file);
  };

  const handlePincodeChange = async (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setAddressForm(prev => ({ ...prev, zipCode: val }));
    setPincodeError("");
    
    if (val.length === 6) {
      setIsFetchingLocation(true);
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${val}`);
        const data = await res.json();
        if (data && data[0] && data[0].Status === "Success") {
          const postOffice = data[0].PostOffice[0];
          setAddressForm(prev => ({
            ...prev,
            district: postOffice.District || postOffice.Block || prev.district,
            state: postOffice.State || prev.state
          }));
        } else {
          setPincodeError("Invalid PIN Code");
        }
      } catch (err) {
        console.error("Failed to fetch pincode details", err);
        setPincodeError("Error verifying PIN Code");
      } finally {
        setIsFetchingLocation(false);
      }
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    const res = await updateUserProfile(formData);
    if (res.success) {
      setIsEditing(false);
      router.refresh();
    } else {
      setError(res.error);
    }
    setIsSaving(false);
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const res = await addAddress(addressForm);
    if (res.success) {
      setIsAddingAddress(false);
      setAddressForm({ street: "", city: "", state: "", zipCode: "", isDefault: false });
      router.refresh();
    }
    setIsSaving(false);
  };

  const handleDeleteAddress = async (id) => {
    if (confirm("Are you sure you want to delete this address?")) {
      await deleteAddress(id);
      router.refresh();
    }
  };

  const handleSetDefaultAddress = async (id) => {
    await setDefaultAddress(id);
    router.refresh();
  };

  const handleLogout = async () => {
    await signOut();
    router.refresh();
  };

  return (
    <div className="bg-brand-warm-white min-h-screen py-10 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-3xl p-6 border border-brand-sand/60 shadow-sm">
              <div className="flex flex-col items-center mb-8">
                
                {/* Hidden File Input for Avatar Upload */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarSelect}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="hidden"
                />

                {/* Avatar & Floating Camera Badge */}
                <div className="relative mb-4">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="relative w-24 h-24 bg-brand-cream rounded-full flex items-center justify-center border-4 border-white shadow-md cursor-pointer overflow-hidden group transition-all"
                  >
                    {avatarUrl ? (
                      <Image src={avatarUrl} alt={user.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <User size={40} className="text-brand-gold" />
                    )}

                    {/* Hover camera overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-200">
                      <Camera size={20} />
                      <span className="text-[9px] font-semibold mt-0.5 uppercase tracking-wider">Change</span>
                    </div>

                    {isUploadingAvatar && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                        <div className="w-6 h-6 border-2 border-white border-t-brand-gold rounded-full animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* Clean Floating Camera Button Badge */}
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 p-2 bg-brand-brown hover:bg-brand-gold text-white rounded-full transition-all duration-300 shadow-lg border-2 border-white hover:scale-110"
                    title="Upload Profile Picture"
                  >
                    <Camera size={13} />
                  </button>
                </div>


                <h2 className="font-serif text-xl font-bold text-brand-brown text-center">{user.name}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>


              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === "profile" ? "bg-brand-gold text-white shadow-md" : "text-brand-brown hover:bg-brand-cream"}`}
                >
                  <User size={18} /> Profile Details
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === "orders" ? "bg-brand-gold text-white shadow-md" : "text-brand-brown hover:bg-brand-cream"}`}
                >
                  <Package size={18} /> Order History
                </button>
                <button
                  onClick={() => setActiveTab("addresses")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === "addresses" ? "bg-brand-gold text-white shadow-md" : "text-brand-brown hover:bg-brand-cream"}`}
                >
                  <MapPin size={18} /> Saved Addresses
                </button>
              </nav>

              <hr className="my-6 border-brand-sand/40" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium text-red-500 hover:bg-red-50"
              >
                <LogOut size={18} /> Log Out
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-brand-sand/60 shadow-sm min-h-[500px]">
              
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="animate-fade-in-up">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-serif text-2xl font-bold text-brand-brown">Profile Details</h3>
                    {!isEditing && (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-cream hover:bg-brand-sand/50 text-brand-brown font-medium rounded-full transition-colors text-sm"
                      >
                        <Edit2 size={16} /> Edit Profile
                      </button>
                    )}
                  </div>
                  
                  {isEditing ? (
                    <form onSubmit={handleSaveProfile} className="space-y-6 max-w-lg">
                      {error && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2">
                          <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-red-600 font-medium">{error}</p>
                        </div>
                      )}
                      
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</label>
                        <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-brand-cream/50 border border-brand-sand rounded-xl text-brand-brown focus:outline-none focus:border-brand-gold transition-colors" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</label>
                        <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-brand-cream/50 border border-brand-sand rounded-xl text-brand-brown focus:outline-none focus:border-brand-gold transition-colors" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone Number</label>
                        <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="e.g. +91 9876543210" className="w-full px-4 py-3 bg-brand-cream/50 border border-brand-sand rounded-xl text-brand-brown focus:outline-none focus:border-brand-gold transition-colors" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Gender</label>
                          <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="w-full px-4 py-3 bg-brand-cream/50 border border-brand-sand rounded-xl text-brand-brown focus:outline-none focus:border-brand-gold transition-colors">
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date of Birth</label>
                          <input type="date" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} className="w-full px-4 py-3 bg-brand-cream/50 border border-brand-sand rounded-xl text-brand-brown focus:outline-none focus:border-brand-gold transition-colors" />
                        </div>
                      </div>
                      
                      <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-full transition-colors flex-1">
                          Cancel
                        </button>
                        <button type="submit" disabled={isSaving} className="px-6 py-2.5 bg-brand-gold hover:bg-brand-gold-dark text-white font-medium rounded-full transition-colors flex-1 disabled:opacity-50">
                          {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6 max-w-lg">
                      <div className="p-4 bg-brand-cream/30 rounded-xl border border-brand-sand/40">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Full Name</p>
                        <p className="text-brand-brown font-medium">{user.name}</p>
                      </div>
                      <div className="p-4 bg-brand-cream/30 rounded-xl border border-brand-sand/40">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email Address</p>
                        <p className="text-brand-brown font-medium">{user.email}</p>
                      </div>
                      <div className="p-4 bg-brand-cream/30 rounded-xl border border-brand-sand/40">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Phone Number</p>
                        <p className="text-brand-brown font-medium">{user.phone || <span className="text-gray-400 italic">Not provided</span>}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-brand-cream/30 rounded-xl border border-brand-sand/40">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Gender</p>
                          <p className="text-brand-brown font-medium">{user.gender || <span className="text-gray-400 italic">Not provided</span>}</p>
                        </div>
                        <div className="p-4 bg-brand-cream/30 rounded-xl border border-brand-sand/40">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Date of Birth</p>
                          <p className="text-brand-brown font-medium">{user.dob ? new Date(user.dob).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata",  timeZone: "Asia/Kolkata" }) : <span className="text-gray-400 italic">Not provided</span>}</p>
                        </div>
                      </div>
                      <div className="p-4 bg-brand-cream/30 rounded-xl border border-brand-sand/40">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Member Since</p>
                        <p className="text-brand-brown font-medium">{new Date(user.createdAt).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata",  month: 'long', year: 'numeric' })}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div className="animate-fade-in-up">
                  <h3 className="font-serif text-2xl font-bold text-brand-brown mb-6">Order History</h3>
                  
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-cream rounded-full text-brand-gold mb-4">
                        <Package size={28} />
                      </div>
                      <p className="text-brand-brown font-medium mb-1">No orders yet</p>
                      <p className="text-sm text-gray-500">When you place an order, it will appear here.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === "addresses" && (
                <div className="animate-fade-in-up">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-serif text-2xl font-bold text-brand-brown">Saved Addresses</h3>
                    {!isAddingAddress && (
                      <button 
                        onClick={() => setIsAddingAddress(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-cream hover:bg-brand-sand/50 text-brand-brown font-medium rounded-full transition-colors text-sm"
                      >
                        <Plus size={16} /> Add Address
                      </button>
                    )}
                  </div>
                  
                  {isAddingAddress && (
                    <form onSubmit={handleAddAddress} className="mb-8 p-6 bg-brand-cream/30 border border-brand-sand/60 rounded-2xl animate-fade-in-up">
                      <h4 className="font-medium text-brand-brown mb-4">Add New Address</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-1.5 sm:col-span-2">
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Street Address</label>
                          <input type="text" required value={addressForm.street} onChange={(e) => setAddressForm({...addressForm, street: e.target.value})} className="w-full px-4 py-3 bg-white border border-brand-sand rounded-xl text-brand-brown focus:outline-none focus:border-brand-gold transition-colors" />
                        </div>
                        <div className="space-y-1.5 sm:col-span-2">
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nearby Landmark (Optional)</label>
                          <input type="text" value={addressForm.landmark} onChange={(e) => setAddressForm({...addressForm, landmark: e.target.value})} className="w-full px-4 py-3 bg-white border border-brand-sand rounded-xl text-brand-brown focus:outline-none focus:border-brand-gold transition-colors" placeholder="e.g. Near Apollo Hospital" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex justify-between">
                            <span>ZIP / Postal Code</span>
                            {isFetchingLocation && <span className="text-brand-gold text-[10px] animate-pulse">Auto-fetching...</span>}
                          </label>
                          <input type="text" required value={addressForm.zipCode} onChange={handlePincodeChange} maxLength="6" className={`w-full px-4 py-3 bg-white border rounded-xl text-brand-brown focus:outline-none focus:border-brand-gold transition-colors ${pincodeError ? 'border-red-500 bg-red-50/50' : 'border-brand-sand'}`} />
                          {pincodeError && <p className="text-red-500 text-xs mt-1">{pincodeError}</p>}
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">City</label>
                          <input type="text" required value={addressForm.city} onChange={(e) => setAddressForm({...addressForm, city: e.target.value})} className="w-full px-4 py-3 bg-white border border-brand-sand rounded-xl text-brand-brown focus:outline-none focus:border-brand-gold transition-colors" placeholder="e.g. Andheri West" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">District</label>
                          <input type="text" readOnly required value={addressForm.district} className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-600 focus:outline-none cursor-not-allowed" placeholder="Auto-filled from PIN" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">State</label>
                          <select required disabled value={addressForm.state} className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-600 focus:outline-none appearance-none cursor-not-allowed">
                            <option value="">Auto-filled from PIN</option>
                            {INDIAN_STATES.map(state => (
                              <option key={state} value={state}>{state}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-center gap-2 sm:col-span-2 pt-2">
                          <input type="checkbox" id="isDefault" checked={addressForm.isDefault} onChange={(e) => setAddressForm({...addressForm, isDefault: e.target.checked})} className="w-4 h-4 text-brand-gold rounded border-gray-300 focus:ring-brand-gold" />
                          <label htmlFor="isDefault" className="text-sm text-gray-600">Set as default address</label>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button type="button" onClick={() => setIsAddingAddress(false)} className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-full transition-colors flex-1">
                          Cancel
                        </button>
                        <button type="submit" disabled={isSaving} className="px-6 py-2.5 bg-brand-gold hover:bg-brand-gold-dark text-white font-medium rounded-full transition-colors flex-1 disabled:opacity-50">
                          {isSaving ? "Saving..." : "Save Address"}
                        </button>
                      </div>
                    </form>
                  )}

                  {!isAddingAddress && addresses.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-brand-sand/60 rounded-2xl">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-cream rounded-full text-brand-gold mb-4">
                        <MapPin size={28} />
                      </div>
                      <p className="text-brand-brown font-medium mb-1">No addresses saved</p>
                      <p className="text-sm text-gray-500">Addresses are saved automatically during checkout or you can add one here.</p>
                    </div>
                  ) : !isAddingAddress && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {addresses.map((addr) => (
                        <div key={addr.id} className="p-5 border border-brand-sand/60 rounded-2xl relative group hover:border-brand-gold/40 transition-colors shadow-sm bg-white">
                          {addr.isDefault && (
                            <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md flex items-center gap-1">
                              <CheckCircle2 size={12} /> Default
                            </span>
                          )}
                          <div className="space-y-1 text-sm text-gray-600 mt-2 pr-6">
                            <p className="font-medium text-brand-brown text-base mb-2">{user.name}</p>
                            <p>{addr.addressLine1 || addr.street}</p>
                            {addr.landmark && <p>Landmark: {addr.landmark}</p>}
                            <p>{addr.city}{addr.district && addr.city !== addr.district ? `, ${addr.district}` : ''}</p>
                            <p>{addr.state} {addr.zipCode || addr.pincode}</p>
                            <p>{addr.country || "India"}</p>
                          </div>
                          
                          <div className="mt-5 pt-4 border-t border-brand-sand/40 flex items-center justify-between">
                            {!addr.isDefault ? (
                              <button 
                                onClick={() => handleSetDefaultAddress(addr.id)}
                                className="text-xs font-semibold text-brand-gold hover:text-brand-gold-dark transition-colors"
                              >
                                Set as Default
                              </button>
                            ) : <div></div>}
                            
                            <button 
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                              title="Delete Address"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
