import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, MoreVertical, Calendar, MessageCircle, RefreshCw, Receipt, Pencil, Phone } from "lucide-react";

// ─── Colors ────────────────────────────────────────────────────────────────────
const PINK = "#e91e63";
const TEAL = "#14b8a6";

// ─── Default mock booking ─────────────────────────────────────────────────────
const DEFAULT_BOOKING = {
    customerName: "Ayesha",
    service: "Waxing + Facial",
    status: "completed",
    date: "May 13, 2024",
    timeStart: "12:00 PM",
    timeEnd: "1:30 PM",
    duration: "90 mins",
    specialist: { name: "Priya", role: "Assigned Professional", initials: "PR", avatarColor: "#fecdd3" },
    services: [
        { id: 1, name: "Full Arm Waxing", price: 600 },
        { id: 2, name: "Leg Waxing", price: 700 },
        { id: 3, name: "Acne Facial", price: 500 },
    ],
    notes: '"Client preferred organic wax for arms. No allergies reported during facial session. Very satisfied with the glow."',
    initials: "AY",
    avatarColor: "#fecdd3",
};

const STATUS_CONFIG = {
    completed: { label: "COMPLETED", bg: "#e8f5e9", color: "#2e7d32" },
    accepted: { label: "ACCEPTED", bg: "#e8f5e9", color: "#2e7d32" },
    pending: { label: "PENDING", bg: "#fff8e1", color: "#f57f17" },
    cancelled: { label: "CANCELLED", bg: "#fce4ec", color: PINK },
};

// ─── Avatar ───────────────────────────────────────────────────────────────────
const Avatar = ({ initials, color, size = 72 }) => (
    <div className="rounded-full flex items-center justify-center shrink-0 font-bold"
        style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.3, color: "#9f1239" }}>
        {initials}
    </div>
);

// ─── Section label ────────────────────────────────────────────────────────────
const SectionLabel = ({ title, action, onAction }) => (
    <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-bold text-gray-400 tracking-widest">{title}</p>
        {action && (
            <button onClick={onAction} className="flex items-center gap-1">
                <Pencil size={12} color={TEAL} />
                <span className="text-[13px] font-bold" style={{ color: TEAL }}>{action}</span>
            </button>
        )}
    </div>
);

