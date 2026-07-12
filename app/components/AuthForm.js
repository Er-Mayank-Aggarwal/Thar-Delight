"use client";

import { useState } from "react";
import { User, Lock, Mail, UserPlus, LogIn, CheckCircle2, AlertCircle } from "lucide-react";
import { registerUser, loginUser, logoutUser } from "@/app/actions/auth-actions";
import { useRouter } from "next/navigation";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    const res = isLogin ? await loginUser(formData) : await registerUser(formData);

    if (res.success) {
      setSubmitted(true);
      setTimeout(() => {
        router.refresh();
      }, 2000);
    } else {
      setError(res.error);
    }
    
    setIsLoading(false);
  };

  const handleReset = async () => {
    await logoutUser();
    router.refresh();
    setSubmitted(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="bg-brand-warm-white min-h-screen py-10 sm:py-20 flex items-center justify-center">
      <div className="max-w-md w-full px-4">
        
        {/* Toggle Headers */}
        <div className="flex border-b border-brand-sand mb-8">
          <button
            onClick={() => {
              setIsLogin(true);
              setSubmitted(false);
              setError(null);
            }}
            className={`flex-1 pb-4 text-center text-sm font-semibold uppercase tracking-wider transition-colors border-b-2 ${
              isLogin && !submitted
                ? "border-brand-gold text-brand-gold font-bold"
                : "border-transparent text-gray-400 hover:text-brand-brown"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setSubmitted(false);
              setError(null);
            }}
            className={`flex-1 pb-4 text-center text-sm font-semibold uppercase tracking-wider transition-colors border-b-2 ${
              !isLogin && !submitted
                ? "border-brand-gold text-brand-gold font-bold"
                : "border-transparent text-gray-400 hover:text-brand-brown"
            }`}
          >
            Register
          </button>
        </div>

        {/* Card Form container */}
        <div className="bg-white rounded-3xl p-8 border border-brand-sand/60 shadow-md">
          {submitted ? (
            <div className="py-12 text-center animate-fade-in-up">
              <div className="inline-flex p-4 bg-emerald-50 text-emerald-500 rounded-full mb-4">
                <CheckCircle2 size={44} />
              </div>
              <h3 className="font-serif text-2xl text-brand-brown mb-2 font-bold">
                {isLogin ? "Welcome Back!" : "Account Created!"}
              </h3>
              <p className="text-gray-400 text-sm max-w-xs mx-auto mb-6">
                {isLogin
                  ? "You have successfully logged in to your Thar Delight account. Redirecting you to dashboard..."
                  : "Thank you for registering. You can now access special discounts and track your orders."}
              </p>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-brand-gold hover:bg-brand-gold-dark text-white text-sm font-semibold rounded-full transition-all"
              >
                Log Out
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 animate-fade-in-up">
                  <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
              )}
              
              {/* Registration specific fields */}
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brand-brown-light uppercase tracking-wider">First Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Rahul"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-brand-cream/50 border border-brand-sand rounded-xl text-brand-brown placeholder-gray-400 focus:outline-none focus:border-brand-gold transition-colors text-sm"
                      />
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brand-brown-light uppercase tracking-wider">Last Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Sharma"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-3 bg-brand-cream/50 border border-brand-sand rounded-xl text-brand-brown placeholder-gray-400 focus:outline-none focus:border-brand-gold transition-colors text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-brown-light uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-brand-cream/50 border border-brand-sand rounded-xl text-brand-brown placeholder-gray-400 focus:outline-none focus:border-brand-gold transition-colors text-sm"
                  />
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-brand-brown-light uppercase tracking-wider">Password</label>
                  {isLogin && (
                    <a href="#" className="text-xs text-brand-gold hover:underline">Forgot?</a>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-brand-cream/50 border border-brand-sand rounded-xl text-brand-brown placeholder-gray-400 focus:outline-none focus:border-brand-gold transition-colors text-sm"
                  />
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Confirm Password */}
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-brand-brown-light uppercase tracking-wider">Confirm Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-brand-cream/50 border border-brand-sand rounded-xl text-brand-brown placeholder-gray-400 focus:outline-none focus:border-brand-gold transition-colors text-sm"
                    />
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-brand-gold hover:bg-brand-gold-dark text-white font-semibold rounded-full flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-brand-gold/25 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  "Processing..."
                ) : isLogin ? (
                  <>
                    <LogIn size={16} />
                    Sign In to Account
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    Create Free Account
                  </>
                )}
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
