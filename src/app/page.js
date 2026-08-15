"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-rose-500 via-rose-600 to-pink-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-24 sm:py-32 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="text-5xl mb-6">💍</div>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
              Find Your <span className="text-pink-200">Life Partner</span>
            </h1>
            <p className="text-lg sm:text-xl text-rose-100 mb-10 max-w-2xl mx-auto">
              A heartfelt matrimonial platform connecting individuals who share
              your culture, values, and traditions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!loading && !user ? (
                <>
                  <Link
                    href="/register"
                    className="px-8 py-4 bg-white text-rose-600 font-semibold rounded-xl shadow-lg hover:bg-rose-50 transition-all hover:shadow-xl text-lg"
                  >
                    Create Free Profile
                  </Link>
                  <Link
                    href="/login"
                    className="px-8 py-4 bg-rose-700/50 text-white font-semibold rounded-xl border border-rose-300/30 hover:bg-rose-700/70 transition-all text-lg"
                  >
                    Sign In
                  </Link>
                </>
              ) : !loading && user ? (
                <Link
                  href="/dashboard"
                  className="px-8 py-4 bg-white text-rose-600 font-semibold rounded-xl shadow-lg hover:bg-rose-50 transition-all hover:shadow-xl text-lg"
                >
                  Go to Dashboard
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose DivyaMilan?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We understand the values and traditions that matter most.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-rose-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Smart Matching
              </h3>
              <p className="text-gray-600">
                Advanced filters based on education, profession, city, and lifestyle preferences.
              </p>
            </div>
            <div className="bg-rose-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Verified Profiles
              </h3>
              <p className="text-gray-600">
                Authentic profiles with privacy controls. Your data is safe and secure.
              </p>
            </div>
            <div className="bg-rose-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Worldwide Community
              </h3>
              <p className="text-gray-600">
                Connect with singles from across the globe, wherever you are.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* How It Works */}
      <section className="py-20 bg-rose-50/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">Find your match in four simple steps</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", icon: "📝", title: "Create Profile", desc: "Sign up and create your detailed profile" },
              { step: "2", icon: "🔍", title: "Search", desc: "Browse profiles using smart filters" },
              { step: "3", icon: "💌", title: "Express Interest", desc: "Send interest to profiles you like" },
              { step: "4", icon: "💑", title: "Connect", desc: "Match and start your journey together" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg shadow-rose-200">
                  <span role="img" aria-label={item.title}>{item.icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-rose-500 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Start Your Journey Today
          </h2>
          <p className="text-lg text-rose-100 mb-8 max-w-2xl mx-auto">
            Join thousands of individuals who found their perfect match through our platform.
          </p>
          {!loading && !user && (
            <Link
              href="/register"
              className="inline-block px-10 py-4 bg-white text-rose-600 font-semibold rounded-xl shadow-lg hover:bg-rose-50 transition-all hover:shadow-xl text-lg"
            >
              Create Your Profile - It's Free!
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
