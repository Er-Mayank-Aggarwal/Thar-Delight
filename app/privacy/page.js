import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Thar Delight",
  description: "How Thar Delight collects, protects, and uses your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-brand-warm-white min-h-screen py-12 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-brand-gold text-xs font-bold tracking-widest uppercase mb-2">Data Protection</p>
          <h1 className="font-serif text-3xl sm:text-4xl text-brand-brown font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Your privacy is paramount to us. Here is how Thar Delight respects and safeguards your personal data.
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-brand-sand/60 shadow-sm space-y-8 text-brand-brown/90 leading-relaxed text-sm sm:text-base">
          
          <section>
            <h2 className="font-serif text-xl font-bold text-brand-brown mb-3">1. Information We Collect</h2>
            <p className="mb-2">We collect information necessary to process your orders and provide an exceptional shopping experience:</p>
            <ul className="list-disc list-inside space-y-1.5 text-gray-700 ml-2">
              <li><strong>Contact Details:</strong> Full name, email address, and phone number.</li>
              <li><strong>Shipping Details:</strong> Delivery address, city, state, postal pincode, and landmarks.</li>
              <li><strong>Account Credentials:</strong> Hashed passwords or OAuth authentication tokens (via Google Sign-in).</li>
              <li><strong>Transaction Records:</strong> Order history, amounts, and payment IDs (we do NOT store credit/debit card numbers or UPI PINs).</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-brand-brown mb-3">2. How We Use Your Information</h2>
            <p className="mb-2">Your information is used strictly for legitimate business purposes:</p>
            <ul className="list-disc list-inside space-y-1.5 text-gray-700 ml-2">
              <li>Processing, packaging, and dispatching your orders.</li>
              <li>Sending order updates, dispatch notices, and digital invoices via SMS or email.</li>
              <li>Customer service inquiries and resolving product feedback.</li>
              <li>Preventing unauthorized access, fraudulent payments, and abuse.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-brand-brown mb-3">3. Payment Security & PCI-DSS Compliance</h2>
            <p>
              All online payments on Thar Delight are processed securely through <strong>Razorpay</strong>, an RBI-authorized and PCI-DSS Level 1 certified payment gateway. Your payment card numbers, CVVs, and banking credentials are encrypted end-to-end and never touch or reside on our servers.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-brand-brown mb-3">4. Sharing with Third Parties</h2>
            <p>
              We never sell, rent, or trade your personal information to third parties. We share data only with verified partners required to complete your delivery (such as logistics and courier aggregators like Delhivery/Blue Dart) and cloud infrastructure providers (such as Cloudinary for media and Neon PostgreSQL).
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-brand-brown mb-3">5. Data Retention & Your Rights</h2>
            <p>
              You have the right to review, update, or request the deletion of your account details at any time by logging into your profile or contacting us at <a href="mailto:thardelight@gmail.com" className="text-brand-gold hover:underline">thardelight@gmail.com</a>.
            </p>
          </section>

          <section className="pt-4 border-t border-brand-sand/40">
            <h2 className="font-serif text-xl font-bold text-brand-brown mb-2">6. Grievance Officer</h2>
            <p className="text-sm text-gray-600">
              In accordance with the Information Technology Act and Indian Consumer Protection (E-Commerce) Rules:
            </p>
            <p className="mt-2 text-sm text-brand-brown font-medium">
              Grievance Officer: Customer Redressal Team<br />
              Thar Delight, D-15, Rameshwar Nagar, Jodhpur, Rajasthan 342001<br />
              Email: <a href="mailto:thardelight@gmail.com" className="text-brand-gold hover:underline">thardelight@gmail.com</a>
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

