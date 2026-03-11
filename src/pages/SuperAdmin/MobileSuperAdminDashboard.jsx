import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchDashboardData } from "../../redux/slice/superadminSlice";
import {
    Plus, Users, Store, CreditCard, Calendar, Clock,
    Gift, FileText, Share2, BookOpen, ChevronRight,
    Bell, Check, X, Star
} from "lucide-react";

// ─── Colors ────────────────────────────────────────────────────────────────────
const PINK = "#e91e63";
const BG = "#fce4ec";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_BOOKINGS = [
    { id: 1, customerName: "Amit K.", service: "Hair Color", duration: "1 hr", date: "May 12, 11:00 AM", amount: 2500, status: "pending", avatar: "https://i.pravatar.cc/150?u=amit2" },
    { id: 2, customerName: "Mehak S.", service: "Full Body Massage", duration: "1.5 hr", date: "May 12, 11:00 AM", amount: 2000, status: "pending", avatar: "https://i.pravatar.cc/150?u=mehak" },
    { id: 3, customerName: "Riya", service: "Bridal Makeup", duration: "2 hr", date: "May 12, 11:00 AM", amount: 5000, status: "pending", avatar: "https://i.pravatar.cc/150?u=riya" },
];

const MOCK_REVIEWS = [
    { id: 1, name: "Neha T.", rating: 5, date: "May 11", initials: "NT", avatarColor: "#fecdd3", text: "Amazing experience! The staff was very professional and friendly." },
];

// ─── Avatar ───────────────────────────────────────────────────────────────────
const Avatar = ({ src, initials, color = "#fecdd3", size = 48 }) => {
    const [imgError, setImgError] = useState(false);
    if (src && !imgError) {
        return (
            <img
                src={src}
                alt={initials}
                onError={() => setImgError(true)}
                className="rounded-full shrink-0 object-cover"
                style={{ width: size, height: size }}
            />
        );
    }
    return (
        <div className="rounded-full flex items-center justify-center shrink-0 font-bold"
            style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.33, color: "#9f1239" }}>
            {initials}
        </div>
    );
};

