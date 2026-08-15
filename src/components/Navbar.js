"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, profile, loading, logout } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/search", label: "Search" },
  ];

  const authLinks = user
    ? [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/matches", label: "Matches" },
        { href: "/profile/edit", label: "My Profile" },
      ]
    : [];

  const isActive = (href) => pathname === href;

  return (
    <nav className="bg-white shadow-md border-b border-rose-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">💍</span>
              <span className="text-xl font-bold text-rose-600">Divya<span className="text-pink-400">Milan</span></span>
            </Link>
            <div className="hidden md:flex ml-10 space-x-1">
              {[...navLinks, ...authLinks].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href) ? "bg-rose-50 text-rose-700" : "text-gray-600 hover:text-rose-600 hover:bg-rose-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {!loading && (
              <>
                {user ? (
                  <div className="hidden md:flex items-center space-x-3">
                    <Link href="/profile/edit" className="flex items-center space-x-2 text-sm text-gray-700 hover:text-rose-600">
                      <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-semibold">
                        {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <span className="font-medium max-w-[120px] truncate">
                        {profile?.fullName || user.email?.split("@")[0] || "User"}
                      </span>
                    </Link>
                    <button onClick={logout} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="hidden md:flex items-center space-x-2">
                    <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                      Login
                    </Link>
                    <Link href="/register" className="px-4 py-2 text-sm font-medium text-white bg-rose-500 hover:bg-rose-600 rounded-lg transition-colors">
                      Register
                    </Link>
                  </div>
                )}
              </>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-rose-50">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-rose-100 bg-white">
          <div className="px-4 py-3 space-y-1">
            {[...navLinks, ...authLinks].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive(link.href) ? "bg-rose-50 text-rose-700" : "text-gray-600 hover:text-rose-600 hover:bg-rose-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-gray-100 pt-2 mt-2">
              {user ? (
                <button onClick={() => { logout(); setMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg">
                  Logout
                </button>
              ) : (
                <div className="space-y-1">
                  <Link href="/login" onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
                    Login
                  </Link>
                  <Link href="/register" onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2 text-sm font-medium text-white bg-rose-500 hover:bg-rose-600 rounded-lg text-center">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}


