"use client";

import { useState } from "react";
import { User, Lock, Mail, UserPlus, LogIn, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { signIn, signUp, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

// Google Logo SVG component
function GoogleLogo({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login with Better Auth
        const { data, error: authError } = await signIn.email({
          email: formData.email,
          password: formData.password,
        });

        if (authError) {
          setError(authError.message || "Invalid email or password");
          setIsLoading(false);
          return;
        }

        setSubmitted(true);
        setTimeout(() => {
          router.refresh();
        }, 1500);
      } else {
        // Register with Better Auth
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          setIsLoading(false);
          return;
        }

        const { data, error: authError } = await signUp.email({
          email: formData.email,
          password: formData.password,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
        });

        if (authError) {
          setError(authError.message || "Registration failed");
          setIsLoading(false);
          return;
        }

        setSubmitted(true);
        setTimeout(() => {
          router.refresh();
        }, 1500);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    }

    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsGoogleLoading(true);

    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/account",
      });
    } catch (err) {
      setError("Failed to sign in with Google. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  const handleReset = async () => {
    await signOut();
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
            <>
              {/* Google Sign-In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading || isLoading}
                className="w-full py-3.5 bg-white hover:bg-gray-50 text-brand-brown font-semibold rounded-full flex items-center justify-center gap-3 transition-all duration-300 border-2 border-brand-sand hover:border-brand-gold/50 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGoogleLoading ? (
                  <div className="w-5 h-5 border-2 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin" />
                ) : (
                  <GoogleLogo size={20} />
                )}
                {isGoogleLoading ? "Redirecting..." : "Continue with Google"}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-brand-sand/80"></div>
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">or</span>
                <div className="flex-1 h-px bg-brand-sand/80"></div>
              </div>

              {/* Email/Password Form */}
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
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-10 py-3 bg-brand-cream/50 border border-brand-sand rounded-xl text-brand-brown placeholder-gray-400 focus:outline-none focus:border-brand-gold transition-colors text-sm"
                    />
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-brown transition-colors">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                {!isLogin && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brand-brown-light uppercase tracking-wider">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full pl-10 pr-10 py-3 bg-brand-cream/50 border border-brand-sand rounded-xl text-brand-brown placeholder-gray-400 focus:outline-none focus:border-brand-gold transition-colors text-sm"
                      />
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-brown transition-colors">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading || isGoogleLoading}
                  className="w-full py-3.5 bg-brand-gold hover:bg-brand-gold-dark text-white font-semibold rounded-full flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-brand-gold/25 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
            </>
          )}
        </div>

      </div>
    </div>
  );
}
