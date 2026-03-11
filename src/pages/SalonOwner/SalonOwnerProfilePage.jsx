import React from 'react';
import { useSelector } from 'react-redux';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Users,
  Award,
  Calendar,
  ShieldCheck,
  Info,
  Store,
  ExternalLink,
  Smartphone
} from 'lucide-react';
import MobileSalonProfileScreen from './Mobile/MobileSalonProfileScreen';
import { useState, useEffect } from 'react';

const SalonOwnerProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return <MobileSalonProfileScreen />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-slate-500 font-medium animate-pulse">Loading Business Profile...</p>
      </div>
    );
  }

  const { roleDetails: shop } = user;

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Top Hero Section: Shop Identity */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-20 -mt-20 z-0"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="h-32 w-32 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-200">
              <Store size={48} strokeWidth={1.5} />
            </div>

            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                  {shop?.shopName || "My Salon"}
                </h1>
                <span className="px-4 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-emerald-200 w-fit mx-auto md:mx-0">
                  {user.status}
                </span>
              </div>

              <p className="text-slate-500 max-w-xl text-sm leading-relaxed">
                {shop?.about || "No business description provided yet."}
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-5 text-slate-400 text-xs font-bold uppercase tracking-widest">
                <span className="flex items-center gap-2">
                  <Award size={14} className="text-indigo-500" /> Reg: {shop?.registrationNumber}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar size={14} className="text-indigo-500" /> Since {new Date(shop?.openingDate).getFullYear()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column: Personal Owner Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Info size={14} /> Owner Profile
              </h3>
              <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 font-bold border border-slate-200 shadow-sm">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">{user.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Verified Salon Admin</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-500"><Mail size={16} /></div>
                  <span className="text-xs font-bold text-slate-700 truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-500"><Phone size={16} /></div>
                  <span className="text-xs font-bold text-slate-700">{user.phone}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Column */}
            <div className="bg-indigo-600 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-100">
              <div className="flex justify-between items-center mb-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Capacity</p>
                <Users size={20} className="text-indigo-300" />
              </div>
              <div className="flex items-baseline gap-2">
                <h4 className="text-4xl font-black">{shop?.numberOfStaff || 0}</h4>
                <p className="text-indigo-200 font-bold text-sm">Active Staff Members</p>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Business Info */}
          <div className="lg:col-span-2 space-y-6">

            {/* Grid for Operational Hours & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Opening Hours</h3>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3 text-slate-700">
                    <Clock size={18} className="text-indigo-500" />
                    <span className="text-sm font-bold uppercase">{shop?.openingHours?.open} — {shop?.openingHours?.close}</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Contact Sync</h3>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <Smartphone size={18} className="text-emerald-500" />
                  <span className="text-sm font-bold text-slate-700">WhatsApp: {shop?.whatsappNumber}</span>
                </div>
              </div>
            </div>

            {/* Address & Location Card */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Business Location</h3>
                <button className="text-indigo-600 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:underline">
                  <MapPin size={14} /> Open in Maps <ExternalLink size={12} />
                </button>
              </div>
              <div className="space-y-2">
                <p className="text-xl font-bold text-slate-900">{shop?.location?.address}</p>
                <p className="text-slate-500 font-medium">
                  {shop?.location?.city}, {shop?.location?.state} - {shop?.location?.pincode}
                </p>
              </div>
            </div>

            {/* Internal Metadata */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-8 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Administrative Data</h3>
                <ShieldCheck size={16} className="text-emerald-500" />
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Shop Type</p>
                  <p className="text-sm font-bold text-slate-700 capitalize">{shop?.shopType}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Verification ID</p>
                  <code className="text-[11px] text-indigo-600 bg-indigo-50 px-2 py-1 rounded select-all">{shop?._id}</code>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Staff Slots</p>
                  <p className="text-sm font-bold text-slate-700 italic">8 Assigned</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Database Sync</p>
                  <p className="text-sm font-bold text-slate-700">{new Date(user.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em] py-8">
          Glamour Connect &bull; Business Dashboard v1.0
        </p>
      </div>
    </div>
  );
};

export default SalonOwnerProfilePage;