// ─── Booking Card — exact match to dashboard screenshot ────────────────────────
const BookingCard = ({ booking, onAccept, onDecline }) => {
    const isPending = booking.status === "pending";
    const initials = booking.customerName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
    return (
        <div className="bg-white rounded-2xl mb-3 overflow-hidden"
            style={{ boxShadow: "0 2px 12px rgba(244,63,94,0.10)" }}>
            {/* Top row: avatar + name/service + amount */}
            <div className="flex items-start gap-3 p-4 pb-2">
                <Avatar src={booking.avatar} initials={initials} size={52} />
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-[16px] text-gray-900">{booking.customerName}</p>
                    <p className="text-[13px] text-gray-500 mt-0.5">{booking.service} • {booking.duration}</p>
                </div>
                <p className="font-extrabold text-[17px] text-gray-900 shrink-0">
                    ₹ {booking.amount.toLocaleString("en-IN")}
                </p>
            </div>

            {/* Divider */}
            <div className="mx-4" style={{ height: 1, backgroundColor: "#f3f4f6" }} />

            {/* Bottom row: date + action buttons */}
            <div className="flex items-center justify-between px-4 py-3">
                <p className="text-[13px] text-gray-400">{booking.date}</p>
                {isPending ? (
                    <div className="flex gap-2">
                        <button onClick={() => onAccept(booking.id)}
                            className="px-5 py-2 rounded-xl text-white text-[13px] font-bold"
                            style={{ backgroundColor: "#16a34a" }}>Accept</button>
                        <button onClick={() => onDecline(booking.id)}
                            className="px-5 py-2 rounded-xl text-white text-[13px] font-bold"
                            style={{ backgroundColor: PINK }}>Decline</button>
                    </div>
                ) : (
                    <span className="text-[12px] font-bold px-3 py-1 rounded-full"
                        style={booking.status === "accepted"
                            ? { backgroundColor: "#d1fae5", color: "#059669" }
                            : { backgroundColor: "#fff1f2", color: PINK }}>
                        {booking.status}
                    </span>
                )}
            </div>
        </div>
    );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const MobileSuperAdminDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { dashboardData } = useSelector((state) => state.superadmin);
    const { user } = useSelector((state) => state.auth);

    const [bookings, setBookings] = useState(MOCK_BOOKINGS);
    useEffect(() => { dispatch(fetchDashboardData()); }, [dispatch]);

    const handleAccept = (id) => setBookings((p) => p.map((b) => b.id === id ? { ...b, status: "accepted" } : b));
    const handleDecline = (id) => setBookings((p) => p.map((b) => b.id === id ? { ...b, status: "declined" } : b));

    const summary = dashboardData?.summary || {};

    // Stat data — shown as icon + BIG NUMBER + small label (no card bg)
    const STATS = [
        { icon: "📅", label: "Booked Today", value: summary.bookedToday ?? 23 },
        { icon: "⏰", label: "Pending Requests", value: summary.pendingRequests ?? 5 },
        { icon: "👥", label: "Total Customers", value: summary.totalCustomers ?? 863 },
    ];

    // Quick actions — 4 square buttons
    const QUICK_ACTIONS = [
        { icon: Plus, label: "Add Service", iconColor: PINK, bg: "#fce4ec", route: "/super-admin/manage-salons" },
        { icon: Users, label: "Add Staff", iconColor: "#f97316", bg: "#fff3e0", route: "/super-admin/manage-sales-executives" },
        { icon: Gift, label: "Create Offer", iconColor: "#e91e8c", bg: "#fce4ec", route: "/super-admin/manage-subscriptions" },
        { icon: FileText, label: "View Reports", iconColor: "#10b981", bg: "#e8f5e9", route: "/super-admin/dashboard" },
    ];

    const adminInitials = user?.name
        ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
        : "AD";

    return (
        <div className="min-h-screen pb-24 overflow-y-auto" style={{ backgroundColor: BG }}>

            {/* ── Header ── */}
            <div className="flex items-center justify-between px-4 pt-5 pb-3">
                <h1 className="text-[24px] font-extrabold text-gray-900 leading-tight">
                    Hello, {user?.name?.split(" ")[0] || "Admin"} 👋
                </h1>
                {/* Avatar with notification badge */}
                <button onClick={() => navigate("/super-admin/profile")} className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300">
                        <img
                            src="https://i.pravatar.cc/150?u=admin_main"
                            alt="Admin"
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = "none"; }}
                        />
                    </div>
                    <div className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2"
                        style={{ backgroundColor: PINK, borderColor: BG }}>
                        <span className="text-white text-[10px] font-bold">3</span>
                    </div>
                </button>
            </div>

            <div className="px-4 flex flex-col gap-4">

                {/* ── Promo Banner ── exact match: dark, "Create & Share Promotional Posters", Try Now */}
                <div className="rounded-2xl px-5 py-5" style={{ backgroundColor: "#111827", minHeight: 120 }}>
                    <p className="text-white font-bold text-[18px] leading-snug">
                        Create &amp; Share<br />Promotional Posters
                    </p>
                    <button className="mt-3 px-5 py-2 rounded-full text-white text-[13px] font-bold"
                        style={{ backgroundColor: PINK }}>
                        Try Now
                    </button>
                </div>

                {/* ── Stats row — icon + BIG NUMBER + small label, NO card bg ── */}
                <div className="flex items-start justify-between px-1">
                    {STATS.map((stat) => (
                        <div key={stat.label} className="flex flex-col items-center gap-0.5">
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-[16px]">{stat.icon}</span>
                                <p className="font-extrabold text-[24px] text-gray-900 leading-none">{stat.value}</p>
                            </div>
                            <p className="text-[11px] text-gray-500 font-medium text-center mt-0.5">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* ── Quick Actions — 4 equal square buttons in one row ── */}
                <div className="grid grid-cols-4 gap-2.5">
                    {QUICK_ACTIONS.map((action) => {
                        const Icon = action.icon;
                        return (
                            <button key={action.label}
                                onClick={() => action.route && navigate(action.route)}
                                className="flex flex-col items-center justify-center gap-1.5 rounded-2xl py-3.5 transition-all active:scale-95"
                                style={{ backgroundColor: action.bg }}>
                                <Icon size={20} color={action.iconColor} />
                                <p className="text-[10px] font-semibold text-gray-700 text-center leading-tight">{action.label}</p>
                            </button>
                        );
                    })}
                </div>

                {/* ── Recent Bookings ── */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <p className="font-bold text-[18px] text-gray-900">Recent Bookings</p>
                        <button onClick={() => navigate("/salon-owner/bookings")} className="flex items-center gap-0.5">
                            <span className="text-[14px] font-semibold" style={{ color: PINK }}>View All</span>
                            <ChevronRight size={16} color={PINK} />
                        </button>
                    </div>
                    {bookings.map((b) => (
                        <BookingCard key={b.id} booking={b} onAccept={handleAccept} onDecline={handleDecline} />
                    ))}
                </div>

                {/* ── Recent Reviews ── */}
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                        <p className="font-bold text-[18px] text-gray-900">Recent Reviews</p>
                        <button className="flex items-center gap-0.5">
                            <span className="text-[14px] font-semibold" style={{ color: PINK }}>Recent Reviews</span>
                            <ChevronRight size={16} color={PINK} />
                        </button>
                    </div>

                    {MOCK_REVIEWS.map((review) => (
                        <div key={review.id} className="bg-white rounded-2xl p-4"
                            style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
                            <div className="flex items-start gap-3">
                                {/* Avatar */}
                                <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 font-bold text-[14px]"
                                    style={{ backgroundColor: review.avatarColor, color: "#9f1239" }}>
                                    {review.initials}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-[15px] text-gray-900">{review.name}</p>
                                            {/* Stars */}
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <Star key={i} size={11} fill={i <= review.rating ? "#fbbf24" : "none"}
                                                        color={i <= review.rating ? "#fbbf24" : "#d1d5db"} />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-0.5">
                                            <p className="text-[12px] text-gray-400">{review.date}</p>
                                            <ChevronRight size={14} color="#9ca3af" />
                                        </div>
                                    </div>
                                    <p className="text-[13px] text-gray-500 mt-1 leading-relaxed">{review.text}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default MobileSuperAdminDashboard;
