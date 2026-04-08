"use client";

import Link from "next/link";
import { useState } from "react";
import { Beer, Menu, X, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center">
            <Beer size={18} className="text-white" />
          </div>
          <span className="font-black text-gray-900 text-lg tracking-tight">
            Happy<span className="text-orange-500">Hour</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="text-gray-600 hover:text-orange-500 transition-colors">
            Discover
          </Link>
          <Link href="/?now=true" className="flex items-center gap-1 text-green-600 hover:text-green-700 font-semibold">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live Now
          </Link>
          <Link href="/advertise" className="text-gray-600 hover:text-orange-500 transition-colors">
            For Businesses
          </Link>
          <Link href="/owner/dashboard" className="text-gray-600 hover:text-orange-500 transition-colors">
            Owner Portal
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/owner/dashboard"
            className="text-sm font-semibold text-orange-600 border border-orange-200 px-4 py-1.5 rounded-full hover:bg-orange-50 transition-colors"
          >
            Add Your Bar
          </Link>
          <button className="text-sm font-semibold bg-orange-500 text-white px-4 py-1.5 rounded-full hover:bg-orange-600 transition-colors">
            Sign In
          </button>
        </div>

        <button
          className="md:hidden text-gray-600"
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          <Link href="/" className="block text-gray-700 font-medium py-2" onClick={() => setMobileOpen(false)}>Discover</Link>
          <Link href="/?now=true" className="block text-green-600 font-semibold py-2 flex items-center gap-2" onClick={() => setMobileOpen(false)}>
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Live Now
          </Link>
          <Link href="/advertise" className="block text-gray-700 font-medium py-2" onClick={() => setMobileOpen(false)}>For Businesses</Link>
          <Link href="/owner/dashboard" className="block text-gray-700 font-medium py-2" onClick={() => setMobileOpen(false)}>Owner Portal</Link>
          <div className="pt-2 border-t border-gray-100 flex gap-3">
            <Link href="/owner/dashboard" className="flex-1 text-center text-sm font-semibold text-orange-600 border border-orange-200 px-4 py-2 rounded-full" onClick={() => setMobileOpen(false)}>
              Add Your Bar
            </Link>
            <button className="flex-1 text-sm font-semibold bg-orange-500 text-white px-4 py-2 rounded-full">Sign In</button>
          </div>
        </div>
      )}
    </nav>
  );
}
