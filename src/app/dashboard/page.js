"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function DashboardPage() {
  const { user, profile, loading } = useAuth();
  const [stats, setStats] = useState({
    interestsSent: 0,
    interestsReceived: 0,
    matches: 0,
  });

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const sentSnap = await getDocs(
        query(collection(db, "interests"), where("fromUserId", "==", user.uid))
      );
      const receivedSnap = await getDocs(
        query(collection(db, "interests"), where("toUserId", "==", user.uid))
      );
      const matchesSnap = await getDocs(
        query(
          collection(db, "interests"),
          where("fromUserId", "==", user.uid),
          where("status", "==", "accepted")
        )
      );
      setStats({
        interestsSent: sentSnap.size,
        interestsReceived: receivedSnap.size,
        matches: matchesSnap.size,
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please sign in to view your dashboard.</p>
          <Link href="/login" className="text-rose-600 hover:text-rose-700 font-medium">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {profile?.fullName || user.email?.split("@")[0] || "User"}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            {profile?.profileComplete
              ? "Here's your dashboard overview"
              : "Complete your profile to start finding matches!"}
          </p>
        </div>

        {!profile?.profileComplete && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-amber-800">Complete Your Profile</h3>
                <p className="text-amber-700 mt-1">
                  Fill in your details to appear in search results and find matches.
                </p>
              </div>
              <Link
                href="/profile/edit"
                className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors"
              >
                Complete Now
              </Link>
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {[
            { label: "Interests Sent", value: stats.interestsSent, icon: "💌", color: "bg-blue-50 border-blue-200" },
            { label: "Interests Received", value: stats.interestsReceived, icon: "💝", color: "bg-pink-50 border-pink-200" },
            { label: "Matches", value: stats.matches, icon: "💑", color: "bg-green-50 border-green-200" },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.color} border rounded-2xl p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <span className="text-3xl">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/search" className="bg-white border border-rose-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900">Browse Profiles</h3>
            <p className="text-gray-600 text-sm mt-1">Search and discover potential matches</p>
          </Link>
          <Link href="/matches" className="bg-white border border-rose-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-3">💕</div>
            <h3 className="text-lg font-semibold text-gray-900">Your Matches</h3>
            <p className="text-gray-600 text-sm mt-1">View interests and mutual matches</p>
          </Link>
          <Link href="/profile/edit" className="bg-white border border-rose-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-3">✏️</div>
            <h3 className="text-lg font-semibold text-gray-900">Edit Profile</h3>
            <p className="text-gray-600 text-sm mt-1">Update your profile information</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
