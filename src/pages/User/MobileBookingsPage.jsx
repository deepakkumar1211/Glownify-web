import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBookings } from "../../redux/slice/userSlice";

/**
 * MobileBookingsPage — mobile-only My Bookings page.
 * Teal header, Upcoming / Past toggle, empty state with calendar icon.
 * Route: /bookings  (linked from BottomTabNav)
 */
const MobileBookingsPage = () => {
    const dispatch = useDispatch();
    const { bookings = [], loading } = useSelector((state) => state.user);
    const [activeTab, setActiveTab] = useState("upcoming");

    useEffect(() => { dispatch(fetchUserBookings()); }, [dispatch]);

    const upcoming = useMemo(() =>
        bookings.filter((b) => b.status?.toLowerCase() === "pending"), [bookings]);
    const past = useMemo(() =>
        bookings.filter((b) => ["completed", "cancelled"].includes(b.status?.toLowerCase())), [bookings]);

    const list = activeTab === "upcoming" ? upcoming : past;

    return (
        <div className="mobile-page">
            {/* Teal header */}
            <div className="mobile-header">
                <h1 className="mobile-header-title">My Bookings</h1>
            </div>

            {/* Upcoming / Past toggle */}
            <div className="toggle-pill-wrapper mx-4 mt-4">
                {["upcoming", "past"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className="flex-1 py-2.5 text-[13px] font-bold capitalize transition-all"
                        style={
                            activeTab === tab
                                ? { backgroundColor: "#fff", color: "#111", borderRadius: "9999px", boxShadow: "0 1px 4px rgba(0,0,0,0.10)" }
                                : { color: "#9ca3af", backgroundColor: "transparent" }
                        }
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="mt-4 px-4">
                {loading ? (
                    /* Skeleton */
                    <div className="space-y-3 mt-6">
                        {[1, 2].map((i) => (
                            <div key={i} className="bg-white rounded-2xl h-24 animate-pulse" />
                        ))}
                    </div>
                ) : list.length > 0 ? (
                    /* Booking cards */
                    <div className="space-y-3">
                        {list.map((booking) => (
                            <div key={booking._id} className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
                                <div className="flex items-center justify-between">
                                    <p className="font-bold text-[14px] text-gray-900">{booking.providerId?.shopName || "Salon"}</p>
                                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full capitalize ${booking.status === "pending" ? "bg-yellow-50 text-yellow-600" :
                                        booking.status === "completed" ? "bg-green-50 text-green-600" :
                                            "bg-red-50 text-red-500"
                                        }`}>
                                        {booking.status}
                                    </span>
                                </div>
                                <p className="text-[12px] text-gray-400 mt-1">
                                    {new Date(booking.bookingDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                    {booking.timeSlot?.start ? ` • ${booking.timeSlot.start}` : ""}
                                </p>
                                <p className="text-[12px] text-gray-500 mt-0.5">
                                    {booking.serviceItems?.length || 0} service(s) • ₹{booking.totalAmount}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty state */
                    <div className="flex flex-col items-center justify-center mt-24 gap-3">
                        <div className="text-gray-300">
                            {/* Calendar icon SVG */}
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                                <rect x="7" y="14" width="3" height="3" rx="0.5" />
                                <rect x="11" y="14" width="3" height="3" rx="0.5" />
                                <rect x="15" y="14" width="3" height="3" rx="0.5" />
                            </svg>
                        </div>
                        <p className="text-gray-400 text-[14px] font-medium">
                            {activeTab === "upcoming" ? "No upcoming bookings" : "No past bookings"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MobileBookingsPage;
