"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { GOTRAS, CITIES, EDUCATION } from "@/lib/constants";

export default function SearchPage() {
  const { user, loading: authLoading } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    gender: "", gotra: "", city: "", education: "", minAge: "", maxAge: "",
  });

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        fetchProfiles();
      } else {
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user]);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "profiles"),
        where("profileComplete", "==", true),
        where("visible", "==", true)
      );
      const snapshot = await getDocs(q);
      const allProfiles = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((p) => p.id !== user?.uid);
      setProfiles(allProfiles);
    } catch (err) {
      console.error("Error fetching profiles:", err);
    } finally {
      setLoading(false);
    }
  };

  const getAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const filteredProfiles = profiles.filter((p) => {
    const age = getAge(p.dateOfBirth);
    if (filters.gender && p.gender !== filters.gender) return false;
    if (filters.gotra && p.gotra !== filters.gotra) return false;
    if (filters.city && p.currentCity !== filters.city) return false;
    if (filters.education && p.education !== filters.education) return false;
    if (filters.minAge && age && age < parseInt(filters.minAge)) return false;
    if (filters.maxAge && age && age > parseInt(filters.maxAge)) return false;
    return true;
  });

  if (authLoading) {
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
          <p className="text-gray-600 mb-4">Please sign in to search profiles.</p>
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Search Profiles</h1>
            <p className="text-gray-600 mt-1">Find your perfect match</p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-lg transition-colors"
          >
            {showFilters ? "Hide Filters" : "Filters"}
          </button>
        </div>

        {showFilters && (
          <div className="bg-white border border-rose-100 rounded-2xl p-6 mb-8">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select value={filters.gender} onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500">
                  <option value="">Any</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gotra</label>
                <select value={filters.gotra} onChange={(e) => setFilters({ ...filters, gotra: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500">
                  <option value="">Any</option>
                  {GOTRAS.sort().map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <select value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500">
                  <option value="">Any</option>
                  {CITIES.sort().map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                <select value={filters.education} onChange={(e) => setFilters({ ...filters, education: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500">
                  <option value="">Any</option>
                  {EDUCATION.sort().map((e) => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Age</label>
                <input type="number" value={filters.minAge} onChange={(e) => setFilters({ ...filters, minAge: e.target.value })}
                  placeholder="18" min="18" max="70"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Age</label>
                <input type="number" value={filters.maxAge} onChange={(e) => setFilters({ ...filters, maxAge: e.target.value })}
                  placeholder="70" min="18" max="70"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500" />
              </div>
            </div>
            <button onClick={() => setFilters({ gender: "", gotra: "", city: "", education: "", minAge: "", maxAge: "" })}
              className="mt-4 text-sm text-rose-600 hover:text-rose-700 font-medium">
              Clear All Filters
            </button>
          </div>
        )}


        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500" />
          </div>
        ) : filteredProfiles.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Profiles Found</h3>
            <p className="text-gray-600">Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProfiles.map((p) => {
              const age = getAge(p.dateOfBirth);
              return (
                <Link key={p.id} href={`/profile?id=${p.id}`}
                  className="bg-white border border-rose-100 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="h-40 bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                    {p.photoURL ? (
                      <img src={p.photoURL} alt={p.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-5xl">{p.gender === "Male" ? "👨" : "👩"}</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-rose-600 transition-colors">
                      {p.fullName}
                    </h3>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      {age && <p>🎂 {age} years</p>}
                      {p.gotra && <p>🏛️ {p.gotra}</p>}
                      {p.currentCity && <p>📍 {p.currentCity}</p>}
                      {p.occupation && <p>💼 {p.occupation}</p>}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

