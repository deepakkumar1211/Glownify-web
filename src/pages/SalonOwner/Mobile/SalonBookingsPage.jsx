import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, SlidersHorizontal, Calendar, User } from "lucide-react";

// ─── Colors ────────────────────────────────────────────────────────────────────
const PINK = "#e91e63";
const TEAL = "#14b8a6";
const BG = "#fce4ec";

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const MOCK_BOOKINGS = [
    { id: 1, customerName: "Rahul P.", service: "BRIDAL MAKEUP", tier: "PREMIUM SERVICE", specialist: "Pooja S.", date: "May 13, 1:00 PM", status: "pending", amount: 5000, initials: "RP", avatarColor: "#9e9e9e" },
    { id: 2, customerName: "Priya K.", service: "HAIR STYLING", tier: "REGULAR", specialist: "Pooja S.", date: "May 14, 10:30 AM", status: "pending", amount: 1200, initials: "PK", avatarColor: "#fecdd3" },
    { id: 3, customerName: "Amit R.", service: "GROOM STYLING", tier: "PREMIUM", specialist: "Ravi M.", date: "May 13, 3:00 PM", status: "pending", amount: 3500, initials: "AR", avatarColor: "#9e9e9e" },
    { id: 4, customerName: "Anjali V.", service: "SPA TREATMENT", tier: "REGULAR", specialist: "Priya", date: "May 16, 11:00 AM", status: "accepted", amount: 2200, initials: "AV", avatarColor: "#fef3c7" },
    { id: 5, customerName: "Vikram S.", service: "BEARD TRIM", tier: "REGULAR", specialist: "Arjun", date: "May 10, 3:00 PM", status: "completed", amount: 800, initials: "VS", avatarColor: "#dbeafe" },
];

const STATUS_TABS = ["All", "Ongoing", "Completed", "Cancelled"];

const getStatusFilter = (tab) => {
    switch (tab) {
        case "Ongoing": return ["accepted"];
        case "Completed": return ["completed"];
        case "Cancelled": return ["declined"];
        default: return ["pending", "accepted", "completed", "declined"];
    }
};

// ─── Avatar ───────────────────────────────────────────────────────────────────
const Avatar = ({ initials, color, size = 52 }) => (
    <div className="rounded-full flex items-center justify-center shrink-0 font-bold"
        style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.3, color: "#fff" }}>
        {initials}
    </div>
);

