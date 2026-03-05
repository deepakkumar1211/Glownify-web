import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBookings } from "../../redux/slice/userSlice";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Scissors,
  ArrowLeft,
  Heart,
  Phone,
  Star,
  MessageCircle,
  ChevronDown,
  Gift,
  XCircle,
  Filter,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

// Service image mapping
const SERVICE_IMAGES = {
  hair: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=200&h=200&fit=crop&crop=face",
  facial: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=200&h=200&fit=crop&crop=face",
  wax: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=200&h=200&fit=crop&crop=face",
  makeup: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=200&h=200&fit=crop&crop=face",
  nail: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=200&h=200&fit=crop&crop=face",
  spa: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=200&h=200&fit=crop&crop=face",
};

const getServiceImage = (name) => {
  const lower = name?.toLowerCase() || "";
  for (const [key, url] of Object.entries(SERVICE_IMAGES)) {
    if (lower.includes(key)) return url;
  }
  return SERVICE_IMAGES.hair;
};

const formatDuration = (mins) => {
  if (!mins) return "";
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h} hr ${m} min` : `${h} hr`;
};

const MyBookingsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bookings, loading } = useSelector((state) => state.user);
  const [isFavorited, setIsFavorited] = useState(false);

  const [activeTab, setActiveTab] = useState("all");
  const [expandedBooking, setExpandedBooking] = useState(null);

  useEffect(() => {
    dispatch(fetchUserBookings());
  }, [dispatch]);

  // Filter logic
  const filteredBookings = useMemo(() => {
    if (!bookings) return [];
    if (activeTab === "all") return bookings;
    return bookings.filter(
      (b) => b.status?.toLowerCase() === activeTab.toLowerCase()
    );
  }, [bookings, activeTab]);

  // Expand first booking by default
  useEffect(() => {
    if (filteredBookings.length > 0 && expandedBooking === null) {
      setExpandedBooking(filteredBookings[0]._id);
    }
  }, [filteredBookings, expandedBooking]);

  const tabs = [
    { id: "all", label: "All" },
    { id: "pending", label: "Upcoming" },
    { id: "completed", label: "Completed" },
    { id: "cancelled", label: "Cancelled" },
  ];

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "pending":
        return "bg-amber-50 text-amber-600 border-amber-200";
      case "cancelled":
        return "bg-rose-50 text-rose-500 border-rose-200";
      default:
        return "bg-gray-50 text-gray-500 border-gray-200";
    }
  };

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-pink-50/60">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
          <Sparkles className="w-6 h-6 text-pink-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="mt-4 text-gray-500 font-medium animate-pulse">
          Fetching your appointments...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-pink-50/60">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-pink-50/90 backdrop-blur-lg">
        <div className="flex items-center justify-between px-5 md:px-10 py-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-pink-100 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Booking Details
          </h1>
          <button
            onClick={() => setIsFavorited(!isFavorited)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-pink-100 transition-colors"
          >
            <Heart
              className={`w-6 h-6 transition-colors ${isFavorited
                ? "text-rose-500 fill-rose-500"
                : "text-rose-400 fill-rose-400"
                }`}
            />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-5 md:px-10 pt-2 pb-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setExpandedBooking(null);
              }}
              className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 border ${activeTab === tab.id
                ? "bg-gradient-to-r from-rose-400 to-pink-400 text-white border-transparent shadow-md shadow-pink-200/50"
                : "bg-white text-gray-600 border-pink-200 hover:border-pink-300"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings */}
      <div className="px-4 md:px-10 pb-8 space-y-4 max-w-4xl mx-auto">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => {
            const isExpanded = expandedBooking === booking._id;

            return (
              <div
                key={booking._id}
                className="bg-white/90 backdrop-blur-sm rounded-2xl border border-pink-100/60 shadow-sm overflow-hidden transition-all duration-300"
              >
                {/* Booking Header */}
                <button
                  onClick={() =>
                    setExpandedBooking(isExpanded ? null : booking._id)
                  }
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-pink-50/50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-rose-50 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-rose-500" />
                    </div>
                    <span className="text-base font-bold text-gray-900">
                      Booking Details
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize border ${getStatusStyle(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? "" : "-rotate-90"
                      }`}
                  />
                </button>

                {isExpanded && (
                  <div className="border-t border-pink-50">
                    {/* Salon Info */}
                    <div className="px-5 py-4 border-b border-pink-50">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center">
                          <Scissors className="w-6 h-6 text-rose-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-bold text-gray-900">
                            {booking.providerId?.shopName}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5 flex-wrap">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {booking.providerId?.location?.address || "Salon Location"}
                              {booking.providerId?.location?.city
                                ? `, ${booking.providerId.location.city}`
                                : ""}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" /> +91 9876543210
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Date/Time & Distance */}
                      <div className="flex items-center justify-between mt-3 bg-pink-50/60 rounded-xl px-4 py-2.5">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Calendar className="w-4 h-4 text-rose-400" />
                          <span className="font-medium">
                            {new Date(booking.bookingDate).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                              }
                            )}{" "}
                            | {booking.timeSlot?.start || "10:00 AM"}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 font-medium">
                          2.3 km away
                        </span>
                      </div>
                    </div>

                    {/* Your Services */}
                    <div className="px-5 py-4">
                      <h4 className="text-base font-bold text-gray-900 mb-3">
                        Your Services
                      </h4>
                      <div className="space-y-3 bg-pink-50/40 rounded-xl p-3">
                        {booking.serviceItems.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3"
                          >
                            <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-sm">
                              <img
                                src={getServiceImage(item.service?.name)}
                                alt={item.service?.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-900">
                                {item.service?.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                {formatDuration(item.service?.durationMins) || "45 min"}
                              </p>
                            </div>
                            <p className="text-base font-bold text-gray-900 shrink-0">
                              ₹ {item.service?.price}
                            </p>
                          </div>
                        ))}

                        {/* Free item (if total meets threshold) */}
                        {booking.totalAmount >= 798 && (
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                              <Gift className="w-6 h-6 text-amber-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-900">
                                🎁 Nail Polish
                              </p>
                            </div>
                            <p className="text-base font-bold text-green-500 shrink-0">
                              FREE
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Cancel Booking */}
                    {booking.status?.toLowerCase() === "pending" && (
                      <div className="px-5 pb-4 space-y-2">
                        <button className="w-full py-3 rounded-xl text-rose-500 font-bold text-sm bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors">
                          Cancel Booking
                        </button>
                        <p className="text-xs text-gray-400 text-center">
                          For any changes, please call the salon directly.
                        </p>
                      </div>
                    )}

                    {/* Assigned Beautician */}
                    <div className="px-5 py-4 border-t border-pink-50">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-sm">
                          <img
                            src="https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=200&h=200&fit=crop&crop=face"
                            alt="Beautician"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-400 font-medium">
                            Assigned Beautician
                          </p>
                          <p className="text-base font-bold text-gray-900">
                            Simran Jha
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <div className="flex items-center gap-0.5">
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                              <Star className="w-3 h-3 text-gray-200 fill-gray-200" />
                            </div>
                            <span className="text-xs text-gray-400">
                              $5 ratings
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">
                            Beautician | 5+ Yrs Exp ✅
                          </p>
                        </div>
                        <button className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center hover:bg-rose-100 transition-colors shrink-0">
                          <MessageCircle className="w-5 h-5 text-rose-500" />
                        </button>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="px-5 py-3 bg-pink-50/50 border-t border-pink-100/60 flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">
                        Total Amount
                      </span>
                      <span className="text-lg font-black text-rose-500">
                        ₹{booking.totalAmount}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-white/90 rounded-2xl border border-pink-100 p-12 text-center">
            <div className="bg-pink-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="text-pink-300" size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">
              No {activeTab === "all" ? "" : activeTab} bookings
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Try changing your filter or book a new service.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;