"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { GOTRAS, CITIES, SINDHI_CITIES, EDUCATION, OCCUPATIONS } from "@/lib/constants";

export default function EditProfilePage() {
  const { user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [photoURL, setPhotoURL] = useState("");
  const [form, setForm] = useState({
    gender: "", dateOfBirth: "", height: "", maritalStatus: "Never Married",
    gotra: "", motherTongue: "Hindi", nativeSindhiCity: "", currentCity: "",
    education: "", occupation: "", annualIncome: "", familyBackground: "",
    aboutMe: "", partnerAgeMin: "", partnerAgeMax: "", partnerEducation: "",
    partnerOccupation: "", partnerGotra: "", partnerCity: "", visible: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    setMessage({ type: "", text: "" });
    try {
      const storageRef = ref(storage, `profile-photos/${user.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setPhotoURL(url);
      setMessage({ type: "success", text: "Photo uploaded! 📸" });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Photo upload failed. Please try again." });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      await setDoc(doc(db, "profiles", user.uid), {
        ...form, photoURL, profileComplete: true, updatedAt: new Date().toISOString(),
      }, { merge: true });
      await refreshProfile();
      setMessage({ type: "success", text: "Profile saved successfully! ✅" });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to save profile. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
        {message.text && (
          <div className={`px-4 py-3 rounded-lg text-sm ${
            message.type === "error" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
          }`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Photo upload */}
          <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Photo</h2>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 rounded-full bg-rose-100 flex items-center justify-center text-4xl overflow-hidden">
                {photoURL ? (
                  <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span>{form.gender === "Male" ? "👨" : "👩"}</span>
                )}
              </div>
              <label className="px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-700 text-sm font-medium rounded-lg cursor-pointer">
                {uploading ? "Uploading..." : "Upload Photo"}
                <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
              </label>
            </div>
          </div>

          {/* Personal details */}
          <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange} required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500">
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                <input type="number" name="height" value={form.height} onChange={handleChange} placeholder="165"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                <select name="maritalStatus" value={form.maritalStatus} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500">
                  <option>Never Married</option>
                  <option>Divorced</option>
                  <option>Widowed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gotra</label>
                <select name="gotra" value={form.gotra} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500">
                  <option value="">Select</option>
                  {GOTRAS.sort().map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mother Tongue</label>
                <input type="text" name="motherTongue" value={form.motherTongue} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Native City (Sindh)</label>
                <select name="nativeSindhiCity" value={form.nativeSindhiCity} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500">
                  <option value="">Select</option>
                  {SINDHI_CITIES.sort().map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current City</label>
                <select name="currentCity" value={form.currentCity} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500">
                  <option value="">Select</option>
                  {CITIES.sort().map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                <select name="education" value={form.education} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500">
                  <option value="">Select</option>
                  {EDUCATION.sort().map((e) => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                <select name="occupation" value={form.occupation} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500">
                  <option value="">Select</option>
                  {OCCUPATIONS.sort().map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Annual Income</label>
                <input type="text" name="annualIncome" value={form.annualIncome} onChange={handleChange} placeholder="₹ 5,00,000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500" />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">About Me</label>
              <textarea name="aboutMe" value={form.aboutMe} onChange={handleChange} rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="Tell us about yourself..." />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Family Background</label>
              <textarea name="familyBackground" value={form.familyBackground} onChange={handleChange} rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="About your family..." />
            </div>
          </div>


          {/* Partner preferences */}
          <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Partner Preferences</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age From</label>
                <input type="number" name="partnerAgeMin" value={form.partnerAgeMin} onChange={handleChange} placeholder="21"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age To</label>
                <input type="number" name="partnerAgeMax" value={form.partnerAgeMax} onChange={handleChange} placeholder="30"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Education</label>
                <select name="partnerEducation" value={form.partnerEducation} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500">
                  <option value="">Any</option>
                  {EDUCATION.sort().map((e) => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Gotra</label>
                <select name="partnerGotra" value={form.partnerGotra} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500">
                  <option value="">Any</option>
                  {GOTRAS.sort().map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred City</label>
                <select name="partnerCity" value={form.partnerCity} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500">
                  <option value="">Any</option>
                  {CITIES.sort().map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h2>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" name="visible" checked={form.visible} onChange={handleChange}
                className="w-5 h-5 text-rose-500 border-gray-300 rounded focus:ring-rose-500" />
              <div>
                <span className="text-gray-900 font-medium">Show my profile in search results</span>
                <p className="text-sm text-gray-500">Uncheck to hide your profile from others</p>
              </div>
            </label>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={loading}
              className="px-8 py-3 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-semibold rounded-xl transition-colors text-lg">
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

