"use client";

import { useState, useEffect } from "react";
import { Mail, Calendar, Search, Loader2 } from "lucide-react";
import { getNewsletterSubscribers } from "@/app/actions/admin-actions";

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getNewsletterSubscribers()
      .then(setSubscribers)
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = subscribers.filter((s) => 
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-brand-brown">
            Newsletter Subscribers
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            View the list of users subscribed to your newsletter
          </p>
        </div>
        <div className="bg-brand-gold/10 text-brand-gold-dark px-4 py-2 rounded-xl font-medium border border-brand-gold/20 flex items-center gap-2">
          <Mail size={18} />
          Total: {subscribers.length}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search by email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-brand-sand/50 rounded-xl text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all"
        />
      </div>

      {/* Subscribers List */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-brand-gold" size={32} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-brand-sand/30 shadow-sm">
          <Mail size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500 font-medium text-lg">No subscribers found</p>
          <p className="text-sm text-gray-400 mt-1">
            {searchQuery ? "Try a different search term" : "Your subscriber list is empty"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-brand-sand/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-brand-cream/50 border-b border-brand-sand/40 text-brand-brown font-semibold">
                <tr>
                  <th className="px-6 py-4">Email Address</th>
                  <th className="px-6 py-4">Subscribed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-sand/30">
                {filtered.map((sub) => (
                  <tr key={sub.id} className="hover:bg-brand-cream/20 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3 font-medium text-gray-800">
                      <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                        <Mail size={14} />
                      </div>
                      {sub.email}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        {new Date(sub.date).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
