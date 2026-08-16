"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export default function MatchesPage() {
  const { user } = useAuth();
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [tab, setTab] = useState("received");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchInterests();
  }, [user]);

  const fetchInterests = async () => {
    setLoading(true);
    try {
      const receivedSnap = await getDocs(
        query(collection(db, "interests"), where("toUserId", "==", user.uid))
      );
      const receivedList = receivedSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const sentSnap = await getDocs(
        query(collection(db, "interests"), where("fromUserId", "==", user.uid))
      );
      const sentList = sentSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const enrichedReceived = await Promise.all(
        receivedList.map(async (item) => {
          const profileDoc = await getDoc(doc(db, "profiles", item.fromUserId));
          return { ...item, fromProfile: profileDoc.exists() ? { id: profileDoc.id, ...profileDoc.data() } : null };
        })
      );
      const enrichedSent = await Promise.all(
        sentList.map(async (item) => {
          const profileDoc = await getDoc(doc(db, "profiles", item.toUserId));
          return { ...item, toProfile: profileDoc.exists() ? { id: profileDoc.id, ...profileDoc.data() } : null };
        })
      );
      setReceived(enrichedReceived);
      setSent(enrichedSent);
    } catch (err) {
      console.error("Error fetching interests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInterest = async (interestId, action) => {
    try {
      await updateDoc(doc(db, "interests", interestId), {
        status: action === "accept" ? "accepted" : "rejected",
      });
      fetchInterests();
    } catch (err) {
      console.error("Error updating interest:", err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please sign in to view your matches.</p>
          <Link href="/login" className="text-rose-600 hover:text-rose-700 font-medium">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Matches & Interests</h1>
        <p className="text-gray-600 mb-8">Manage your connections and mutual interests</p>
        <div className="flex space-x-1 bg-white border border-rose-100 rounded-xl p-1 mb-8">
          <button onClick={() => setTab("received")}
            className={`flex-1 py-3 rounded-lg text-sm font-medium transition-colors ${
              tab === "received" ? "bg-rose-500 text-white" : "text-gray-600 hover:bg-rose-50"
            }`}>
            Received ({received.length})
          </button>
          <button onClick={() => setTab("sent")}
            className={`flex-1 py-3 rounded-lg text-sm font-medium transition-colors ${
              tab === "sent" ? "bg-rose-500 text-white" : "text-gray-600 hover:bg-rose-50"
            }`}>
            Sent ({sent.length})
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500" />
          </div>
        ) : tab === "received" ? (
          received.length === 0 ? (
            <EmptyState icon="💝" title="No interests received" desc="When someone sends you interest, it will appear here." />
          ) : (
            <div className="space-y-4">
              {received.map((item) => (
                <div key={item.id} className="bg-white border border-rose-100 rounded-2xl p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center text-2xl overflow-hidden">
                      {item.fromProfile?.photoURL ? (
                        <img src={item.fromProfile.photoURL} alt="" className="w-full h-full object-cover" />
                      ) : (item.fromProfile?.gender === "Male" ? "👨" : "👩")}
                    </div>
                    <div className="flex-1">
                      <Link href={`/profile?id=${item.fromUserId}`} className="text-lg font-semibold text-gray-900 hover:text-rose-600">
                        {item.fromName}
                      </Link>
                      <p className="text-sm text-gray-500">
                        {item.fromProfile?.gotra && `${item.fromProfile.gotra} • `}{item.fromProfile?.currentCity || ""}
                      </p>
                      {item.status === "pending" && (
                        <div className="flex space-x-2 mt-2">
                          <button onClick={() => handleInterest(item.id, "accept")}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors">
                            Accept ✅
                          </button>
                          <button onClick={() => handleInterest(item.id, "reject")}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors">
                            Decline
                          </button>
                        </div>
                      )}
                      {item.status === "accepted" && <span className="text-green-600 font-medium">💑 Match!</span>}
                      {item.status === "rejected" && <span className="text-red-600 font-medium">❌ Declined</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          sent.length === 0 ? (
            <EmptyState icon="💌" title="No interests sent" desc="Browse profiles and send interests to people you like." />
          ) : (
            <div className="space-y-4">
              {sent.map((item) => (
                <div key={item.id} className="bg-white border border-rose-100 rounded-2xl p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center text-2xl overflow-hidden">
                      {item.toProfile?.photoURL ? (
                        <img src={item.toProfile.photoURL} alt="" className="w-full h-full object-cover" />
                      ) : (item.toProfile?.gender === "Male" ? "👨" : "👩")}
                    </div>
                    <div className="flex-1">
                      <Link href={`/profile?id=${item.toUserId}`} className="text-lg font-semibold text-gray-900 hover:text-rose-600">
                        {item.toName}
                      </Link>
                      <p className="text-sm text-gray-500">
                        {item.toProfile?.gotra && `${item.toProfile.gotra} • `}{item.toProfile?.currentCity || ""}
                      </p>
                      <p className={`text-xs mt-1 ${
                        item.status === "accepted" ? "text-green-600" :
                        item.status === "rejected" ? "text-red-600" : "text-amber-600"
                      }`}>
                        {item.status === "accepted" ? "✅ Accepted" :
                         item.status === "rejected" ? "❌ Rejected" : "⏳ Pending"}
                      </p>
                    </div>
                    {item.status === "accepted" && <span className="text-green-600 font-medium">💑 Match!</span>}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

function EmptyState({ icon, title, desc }) {
  return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
      <Link href="/search" className="inline-block mt-6 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-xl transition-colors">
        Browse Profiles
      </Link>
    </div>
  );
}

