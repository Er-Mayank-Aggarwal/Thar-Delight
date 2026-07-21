"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-gold hover:bg-brand-gold-dark text-white font-semibold rounded-full transition-colors shadow-sm"
    >
      <Printer size={16} /> Print Invoice
    </button>
  );
}
