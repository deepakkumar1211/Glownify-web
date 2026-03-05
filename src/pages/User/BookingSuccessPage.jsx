import React from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Star } from "lucide-react";

// ─── Booking Success Page ──────────────────────────────────────────────────────
// Matches the mobile mockup exactly:
//   - Pink confetti + sparkles scattered on pink background
//   - 3D gift box illustration with open lid and confetti bursting out
//   - Glowing white checkmark circle floating above
//   - "Booking Request Sent" title + subtitle
//   - View Booking (filled) + Go to Home (outlined) buttons
//   - Salon summary card with photo, name, area, stars, phone
//   - Gradient offer banner at the bottom

const BookingSuccessPage = () => {
    const navigate = useNavigate();

    return (
        <div
            className="min-h-screen flex flex-col items-center bg-pink-50"
            style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
        >
            {/* ── Illustration area ──────────────────────────────── */}
            <div className="relative w-full flex justify-center items-end" style={{ height: 340 }}>

                {/* Scattered confetti / sparkles (CSS positioned) */}
                {/* Pink squiggle top-left */}
                <svg style={{ position: "absolute", top: 18, left: "12%", opacity: 0.85 }} width="38" height="20" viewBox="0 0 38 20"><path d="M2 18 Q10 2 18 10 Q26 18 34 4" stroke="#f9a8d4" strokeWidth="2.5" fill="none" strokeLinecap="round" /></svg>
                {/* Pink squiggle top-right */}
                <svg style={{ position: "absolute", top: 24, right: "10%", opacity: 0.85 }} width="38" height="20" viewBox="0 0 38 20"><path d="M2 4 Q10 18 18 10 Q26 2 34 16" stroke="#f9a8d4" strokeWidth="2.5" fill="none" strokeLinecap="round" /></svg>

                {/* Gold 4-point stars */}
                {[
                    { top: 20, left: "20%" }, { top: 50, right: "16%" },
                    { top: 100, left: "8%" }, { top: 80, right: "8%" },
                ].map((pos, i) => (
                    <svg key={i} style={{ position: "absolute", ...pos }} width="16" height="16" viewBox="0 0 20 20">
                        <path d="M10 0L11.8 7.6L20 10L11.8 12.4L10 20L8.2 12.4L0 10L8.2 7.6Z" fill="#fbbf24" opacity="0.9" />
                    </svg>
                ))}

                {/* Small pink + gold dots scattered */}
                {[
                    { top: 40, left: "28%", color: "#f9a8d4", r: 5 },
                    { top: 70, right: "22%", color: "#fbbf24", r: 4 },
                    { top: 140, left: "6%", color: "#f9a8d4", r: 4 },
                    { top: 160, right: "6%", color: "#fbbf24", r: 5 },
                    { top: 30, left: "46%", color: "#fbbf24", r: 3 },
                ].map((dot, i) => (
                    <div key={i} style={{
                        position: "absolute", width: dot.r * 2, height: dot.r * 2,
                        borderRadius: "50%", backgroundColor: dot.color,
                        top: dot.top, left: dot.left, right: dot.right,
                    }} />
                ))}

                {/* Glowing checkmark circle */}
                <div style={{
                    position: "absolute",
                    top: 28,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 110,
                    height: 110,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, #fff 55%, #fce7f3 80%, transparent 100%)",
                    boxShadow: "0 0 40px 16px rgba(249,168,212,0.45)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10,
                }}>
                    {/* Inner white circle */}
                    <div style={{
                        width: 86, height: 86, borderRadius: "50%",
                        background: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 2px 16px rgba(244,114,182,0.18)",
                    }}>
                        {/* Checkmark SVG */}
                        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                            <path d="M10 22L18 32L34 14" stroke="#f43f5e" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>

                {/* Gift Box SVG — 3D-style open box with confetti burst */}
                <svg
                    viewBox="0 0 260 220"
                    style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 280, zIndex: 5 }}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Confetti bursting from box */}
                    <circle cx="100" cy="85" r="7" fill="#f9a8d4" opacity="0.9" />
                    <circle cx="130" cy="72" r="5" fill="#fbbf24" opacity="0.9" />
                    <circle cx="155" cy="80" r="6" fill="#fb923c" opacity="0.85" />
                    <circle cx="85" cy="100" r="5" fill="#fbbf24" opacity="0.85" />
                    <circle cx="170" cy="70" r="4" fill="#f9a8d4" opacity="0.9" />
                    <circle cx="148" cy="60" r="4" fill="#fb923c" opacity="0.8" />
                    <circle cx="112" cy="58" r="5" fill="#fbbf24" opacity="0.85" />
                    {/* Small squiggles/confetti bits */}
                    <rect x="92" y="78" width="10" height="4" rx="2" fill="#f472b6" transform="rotate(-30 92 78)" opacity="0.85" />
                    <rect x="158" y="90" width="10" height="4" rx="2" fill="#fbbf24" transform="rotate(20 158 90)" opacity="0.85" />
                    <rect x="120" y="65" width="8" height="3" rx="1.5" fill="#fb923c" transform="rotate(-15 120 65)" opacity="0.8" />

                    {/* Box lid (open, tilted) */}
                    <path d="M55 108 L130 95 L205 108 L175 122 L85 122 Z" fill="#f5e6d0" />
                    {/* lid top surface */}
                    <path d="M55 108 Q130 92 205 108 Q130 115 55 108Z" fill="#ede0cb" />

                    {/* Box body */}
                    <rect x="70" y="120" width="120" height="80" rx="6" fill="#f5e6d0" />
                    {/* Box side shading */}
                    <rect x="70" y="120" width="20" height="80" rx="3" fill="#ecddc8" opacity="0.5" />

                    {/* Pink ribbon vertical (on body) */}
                    <rect x="123" y="120" width="14" height="80" fill="#f9a8d4" rx="2" />
                    {/* Pink ribbon horizontal (on lid) */}
                    <path d="M70 128 L190 128 L190 137 L70 137 Z" fill="#f9a8d4" rx="2" />

                    {/* Bow left loop */}
                    <ellipse cx="115" cy="112" rx="22" ry="12" fill="#f472b6" transform="rotate(-20 115 112)" opacity="0.95" />
                    {/* Bow right loop */}
                    <ellipse cx="145" cy="112" rx="22" ry="12" fill="#f472b6" transform="rotate(20 145 112)" opacity="0.95" />
                    {/* Bow center knot */}
                    <circle cx="130" cy="114" r="10" fill="#ec4899" />
                    <circle cx="130" cy="114" r="6" fill="#f9a8d4" />

                    {/* Ground shadow */}
                    <ellipse cx="130" cy="202" rx="65" ry="8" fill="#f9a8d4" opacity="0.18" />
                </svg>
            </div>

            {/* ── Text ── */}
            <div className="text-center px-8 mt-6 max-w-xs">
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                    Booking Request Sent
                </h1>
                <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                    Salon will call you shortly to confirm your appointment.
                </p>
            </div>

            {/* ── CTA Buttons ── */}
            <div className="w-full max-w-sm px-5 mt-8 space-y-3">
                <button
                    onClick={() => navigate("/bookings")}
                    className="w-full py-4 rounded-2xl font-bold text-base text-white active:scale-95 transition-all"
                    style={{ background: "linear-gradient(135deg, #f87171 0%, #f472b6 100%)", boxShadow: "0 6px 20px rgba(244,114,182,0.35)" }}
                >
                    View Booking
                </button>
                <button
                    onClick={() => navigate("/")}
                    className="w-full py-4 rounded-2xl font-bold text-base bg-white border border-pink-200 hover:bg-pink-50 transition-all"
                    style={{ color: "#f472b6" }}
                >
                    Go to Home
                </button>
            </div>

            {/* ── Salon summary card ── */}
            <div className="w-full max-w-sm px-5 mt-5">
                <div className="bg-white rounded-2xl border border-pink-100 shadow-sm px-4 py-3 flex items-center gap-3">
                    {/* Salon photo */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 shadow-sm bg-gray-100">
                        <img
                            src="https://images.unsplash.com/photo-1560066984-138daaa5f58f?w=200&h=200&fit=crop"
                            alt="Salon"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900">Glamour Salon &amp; Spa</p>
                        <p className="text-xs text-gray-400 mt-0.5">Gomti Nagar, Lucknow</p>
                        {/* Star rating */}
                        <div className="flex items-center gap-0.5 mt-1.5">
                            {[1, 2, 3, 4].map((i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            ))}
                            {/* Half star using clip */}
                            <div className="relative w-3.5 h-3.5">
                                <Star className="w-3.5 h-3.5 text-gray-200 fill-gray-200 absolute" />
                                <div className="overflow-hidden absolute" style={{ width: "55%" }}>
                                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                </div>
                            </div>
                            <span className="text-xs text-gray-500 ml-1">4.5</span>
                        </div>
                    </div>

                    {/* Phone call button */}
                    <button className="w-11 h-11 bg-pink-50 rounded-full flex items-center justify-center border border-pink-100 hover:bg-pink-100 transition-colors shrink-0">
                        <Phone className="w-4 h-4 text-rose-400" />
                    </button>
                </div>
            </div>

            {/* ── Offer banner ── */}
            <div className="w-full max-w-sm px-5 mt-3 mb-10">
                <div
                    className="py-3 px-5 text-center text-sm font-bold rounded-2xl"
                    style={{
                        background: "linear-gradient(135deg, #fce7f3 0%, #f9a8d4 40%, #e8a87c 80%, #f5d0a9 100%)",
                        color: "#7c3a3a",
                    }}
                >
                    Spend ₹999 &amp; Get Nail Polish FREE
                </div>
            </div>
        </div>
    );
};

export default BookingSuccessPage;
