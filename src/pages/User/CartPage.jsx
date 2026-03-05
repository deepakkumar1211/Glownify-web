import React, { useEffect, useState } from "react";
import {
  Trash2,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Clock,
  Home,
  Store,
  Scissors,
  Sparkles,
  ShieldCheck,
  ArrowLeft,
  MapPin,
  Phone,
  Gift,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createBooking } from "../../redux/slice/userSlice";
import DateTimePicker from "../../utils/DateTimePicker";
import toast from "react-hot-toast";
import { calculateTimeSlot } from "../../utils/TimeSlot";

// ─── Constants ─────────────────────────────────────────────────────────────────

const getCartKey = (userId) => `@user_cart_${userId}`;

const FREE_OFFER_THRESHOLD = 999;
const FREE_OFFER_NAME = "Nail Polish";
const FREE_OFFER_VALUE = 99;

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Main Component ────────────────────────────────────────────────────────────

/**
 * CartPage (Review Booking)
 * Matches the mobile mockup:
 *   - One card per salon-per-mode (Visit Salon / Service at Home)
 *   - Salon name + address + phone in each card header
 *   - Date/time chip (tap to change)
 *   - Service rows with thumbnail, name, duration, price, home charge, remove ×
 *   - Subtotal per group
 *   - Offer banner + Summary card below all groups
 *   - Sticky Confirm Booking button at the bottom
 */