// ─── Card ─────────────────────────────────────────────────────────────────────
const Card = ({ children }) => (
    <div className="mx-4 rounded-3xl p-5 mb-4 bg-white"
        style={{ border: "1px solid #f3f4f6", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
        {children}
    </div>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
const BookingDetailPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Safely merge passed booking with defaults to avoid crashes
    const passedBooking = location.state?.booking || {};
    const booking = {
        ...DEFAULT_BOOKING,
        ...passedBooking,
        specialist: typeof passedBooking.specialist === "string"
            ? { ...DEFAULT_BOOKING.specialist, name: passedBooking.specialist, initials: passedBooking.specialist.slice(0, 2) }
            : (passedBooking.specialist || DEFAULT_BOOKING.specialist),
        services: passedBooking.services || [
            // If they just passed a top-level service and amount from mock list
            { id: 1, name: passedBooking.service || DEFAULT_BOOKING.service, price: passedBooking.amount || 1800 }
        ]
    };

    const [notes] = useState(booking.notes || DEFAULT_BOOKING.notes);

    const statusCfg = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.pending;
    const grandTotal = booking.services.reduce((sum, s) => sum + s.price, 0);

    return (
        <div className="min-h-screen bg-white pb-32 overflow-y-auto">

            {/* ── Top Nav ── */}
            <div className="flex items-center justify-between px-4 py-3 bg-white sticky top-0 z-10"
                style={{ borderBottom: "1px solid #f3f4f6" }}>
                <button onClick={() => navigate(-1)}
                    className="w-9 h-9 flex items-center justify-center bg-transparent">
                    <ChevronLeft size={26} color={PINK} />
                </button>
                <p className="font-bold text-[17px] text-gray-900">Booking Details</p>
                <button className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50">
                    <MoreVertical size={20} color="#1f2937" />
                </button>
            </div>

            {/* ── Customer Hero ── */}
            <div className="px-5 pt-6 pb-5 flex items-center gap-4">
                <div className="relative">
                    <Avatar initials={booking.initials} color={booking.avatarColor} size={72} />
                    {booking.status === "completed" && (
                        <div className="absolute bottom-0.5 right-0.5 w-[22px] h-[22px] rounded-full flex items-center justify-center border-2 border-white"
                            style={{ backgroundColor: TEAL }}>
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <p className="font-extrabold text-[26px] text-gray-900 leading-tight">{booking.customerName}</p>
                    <p className="text-gray-500 text-[14px] mt-0.5">{booking.service}</p>
                </div>
                <div className="rounded-lg px-3 py-1.5" style={{ backgroundColor: statusCfg.bg }}>
                    <span className="text-[11px] font-extrabold tracking-wider" style={{ color: statusCfg.color }}>
                        {statusCfg.label}
                    </span>
                </div>
            </div>

            {/* ── Booking Information ── */}
            <Card>
                <SectionLabel title="BOOKING INFORMATION" />
                {/* Date + time */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#fff1f2" }}>
                        <Calendar size={22} color={PINK} />
                    </div>
                    <div>
                        <p className="font-bold text-[16px] text-gray-900">{booking.date}</p>
                        <p className="text-gray-400 text-[13px] mt-0.5">
                            {booking.timeStart} – {booking.timeEnd} ({booking.duration})
                        </p>
                    </div>
                </div>
                {/* Specialist row */}
                <div className="flex items-center gap-3 rounded-2xl px-4 py-3" style={{ backgroundColor: "#f9fafb" }}>
                    <Avatar initials={booking.specialist.initials} color={booking.specialist.avatarColor} size={44} />
                    <div className="flex-1">
                        <p className="font-semibold text-[14px] text-gray-900">{booking.specialist.name}</p>
                        <p className="text-gray-400 text-[12px] mt-0.5">{booking.specialist.role}</p>
                    </div>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: TEAL }}>
                        <MessageCircle size={16} color="#fff" fill="#fff" />
                    </div>
                </div>
            </Card>

            {/* ── Service Summary ── */}
            <Card>
                <SectionLabel title="SERVICE SUMMARY" />
                {booking.services.map((service, index) => (
                    <div key={service.id}>
                        <div className="flex justify-between items-center py-3">
                            <p className="text-gray-700 text-[15px]">{service.name}</p>
                            <p className="font-semibold text-gray-900 text-[15px]">₹{service.price.toLocaleString("en-IN")}</p>
                        </div>
                        {index < booking.services.length - 1 && (
                            <div style={{ height: 1, backgroundColor: "#f3f4f6" }} />
                        )}
                    </div>
                ))}
                <div style={{ height: 1.5, backgroundColor: "#e5e7eb", marginTop: 8, marginBottom: 12 }} />
                <div className="flex justify-between items-center">
                    <p className="font-bold text-[17px] text-gray-900">Grand Total</p>
                    <p className="font-extrabold text-[22px]" style={{ color: PINK }}>
                        ₹{grandTotal.toLocaleString("en-IN")}
                    </p>
                </div>
            </Card>

            {/* ── Additional Notes ── */}
            <div className="mx-4 mb-4">
                <SectionLabel title="ADDITIONAL NOTES" action="Edit" onAction={() => { }} />
                <div className="rounded-2xl p-4" style={{ backgroundColor: "#e0f7fa", border: "1px solid #b2ebf2" }}>
                    <p className="text-gray-700 text-[14px] leading-relaxed italic">{notes}</p>
                </div>
            </div>

            {/* ── Action Strip ── */}
            <div className="mx-4 mb-5 flex bg-white rounded-3xl overflow-hidden"
                style={{ border: "1px solid #f3f4f6", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                <button className="flex-1 flex flex-col items-center justify-center py-4 gap-2 border-r border-gray-100 transition-colors active:bg-gray-50">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#fff1f2" }}>
                        <Phone size={18} color={PINK} />
                    </div>
                    <span className="text-[12px] font-bold text-gray-700">Call</span>
                </button>
                <button className="flex-1 flex flex-col items-center justify-center py-4 gap-2 border-r border-gray-100 transition-colors active:bg-gray-50">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#e0f2fe" }}>
                        <MessageCircle size={18} color="#0ea5e9" />
                    </div>
                    <span className="text-[12px] font-bold text-gray-700">Message</span>
                </button>
                <button className="flex-1 flex flex-col items-center justify-center py-4 gap-2 transition-colors active:bg-gray-50">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#f3f4f6" }}>
                        <Calendar size={18} color="#6b7280" />
                    </div>
                    <span className="text-[12px] font-bold text-gray-700">Reschedule</span>
                </button>
            </div>

            {/* ── Sticky Bottom CTA ── */}
            <div className="fixed bottom-0 left-0 right-0 bg-white px-4 pb-6 pt-3 flex gap-3"
                style={{ borderTop: "1px solid #f3f4f6", boxShadow: "0 -4px 12px rgba(0,0,0,0.07)" }}>
                <button onClick={() => navigate(-1)}
                    className="flex-none flex items-center justify-center gap-2 px-6 rounded-full py-4 font-bold text-[15px]"
                    style={{ border: `1.5px solid ${PINK}`, color: PINK, backgroundColor: "#fff" }}>
                    <RefreshCw size={17} color={PINK} />Rebook
                </button>
                <button onClick={() => navigate("/salon-owner/create-bill")}
                    className="flex-1 flex items-center justify-center gap-2 rounded-full py-4 font-bold text-[15px] text-white"
                    style={{ backgroundColor: PINK }}>
                    <Receipt size={17} color="#fff" />Create Bill
                </button>
            </div>
        </div>
    );
};

export default BookingDetailPage;
