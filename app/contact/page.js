"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";
import { submitContactMessage } from "../actions/contact-actions";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate phone number: exactly 10 digits, cannot start with 0
    if (!/^[1-9][0-9]{9}$/.test(formData.phone)) {
      setError("Please enter a valid 10-digit phone number that doesn't start with 0.");
      setIsSubmitting(false);
      return;
    }

    const res = await submitContactMessage(formData);

    if (res.success) {
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } else {
      setError(res.error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-brand-warm-white min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-brand-gold text-sm font-semibold uppercase tracking-[0.2em] block">
            Get in Touch
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-brand-brown mt-3 mb-4">
            Contact Thar Delight
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
            Whether you want to place a custom order, inquire about wholesale partnerships, or just say hello — we'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Contact Details Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-7 border border-brand-sand/60 space-y-8">

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-brand-brown font-semibold mb-1">Our Location</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    12, Desert Crafts Plaza,
                    Opp. High Court, Jodhpur,
                    Rajasthan, 342001
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center flex-shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-brand-brown font-semibold mb-1">Call Us</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    +91 98765 43210
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center flex-shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-brand-brown font-semibold mb-1">Email</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    hello@thardelight.com
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center flex-shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-brand-brown font-semibold mb-1">Business Hours</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Mon - Sat: 9:00 AM - 7:00 PM
                    <span className="block text-xs text-brand-gold font-medium mt-1">Closed on Sundays</span>
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 border border-brand-sand/60">
              {submitted ? (
                <div className="py-16 text-center animate-fade-in-up">
                  <div className="inline-flex p-4 bg-emerald-50 text-emerald-500 rounded-full mb-4">
                    <CheckCircle2 size={44} />
                  </div>
                  <h3 className="font-serif text-2xl text-brand-brown mb-2">Message Sent!</h3>
                  <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">
                    Thank you for reaching out to Thar Delight. Our team will review your message and get back to you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2 bg-brand-gold hover:bg-brand-gold-dark text-white text-sm font-semibold rounded-full transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-brand-brown-light">Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Mayank Aggarwal"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-brand-cream/50 border border-brand-sand rounded-xl text-brand-brown placeholder-gray-400 focus:outline-none focus:border-brand-gold transition-colors text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-brand-brown-light">Your Email</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. Mayank@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-brand-cream/50 border border-brand-sand rounded-xl text-brand-brown placeholder-gray-400 focus:outline-none focus:border-brand-gold transition-colors text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-brand-brown-light">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      maxLength={10}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\\D/g, '') })}
                      className="w-full px-4 py-3 bg-brand-cream/50 border border-brand-sand rounded-xl text-brand-brown placeholder-gray-400 focus:outline-none focus:border-brand-gold transition-colors text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-brand-brown-light">Subject</label>
                    <input
                      type="text"
                      required
                      placeholder="What is this regarding?"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-brand-cream/50 border border-brand-sand rounded-xl text-brand-brown placeholder-gray-400 focus:outline-none focus:border-brand-gold transition-colors text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-brand-brown-light">Message</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Type your message here..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 bg-brand-cream/50 border border-brand-sand rounded-xl text-brand-brown placeholder-gray-400 focus:outline-none focus:border-brand-gold transition-colors text-sm resize-none"
                    />
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 bg-brand-gold hover:bg-brand-gold-dark text-white font-semibold rounded-full flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-brand-gold/25 disabled:opacity-50"
                  >
                    <Send size={16} />
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