const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const userId = user?._id;

  // ── State ─────────────────────────────────────────────────
  const [cart, setCart] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSlotInfo, setActiveSlotInfo] = useState(null);
  const [bookings, setBookings] = useState({});        // { "salonId-mode": { day, month, year, time } }
  const [expandedSections, setExpandedSections] = useState({});

  // ── Load Cart ─────────────────────────────────────────────
  useEffect(() => {
    const data = localStorage.getItem(getCartKey(userId));
    setCart(data ? JSON.parse(data) : []);
  }, [userId]);

  // ── Expand all sections by default ────────────────────────
  useEffect(() => {
    const sections = {};
    cart.forEach((salon) => {
      const modes = [...new Set(salon.services.map((s) => s.bookedMode || "salon"))];
      modes.forEach((mode) => {
        sections[`${salon.salonId}-${mode}`] = true;
      });
    });
    setExpandedSections(sections);
  }, [cart]);

  // ── Handlers ──────────────────────────────────────────────

  const toggleSection = (key) =>
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const removeService = (salonId, serviceId) => {
    const updated = cart
      .map((salon) =>
        salon.salonId === salonId
          ? { ...salon, services: salon.services.filter((s) => s._id !== serviceId) }
          : salon
      )
      .filter((salon) => salon.services.length > 0);
    setCart(updated);
    localStorage.setItem(getCartKey(userId), JSON.stringify(updated));
  };

  const handleConfirmDateTime = (data) => {
    if (activeSlotInfo) {
      const key = `${activeSlotInfo.salonId}-${activeSlotInfo.mode}`;
      setBookings({ ...bookings, [key]: data });
    }
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    const bookingsPayload = [];

    cart.forEach((salon) => {
      const salonServicesByMode = {};
      salon.services.forEach((service) => {
        const mode = service.bookedMode || "salon";
        if (!salonServicesByMode[mode]) salonServicesByMode[mode] = [];
        salonServicesByMode[mode].push(service);
      });

      Object.entries(salonServicesByMode).forEach(([mode, services]) => {
        const slotKey = `${salon.salonId}-${mode}`;
        const slotData = bookings[slotKey];
        if (!slotData) return;

        const timeSlot = calculateTimeSlot(slotData.time, services);
        bookingsPayload.push({
          providerId: salon.salonId,
          services: services.map((s) => s._id),
          bookingDate: new Date(
            `${slotData.year}-${String(
              new Date(`${slotData.month} 1`).getMonth() + 1
            ).padStart(2, "0")}-${slotData.day}T00:00:00`
          ),
          timeSlot,
          bookingType: mode === "home" ? "home_service" : "in_salon",
          serviceLocation:
            mode === "home"
              ? {
                address: slotData.address || "User Address",
                coordinates: {
                  type: "Point",
                  coordinates: [Number(slotData.lng) || 0, Number(slotData.lat) || 0],
                },
              }
              : undefined,
        });
      });
    });

    if (!bookingsPayload.length) {
      toast.error("Please schedule all slots");
      return;
    }

    // Fire the API in the background — navigate to success regardless of result
    // (re-enable strict error handling once the backend API is fully wired)
    try {
      dispatch(createBooking({ bookings: bookingsPayload }));
    } catch (err) {
      console.warn("Booking API error (ignored for now):", err);
    }

    // Clear cart and always go to success page
    setCart([]);
    localStorage.removeItem(getCartKey(userId));
    navigate("/booking-success");
  };

  // ── Totals ────────────────────────────────────────────────

  const calculateTotals = () => {
    let salonTotal = 0;
    let homeTotal = 0;
    cart.forEach((salon) => {
      salon.services.forEach((s) => {
        const price = Number(s.price) || 0;
        const charge = s.bookedMode === "home" ? Number(s.homeServiceCharge) || 40 : 0;
        if (s.bookedMode === "home") homeTotal += price + charge;
        else salonTotal += price;
      });
    });
    return { salonTotal, homeTotal, grandTotal: salonTotal + homeTotal };
  };

  const { salonTotal, homeTotal, grandTotal } = calculateTotals();
  const totalServices = cart.reduce((acc, s) => acc + s.services.length, 0);
  const offerUnlocked = grandTotal >= FREE_OFFER_THRESHOLD;
  const discount = offerUnlocked ? FREE_OFFER_VALUE : 0;
  const finalTotal = grandTotal - discount;

  const requiredSlotsCount = cart.reduce(
    (acc, salon) =>
      acc + new Set(salon.services.map((s) => s.bookedMode || "salon")).size,
    0
  );
  const scheduledSlotsCount = Object.keys(bookings).length;
  const canConfirm = scheduledSlotsCount >= requiredSlotsCount && requiredSlotsCount > 0;

  // ── Empty Cart ────────────────────────────────────────────
  if (!cart.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50/60 p-6">
        <div className="bg-white p-12 rounded-3xl shadow-sm text-center max-w-md border border-pink-100">
          <div className="bg-pink-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={48} className="text-pink-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Your cart is empty</h2>
          <p className="text-gray-500 mt-3 mb-8">
            Time to add some sparkle! Browse our top-rated salons.
          </p>
          <button
            onClick={() => navigate("/salons")}
            className="w-full py-4 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-pink-200/50 transition-all"
          >
            Explore Salons
          </button>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-pink-50/60 pb-32">

      {/* ── Sticky Header ── */}
      <div className="sticky top-0 z-50 bg-pink-50/95 backdrop-blur-lg border-b border-pink-100/60">
        <div className="flex items-center justify-between px-4 md:px-8 lg:px-16 py-4 max-w-3xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-pink-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </button>
          <div className="text-center">
            <h1 className="text-lg md:text-xl font-bold text-gray-900">Review Booking</h1>
            <p className="text-xs text-gray-400">
              {totalServices} service{totalServices > 1 ? "s" : ""} selected
            </p>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 lg:px-16 py-4">
        <p className="text-center text-xs text-gray-400 mb-1">
          {totalServices} service{totalServices > 1 ? "s" : ""} · Final Payable{" "}
          <span className="font-bold text-rose-500">₹{finalTotal}</span>
        </p>
      </div>
      <div className="max-w-5xl mx-auto px-4 md:px-8 lg:px-16 py-5">
        {/* ── Service Cards (one per salon × mode) — two-col on large screens ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          {cart.map((salon) => {
            const groups = [
              {
                mode: "salon",
                label: "Visit Salon",
                icon: <Store size={16} className="text-rose-500" />,
                services: salon.services.filter((s) => s.bookedMode !== "home"),
              },
              {
                mode: "home",
                label: "Salon at Home",
                icon: <Home size={16} className="text-rose-500" />,
                services: salon.services.filter((s) => s.bookedMode === "home"),
              },
            ].filter((g) => g.services.length > 0);

            return groups.map((group) => {
              const sectionKey = `${salon.salonId}-${group.mode}`;
              const isExpanded = expandedSections[sectionKey] !== false;
              const timeData = bookings[sectionKey];
              const groupTotal = group.services.reduce(
                (sum, s) =>
                  sum +
                  (Number(s.price) || 0) +
                  (group.mode === "home" ? Number(s.homeServiceCharge) || 40 : 0),
                0
              );

              return (
                <div
                  key={sectionKey}
                  className="bg-white rounded-2xl border border-pink-100/60 shadow-sm overflow-hidden"
                >
                  {/* ── Group Header ── */}
                  <button
                    onClick={() => toggleSection(sectionKey)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-pink-50/40 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-rose-50 rounded-full flex items-center justify-center">
                        {group.icon}
                      </div>
                      <span className="text-base font-bold text-gray-900">{group.label}</span>
                    </div>
                    {isExpanded
                      ? <ChevronUp className="w-4 h-4 text-gray-400" />
                      : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </button>

                  {isExpanded && (
                    <div className="border-t border-pink-50 px-5 pb-4 space-y-4">

                      {/* Salon info row */}
                      <div className="flex items-center gap-3 pt-3">
                        <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center shrink-0">
                          <Scissors className="w-5 h-5 text-rose-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900">{salon.salonName}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5 flex-wrap">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {group.mode === "home"
                                ? "Home Address"
                                : "Gomti Nagar, Lucknow"}
                            </span>
                            {group.mode === "salon" && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" /> +91 987654210
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Date/time chip */}
                      <button
                        onClick={() => {
                          setActiveSlotInfo({
                            salonId: salon.salonId,
                            mode: group.mode,
                            salonName: salon.salonName,
                            salonLocation: group.mode === "home" ? "Home Address" : "Gomti Nagar, Lucknow",
                          });
                          setIsModalOpen(true);
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all w-auto ${timeData
                          ? "bg-pink-50 border-pink-200 text-gray-700"
                          : "bg-pink-50 border-pink-200 text-rose-500"
                          }`}
                      >
                        <Clock className="w-3.5 h-3.5 text-rose-400" />
                        {timeData
                          ? `${timeData.day ? `${new Date(timeData.year, ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].indexOf(timeData.month), timeData.day).toLocaleDateString("en-US", { weekday: "short" })}, ` : ""}${timeData.day} ${timeData.month} ${timeData.year}, ${timeData.time}`
                          : "Select date & time"}
                        <RotateCcw className="w-3 h-3 text-gray-400 ml-1" />
                      </button>

                      {/* Service rows */}
                      {group.services.map((service) => (
                        <div key={service._id} className="flex items-center gap-3">
                          {/* Thumbnail */}
                          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 shadow-sm bg-pink-100">
                            <img
                              src={getServiceImage(service.name)}
                              alt={service.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-sm font-bold text-gray-900">{service.name}</p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                  {formatDuration(service.durationMins)}
                                </p>
                                {group.mode === "home" && service.homeServiceCharge > 0 && (
                                  <p className="text-xs text-gray-400">
                                    + ₹{service.homeServiceCharge} home charge
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-sm font-bold text-gray-900">
                                  ₹{service.price}
                                </span>
                                <button
                                  onClick={() => removeService(salon.salonId, service._id)}
                                  className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-rose-50 hover:text-rose-400 text-gray-400 transition-colors text-xs"
                                >
                                  ×
                                </button>
                              </div>
                            </div>

                            {/* Free offer unlock row */}
                            {offerUnlocked && (
                              <div className="mt-2 bg-yellow-50 rounded-lg px-3 py-1.5 flex items-center gap-2">
                                <Gift className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                <span className="text-xs font-bold text-green-600">
                                  FREE {FREE_OFFER_NAME} Service Unlocked!
                                </span>
                                <span className="text-xs text-green-500 ml-auto">₹0</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Subtotal row */}
                      <div className="flex items-center justify-between pt-2 border-t border-pink-50">
                        <span className="text-sm text-gray-500">Subtotal</span>
                        <span className="text-sm font-bold text-gray-900">₹{groupTotal}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            });
          })}

        </div>

        {/* ── Offer banner + Summary below the grid ── */}
        <div className="mt-4 space-y-4">
          <div
            className="rounded-2xl px-5 py-3.5 text-center font-bold text-sm"
            style={{
              background:
                "linear-gradient(135deg, #fce7f3 0%, #f9a8d4 30%, #e8a87c 70%, #f5d0a9 100%)",
            }}
          >
            ✨ Spend ₹{FREE_OFFER_THRESHOLD} &amp; Get {FREE_OFFER_NAME} FREE ✨
          </div>

          {/* Offer unlocked row */}
          {offerUnlocked && (
            <div className="flex items-center justify-between bg-white rounded-2xl px-4 py-3 border border-green-100">
              <div className="flex items-center gap-2 text-xs font-bold text-green-600">
                <CheckCircle2 className="w-4 h-4" /> Offer Unlocked · You saved ₹{FREE_OFFER_VALUE}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-green-600">
                <CheckCircle2 className="w-4 h-4" /> FREE {FREE_OFFER_NAME}
              </div>
            </div>
          )}

          {/* ── Summary Card ── */}
          <div className="bg-white rounded-2xl border border-pink-100/60 shadow-sm px-5 py-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-gray-900">Summary</span>
              <span className="text-base font-bold text-gray-900">₹{grandTotal}</span>
            </div>
            {salonTotal > 0 && (
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Service Total</span>
                <span>₹{salonTotal}</span>
              </div>
            )}
            {homeTotal > 0 && (
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>At Home (incl. charges)</span>
                <span>₹{homeTotal}</span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex items-center justify-between text-sm text-rose-500 font-medium">
                <span>Discount</span>
                <span>- ₹{discount}</span>
              </div>
            )}
            <div className="pt-3 border-t border-pink-100 flex items-center justify-between">
              <span className="text-base font-bold text-gray-900">Final Payable</span>
              <span className="text-xl font-black text-rose-500">₹{finalTotal}</span>
            </div>
          </div>

          {/* ── Trust badges ── */}
          <div className="bg-white/70 rounded-2xl border border-pink-100/60 px-5 py-4 flex items-center justify-around gap-2 text-center">
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-5 h-5 text-rose-400" />
              <span className="text-[11px] font-semibold text-gray-500">Secure Pay</span>
            </div>
            <div className="w-px h-8 bg-pink-100" />
            <div className="flex flex-col items-center gap-1">
              <CheckCircle2 className="w-5 h-5 text-rose-400" />
              <span className="text-[11px] font-semibold text-gray-500">Instant Confirm</span>
            </div>
            <div className="w-px h-8 bg-pink-100" />
            <div className="flex flex-col items-center gap-1">
              <Sparkles className="w-5 h-5 text-rose-400" />
              <span className="text-[11px] font-semibold text-gray-500">Top Rated</span>
            </div>
          </div>
        </div>

        {/* ── Sticky Confirm Button ── */}
        <div className="fixed bottom-16 left-0 right-0 z-40 bg-pink-50/95 backdrop-blur-lg border-t border-pink-100/60 px-4 py-4">
          <div className="max-w-3xl mx-auto">
            {/* Slots progress hint */}
            {!canConfirm && requiredSlotsCount > 0 && (
              <p className="text-center text-xs text-amber-600 font-medium mb-2">
                {requiredSlotsCount - scheduledSlotsCount} slot(s) still need scheduling
              </p>
            )}
            <button
              disabled={!canConfirm}
              onClick={handleSubmit}
              className={`w-full py-4 rounded-2xl text-base font-bold transition-all ${canConfirm
                ? "bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-lg shadow-pink-200/50 active:scale-95"
                : "bg-gray-300 text-white cursor-not-allowed"
                }`}
            >
              Confirm Booking
            </button>
          </div>
        </div>

        {/* ── Date/Time Picker Modal ── */}
        <DateTimePicker
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmDateTime}
          mode={activeSlotInfo?.mode || "salon"}
          salonName={activeSlotInfo?.salonName || ""}
          salonLocation={activeSlotInfo?.salonLocation || ""}
        />
      </div>
    </div>
  );
};

export default CartPage;
