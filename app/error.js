"use client";

import { useEffect } from "react";
import { RefreshCw, AlertTriangle, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log to an error reporting service in production
    console.error("Unhandled application error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center animate-fade-in-up">
        {/* Icon */}
        <div className="mx-auto w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>

        {/* Heading */}
        <h1 className="font-serif text-3xl text-brand-brown mb-3">
          Something went wrong
        </h1>

        {/* Message */}
        <p className="text-gray-500 mb-8 leading-relaxed">
          We encountered an unexpected error. Don&apos;t worry — your data is
          safe. Please try again or head back to the homepage.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-gold hover:bg-brand-gold-dark text-white font-semibold rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-brand-gold/25 hover:-translate-y-0.5"
          >
            <RefreshCw size={18} />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-brand-brown/10 text-brand-brown hover:border-brand-gold hover:text-brand-gold font-semibold rounded-full transition-all duration-300"
          >
            <Home size={18} />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
