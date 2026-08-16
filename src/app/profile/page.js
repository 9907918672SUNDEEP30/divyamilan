"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { doc, getDoc, collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

function ViewProfileContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const { user, loading: authLoading, profile: myProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [interestSent, setInterestSent] = useState(false);
  const [interestLoading, setInterestLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!authLoading) {
      if (user && id) {
        fetchProfile();
      } else {
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user, authLoading]);

  const fetchProfile = async () => {
    try {
      const docRef = doc(db, "profiles", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile({ id: docSnap.id, ...docSnap.data() });
        if (user) {
          const q = query(
            collection(db, "interests"),
            where("fromUserId", "==", user.uid),
            where("toUserId", "==", id)
          );
          const snap = await getDocs(q);
          if (!snap.empty) setInterestSent(true);
        }
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
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

  const sendInterest = async () => {
    if (!user) {
      setMessage("");
      router.push("/login");
      return;
    }
    setInterestLoading(true);
    setMessage("");
    try {
      await addDoc(collection(db, "interests"), {
        fromUserId: user.uid,
        toUserId: id,
        fromName: myProfile?.fullName || user.displayName || "Unknown",
        toName: profile?.fullName || "Unknown",
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      setInterestSent(true);
      setMessage("Interest sent successfully! ✅");
    } catch (err) {
      setMessage("Failed to send interest. Please try again.");
    } finally {
      setInterestLoading(false);
    }
  };

  if (authLoading || loading) {
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
          <p className="text-gray-600 mb-4">Please sign in to view profiles.</p>
          <Link href="/login" className="text-rose-600 hover:text-rose-700 font-medium">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-4">This profile does not exist or has been removed.</p>
          <Link href="/search" className="text-rose-600 hover:text-rose-700 font-medium">Browse Profiles</Link>
        </div>
      </div>
    );
  }

  const age = getAge(profile.dateOfBirth);
  const isOwnProfile = user?.uid === id;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-rose-100 overflow-hidden mb-6">
          <div className="h-48 bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
            {profile.photoURL ? (
              <img src={profile.photoURL} alt={profile.fullName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-7xl">{profile.gender === "Male" ? "👨" : "👩"}</span>
            )}
          </div>
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900">{profile.fullName}</h1>
            <p className="text-gray-600 mt-1">
              {age && `${age} years`}
              {profile.gotra && ` • ${profile.gotra}`}
              {profile.currentCity && ` • ${profile.currentCity}`}
            </p>
            <div className="mt-6 grid md:grid-cols-2 gap-4 text-sm">
              {profile.education && (
                <div><p className="text-gray-500">Education</p><p className="font-medium text-gray-900">{profile.education}</p></div>
              )}
              {profile.occupation && (
                <div><p className="text-gray-500">Occupation</p><p className="font-medium text-gray-900">{profile.occupation}</p></div>
              )}
              {profile.annualIncome && (
                <div><p className="text-gray-500">Annual Income</p><p className="font-medium text-gray-900">{profile.annualIncome}</p></div>
              )}
              {profile.maritalStatus && (
                <div><p className="text-gray-500">Marital Status</p><p className="font-medium text-gray-900">{profile.maritalStatus}</p></div>
              )}
            </div>
          </div>
        </div>

        {profile.aboutMe && (
          <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">About Me</h2>
            <p className="text-gray-700 whitespace-pre-line">{profile.aboutMe}</p>
          </div>
        )}

        {!isOwnProfile && (
          <div className="text-center py-4">
            {message && <p className="text-green-600 mb-4">{message}</p>}
            {interestSent ? (
              <p className="text-lg font-medium text-green-600">💌 Interest sent! Waiting for response...</p>
            ) : (
              <button onClick={sendInterest} disabled={interestLoading}
                className="px-8 py-3 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-semibold rounded-xl transition-colors text-lg">
                {interestLoading ? "Sending..." : "💌 Send Interest"}
              </button>
            )}
          </div>
        )}

        {isOwnProfile && (
          <div className="text-center py-6">
            <Link href="/profile/edit" className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl transition-colors">
              Edit Your Profile
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ViewProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500" />
      </div>
    }>
      <ViewProfileContent />
    </Suspense>
  );
}

