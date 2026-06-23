import { useState } from "react";
import type { User } from "@supabase/supabase-js";

interface NavbarProps {
  currentPage: "home" | "sell";
  onNavigate: (page: "home" | "sell") => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  user: User | null;
  onLogout: () => void;
}

export default function Navbar({ currentPage, onNavigate, searchQuery, onSearchChange, user, onLogout }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <button onClick={() => { onNavigate("home"); setMenuOpen(false); }} className="flex items-center gap-2 flex-shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-800">Book<span className="text-blue-600">Swap</span></span>
          </button>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
              </svg>
              <input type="text" placeholder="Search books, authors, categories…" value={searchQuery} onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200 placeholder:text-slate-400" />
            </div>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2">
            <button onClick={() => onNavigate("home")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${currentPage === "home" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"}`}>Home</button>
            <button onClick={() => onNavigate("sell")} className="ml-2 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all duration-200 shadow-md shadow-blue-200 flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Sell Book
            </button>
            {/* User info + logout */}
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-slate-600 font-medium hidden lg:block">{userName}</span>
              <button onClick={onLogout} className="text-xs text-slate-400 hover:text-red-500 transition-colors px-2 py-1 rounded-lg hover:bg-red-50">Logout</button>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-slate-100 pt-3">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" /></svg>
              <input type="text" placeholder="Search books…" value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 outline-none" />
            </div>
            <div className="flex items-center gap-2 px-2 py-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">{userName.charAt(0).toUpperCase()}</div>
              <span className="text-sm font-medium text-slate-700">{userName}</span>
            </div>
            <button onClick={() => { onNavigate("home"); setMenuOpen(false); }} className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Home</button>
            <button onClick={() => { onNavigate("sell"); setMenuOpen(false); }} className="w-full px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Sell Book
            </button>
            <button onClick={onLogout} className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50">Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}
