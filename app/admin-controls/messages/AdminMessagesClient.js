"use client";

import { useState } from "react";
import { Mail, MessageSquare, Calendar, Phone, Search } from "lucide-react";

export default function AdminMessagesClient({ initialMessages }) {
  const [messages, setMessages] = useState(initialMessages);
  const [searchQuery, setSearchQuery] = useState("");

  if (initialMessages !== messages) {
    setMessages(initialMessages);
  }

  const filtered = messages.filter((m) => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-brand-brown">
            Contact Messages
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            View inquiries and messages from your customers
          </p>
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
          placeholder="Search by name, email, or subject..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-brand-sand/50 rounded-xl text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all"
        />
      </div>

      {/* Messages List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-brand-sand/30 shadow-sm">
          <MessageSquare size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500 font-medium text-lg">No messages found</p>
          <p className="text-sm text-gray-400 mt-1">
            {searchQuery ? "Try a different search term" : "Your inbox is empty"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((msg) => (
            <div key={msg.id} className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-brand-sand/30 hover:border-brand-gold/40 transition-colors">
              <div className="flex flex-col sm:flex-row gap-4 sm:items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-gold/20 to-brand-gold-light/30 flex items-center justify-center text-brand-gold-dark font-bold text-lg flex-shrink-0">
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-brown text-lg">{msg.name}</h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 mt-0.5">
                      <span className="flex items-center gap-1.5"><Mail size={14} /> {msg.email}</span>
                      <span className="hidden sm:inline text-gray-300">|</span>
                      <span className="flex items-center gap-1.5"><Phone size={14} /> {msg.phone}</span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-400 flex items-center gap-1.5 bg-brand-cream/50 px-3 py-1.5 rounded-lg self-start mt-2 sm:mt-0">
                  <Calendar size={14} />
                  {new Date(msg.date).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", 
                    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                  })}
                </div>
              </div>
              
              <div className="bg-brand-cream/30 rounded-xl p-4 sm:p-5 border border-brand-sand/20">
                <p className="font-semibold text-brand-brown mb-2 border-b border-brand-sand/30 pb-2">
                  Subject: {msg.subject}
                </p>
                <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                  {msg.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
