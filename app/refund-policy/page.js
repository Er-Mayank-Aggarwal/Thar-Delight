import Link from "next/link";
import { RefreshCw, CheckCircle2, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Cancellation, Returns & Refund Policy — Thar Delight",
  description: "Learn about Thar Delight return, cancellation, and refund guidelines for artisanal cookies and handcrafted serveware.",
};

export default function RefundPolicyPage() {
  return (
    <div className="bg-brand-warm-white min-h-screen py-12 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-brand-gold text-xs font-bold tracking-widest uppercase mb-2">Customer Assurance</p>
          <h1 className="font-serif text-3xl sm:text-4xl text-brand-brown font-bold mb-4">Returns & Refund Policy</h1>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            We take utmost care in handcrafting and packing your treats. Here is how we handle returns, replacements, and refunds.
          </p>
        </div>

        {/* Policy Content */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-brand-sand/60 shadow-sm space-y-8 text-brand-brown/90 leading-relaxed text-sm sm:text-base">
          
          <section>
            <h2 className="font-serif text-xl font-bold text-brand-brown mb-3">1. Perishable Food Items (Cookies & Farali Snacks)</h2>
            <p className="mb-2">
              Due to hygiene and food safety regulations, edible items (millet cookies, dry fruit snacks, farali sweets) cannot be returned once delivered.
            </p>
            <p>
              However, if your order arrives <strong>damaged in transit, expired, compromised in packaging, or incorrect</strong>, we offer a <strong>100% free replacement or full refund</strong>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-brand-brown mb-3">2. How to Claim a Damaged or Defective Item</h2>
            <p className="mb-2">To claim a replacement or refund for damaged products:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
              <li>Notify us within <strong>48 hours</strong> of receiving the delivery.</li>
              <li>Email us at <a href="mailto:thardelight@gmail.com" className="text-brand-gold hover:underline">thardelight@gmail.com</a> or WhatsApp us at <strong>+91 89551 43139</strong>.</li>
              <li>Attach your Order ID (#THAR-XXXX) and clear photos/unboxing video showing the damaged items and outer packaging label.</li>
            </ul>
            <p className="mt-2 text-xs text-gray-500">
              Our quality review team will verify the claim and approve a replacement or refund within 24 hours.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-brand-brown mb-3">3. Handcrafted Wooden Serveware (Non-perishable)</h2>
            <p>
              Handcrafted wooden trays and serveware items are eligible for return or replacement within <strong>7 days</strong> of delivery if they arrive cracked, broken, or materially different from the product description. The item must be in its original packaging.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-brand-brown mb-3">4. Order Cancellation Policy</h2>
            <p className="mb-2">
              You may cancel your order at any time <strong>before it is dispatched</strong> (typically within 12 hours of placing the order) by visiting your <Link href="/account" className="text-brand-gold font-semibold underline">Account</Link> or contacting our support team.
            </p>
            <p>
              Once an order has been picked up by the courier and assigned an AWB tracking number, it cannot be cancelled.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-brand-brown mb-3">5. Refund Processing Timelines</h2>
            <p className="mb-2">
              Once an approved refund is initiated:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-gray-700 ml-2">
              <li><strong>Prepaid Orders (UPI, Netbanking, Cards):</strong> The refund is credited back to your original payment method via Razorpay within <strong>5 to 7 business days</strong>.</li>
              <li><strong>Cash on Delivery (COD) Orders:</strong> The refund will be credited directly to your bank account or UPI ID via bank transfer within 2 to 4 business days after you provide your banking details.</li>
            </ul>
          </section>

          <section className="pt-4 border-t border-brand-sand/40">
            <h2 className="font-serif text-xl font-bold text-brand-brown mb-2">Need Help with a Return?</h2>
            <p className="text-sm text-gray-600">
              We are here to ensure your Thar Delight experience is delightful. Contact our support team:
            </p>
            <p className="mt-2 text-sm text-brand-brown font-medium">
              Email: <a href="mailto:thardelight@gmail.com" className="text-brand-gold hover:underline">thardelight@gmail.com</a> | Helpline: +91 89551 43139 (Mon-Sat, 10 AM - 7 PM)
            </p>
          </section>

        </div>

        {/* Back Link */}
        <div className="text-center mt-8">
          <Link href="/" className="text-sm font-semibold text-brand-gold hover:text-brand-gold-dark transition-colors">
            ← Return to Home
          </Link>
        </div>

      </div>
    </div>
  );
}