// ─── Booking Card — exact match to screenshot ─────────────────────────────────
const BookingCard = ({ booking, onAccept, onDecline, onPress }) => {
    const isPending = booking.status === "pending";

    const statusCfg = {
        accepted: { bg: "#f0fdf4", color: "#10b981", label: "Accepted" },
        completed: { bg: "#eff6ff", color: "#3b82f6", label: "Completed" },
        declined: { bg: "#fff1f2", color: PINK, label: "Declined" },
    }[booking.status];

    return (
        <div
            onClick={onPress}
            className="bg-white rounded-2xl mb-3 overflow-hidden cursor-pointer"
            style={{ boxShadow: "0 2px 12px rgba(244,63,94,0.10)", border: "1px solid #fce7f3" }}
        >
            {/* ── Top section ── */}
            <div className="px-4 pt-4 pb-3">
                {/* Row 1: Avatar + Name + Service + Amount */}
                <div className="flex items-start gap-3">
                    <Avatar initials={booking.initials} color={booking.avatarColor} size={52} />
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-[16px] text-gray-900 leading-tight">{booking.customerName}</p>
                        <p className="text-[13px] font-bold mt-0.5" style={{ color: TEAL }}>{booking.service}</p>
                    </div>
                    <div className="text-right shrink-0">
                        <p className="font-extrabold text-[16px] text-gray-900">₹{booking.amount.toLocaleString("en-IN")}</p>
                        <p className="text-[10px] font-semibold text-gray-400 mt-0.5">{booking.tier}</p>
                    </div>
                </div>

                {/* Row 2: Date & Time + Provider */}
                <div className="grid grid-cols-2 gap-2 mt-3">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Date &amp; Time</p>
                        <div className="flex items-center gap-1.5">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#fff1f2" }}>
                                <Calendar size={14} color={PINK} />
                            </div>
                            <p className="text-[12px] font-semibold text-gray-700">{booking.date}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Provider</p>
                        <div className="flex items-center gap-1.5">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-gray-100">
                                <User size={14} color="#9ca3af" />
                            </div>
                            <p className="text-[12px] font-semibold text-gray-700">{booking.specialist}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Divider + Actions ── */}
            {isPending ? (
                <div className="flex gap-3 px-4 pb-4">
                    {/* Decline — outlined */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onDecline(booking.id); }}
                        className="flex-1 py-3 rounded-full font-bold text-[14px] border-2 transition-all"
                        style={{ borderColor: PINK, color: PINK, backgroundColor: "#fff" }}
                    >
                        Decline
                    </button>
                    {/* Accept Request — filled teal */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onAccept(booking.id); }}
                        className="flex-[2] py-3 rounded-full font-bold text-[14px] text-white transition-all"
                        style={{ backgroundColor: TEAL }}
                    >
                        Accept Request
                    </button>
                </div>
            ) : (
                <div className="px-4 pb-4">
                    <span className="inline-flex text-[12px] font-bold px-3 py-1.5 rounded-full"
                        style={{ backgroundColor: statusCfg?.bg, color: statusCfg?.color }}>
                        {statusCfg?.label ?? booking.status}
                    </span>
                </div>
            )}
        </div>
    );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const SalonBookingsPage = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState(MOCK_BOOKINGS);
    const [activeTab, setActiveTab] = useState("All");

    const pendingCount = bookings.filter((b) => b.status === "pending").length;
    const filtered = bookings.filter((b) => getStatusFilter(activeTab).includes(b.status));

    const handleAccept = (id) => setBookings((p) => p.map((b) => b.id === id ? { ...b, status: "accepted" } : b));
    const handleDecline = (id) => setBookings((p) => p.map((b) => b.id === id ? { ...b, status: "declined" } : b));

    return (
        <div className="min-h-screen pb-28" style={{ backgroundColor: BG }}>

            {/* ── Header ── */}
            <div className="flex items-center justify-between px-4 pt-5 pb-3">
                <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center">
                    <ChevronLeft size={26} color={PINK} />
                </button>
                <p className="font-bold text-[17px] text-gray-900">New Booking Requests</p>
                {/* Avatar + badge */}
                <div className="relative">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[13px]"
                        style={{ backgroundColor: "#fecdd3", color: "#9f1239" }}>GS</div>
                    <div className="absolute -top-0.5 -right-0.5 w-[17px] h-[17px] rounded-full flex items-center justify-center border-2"
                        style={{ backgroundColor: PINK, borderColor: BG }}>
                        <span className="text-white text-[9px] font-bold">3</span>
                    </div>
                </div>
            </div>

            {/* ── Pending Count Card ── */}
            <div className="mx-4 mb-4 rounded-2xl px-5 py-4 flex items-center justify-between"
                style={{ backgroundColor: "#fce4ec" }}>
                <div>
                    <p className="text-[12px] font-semibold" style={{ color: PINK }}>Current Status</p>
                    <p className="font-extrabold text-[28px] leading-tight text-gray-900">
                        {pendingCount} Pending<br />Requests
                    </p>
                </div>
                <button className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 font-semibold text-[14px] text-gray-700"
                    style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                    <SlidersHorizontal size={15} color="#374151" />Filter
                </button>
            </div>

            {/* ── Status Tabs — underline style ── */}
            <div className="flex px-4 mb-4" style={{ borderBottom: "1px solid #e5e7eb" }}>
                {STATUS_TABS.map((tab) => {
                    const active = activeTab === tab;
                    return (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className="mr-5 pb-2 text-[14px] font-semibold transition-all"
                            style={active
                                ? { color: PINK, borderBottom: `2px solid ${PINK}` }
                                : { color: "#9ca3af", borderBottom: "2px solid transparent" }}>
                            {tab}
                        </button>
                    );
                })}
            </div>

            {/* ── Booking List ── */}
            <div className="px-4">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center mt-20 gap-3">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: "#fce7f3" }}>
                            <Calendar size={28} color="#f48fb1" />
                        </div>
                        <p className="font-bold text-[16px] text-gray-700">No bookings here</p>
                        <p className="text-[13px] text-gray-400">Nothing in "{activeTab}" yet</p>
                    </div>
                ) : (
                    filtered.map((booking) => (
                        <BookingCard
                            key={booking.id}
                            booking={booking}
                            onAccept={handleAccept}
                            onDecline={handleDecline}
                            onPress={() => navigate("/salon-owner/booking-detail", { state: { booking } })}
                        />
                    ))
                )}
            </div>

        </div>
    );
};

export default SalonBookingsPage;
