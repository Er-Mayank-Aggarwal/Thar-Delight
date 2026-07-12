"use client";

import { useState } from "react";
import { User, MapPin, Package, LogOut, Camera, Edit2, AlertCircle, Trash2, CheckCircle2, Plus } from "lucide-react";
import { logoutUser } from "@/app/actions/auth-actions";
import { updateUserProfile, addAddress, deleteAddress, setDefaultAddress } from "@/app/actions/user-actions";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function UserProfile({ user, orders, addresses }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
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
    city: "",
    state: "",
    zipCode: "",
    isDefault: false
  });

  const router = useRouter();

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
    await logoutUser();
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
                <div className="relative w-24 h-24 bg-brand-cream rounded-full mb-4 flex items-center justify-center border-4 border-white shadow-md">
                  <User size={40} className="text-brand-gold" />
                  <button className="absolute bottom-0 right-0 p-1.5 bg-brand-brown text-white rounded-full hover:bg-brand-gold transition-colors">
                    <Camera size={14} />
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
                          <p className="text-brand-brown font-medium">{user.dob ? new Date(user.dob).toLocaleDateString("en-IN") : <span className="text-gray-400 italic">Not provided</span>}</p>
                        </div>
                      </div>
                      <div className="p-4 bg-brand-cream/30 rounded-xl border border-brand-sand/40">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Member Since</p>
                        <p className="text-brand-brown font-medium">{new Date(user.createdAt).toLocaleDateString("en-IN", { month: 'long', year: 'numeric' })}</p>
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
                        <div key={order.id} className="border border-brand-sand/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                          <div className="bg-brand-cream/30 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-brand-sand/60">
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Order ID</p>
                              <p className="text-sm font-medium text-brand-brown">#{order.id.slice(0,8).toUpperCase()}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Date</p>
                              <p className="text-sm font-medium text-brand-brown">{new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Total</p>
                              <p className="text-sm font-bold text-brand-brown">₹{order.total.toLocaleString("en-IN")}</p>
                            </div>
                            <div>
                              <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                                {order.status}
                              </span>
                            </div>
                          </div>
                          
                          <div className="p-6">
                            <div className="space-y-4">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                  <div className="relative w-16 h-16 bg-brand-cream rounded-lg overflow-hidden border border-brand-sand/40 flex-shrink-0">
                                    <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
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
                          </div>
                        </div>
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
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">City</label>
                          <input type="text" required value={addressForm.city} onChange={(e) => setAddressForm({...addressForm, city: e.target.value})} className="w-full px-4 py-3 bg-white border border-brand-sand rounded-xl text-brand-brown focus:outline-none focus:border-brand-gold transition-colors" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">State</label>
                          <input type="text" required value={addressForm.state} onChange={(e) => setAddressForm({...addressForm, state: e.target.value})} className="w-full px-4 py-3 bg-white border border-brand-sand rounded-xl text-brand-brown focus:outline-none focus:border-brand-gold transition-colors" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">ZIP Code</label>
                          <input type="text" required value={addressForm.zipCode} onChange={(e) => setAddressForm({...addressForm, zipCode: e.target.value})} className="w-full px-4 py-3 bg-white border border-brand-sand rounded-xl text-brand-brown focus:outline-none focus:border-brand-gold transition-colors" />
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
                            <p>{addr.street}</p>
                            <p>{addr.city}, {addr.state} {addr.zipCode}</p>
                            <p>India</p>
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
