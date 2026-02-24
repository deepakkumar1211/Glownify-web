import React, { useEffect, useState } from "react";
import {
  Trash2,
  ChevronDown,
  ShoppingBag,
  Clock,
  Home,
  Store,
  Scissors,
  Sparkles,
  ShieldCheck,
  ArrowLeft,
  Heart,
  MapPin,
  Phone,
  Gift,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createBooking } from "../../redux/slice/userSlice";
import DateTimePicker from "../../utils/DateTimePicker";
import toast from "react-hot-toast";
import { calculateTimeSlot } from "../../utils/TimeSlot";

// ─── Constants ─────────────────────────────────────────────────────────────────

/** Returns the localStorage key for a user's cart (supports guest carts too) */
const getCartKey = (userId) => `@user_cart_${userId}`;

/** Free offer is unlocked when cart total reaches this threshold */
const FREE_OFFER_THRESHOLD = 999;
const FREE_OFFER_NAME = "Nail Polish";
const FREE_OFFER_VALUE = 99;

// ─── Service Image Mapping ─────────────────────────────────────────────────────
// Keyword → Unsplash image URL used to show a relevant thumbnail per service.

const SERVICE_IMAGES = {
  hair: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=200&h=200&fit=crop&crop=face",
  facial: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=200&h=200&fit=crop&crop=face",
  wax: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=200&h=200&fit=crop&crop=face",
  makeup: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=200&h=200&fit=crop&crop=face",
  nail: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=200&h=200&fit=crop&crop=face",
  spa: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=200&h=200&fit=crop&crop=face",
};

/**
 * Returns the best-matching thumbnail URL for a given service name.
 * Falls back to the hair image if no keyword match is found.
 */
const getServiceImage = (name) => {
  const lower = name?.toLowerCase() || "";
  for (const [key, url] of Object.entries(SERVICE_IMAGES)) {
    if (lower.includes(key)) return url;
  }
  return SERVICE_IMAGES.hair;
};

/**
 * Converts a duration in minutes to a human-readable string.
 * e.g. 90 → "1 hour 30 min"
 */
const formatDuration = (mins) => {
  if (!mins) return "";
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h} hour ${m} min` : `${h} hour`;
};

// ─── Main Component ────────────────────────────────────────────────────────────

/**
 * CartPage
 * ─────────────────────────────────────────────────────────────
 * Shows the user's cart (loaded from localStorage) grouped by salon and service
 * mode (home / salon visit). Features:
 *   - Per-group time slot scheduling
 *   - Free offer progress bar (unlocks at ₹999)
 *   - Sticky order summary sidebar (desktop)
 *   - Sticky bottom CTA bar (mobile/tablet)
 *   - Booking confirmation via Redux thunk
 */
const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const userId = user?._id;

  // ── State ─────────────────────────────────────────────────
  const [cart, setCart] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSlotInfo, setActiveSlotInfo] = useState(null); // which group's slot is being edited
  const [bookings, setBookings] = useState({});     // { "salonId-mode": { date, time, ... } }
  const [expandedSections, setExpandedSections] = useState({});
  const [isFavorited, setIsFavorited] = useState(false);

  // ── Load Cart from localStorage ───────────────────────────
  // Supports both logged-in users and guests (guest key = @user_cart_undefined)
  useEffect(() => {
    const data = localStorage.getItem(getCartKey(userId));
    setCart(data ? JSON.parse(data) : []);
  }, [userId]);

  // ── Expand all sections by default whenever cart changes ──
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

  /** Toggles the collapsed/expanded state of a service group card */
  const toggleSection = (key) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  /** Removes a single service from the cart and updates localStorage */
  const removeService = (salonId, serviceId) => {
    const updated = cart
      .map((salon) =>
        salon.salonId === salonId
          ? { ...salon, services: salon.services.filter((s) => s._id !== serviceId) }
          : salon
      )
      .filter((salon) => salon.services.length > 0); // remove salon if no services remain

    setCart(updated);
    localStorage.setItem(getCartKey(userId), JSON.stringify(updated));
  };

  /** Saves the date/time chosen in the DateTimePicker modal for the active group */
  const handleConfirmDateTime = (data) => {
    if (activeSlotInfo) {
      const key = `${activeSlotInfo.salonId}-${activeSlotInfo.mode}`;
      setBookings({ ...bookings, [key]: data });
    }
    setIsModalOpen(false);
  };

  /**
   * Builds the bookings payload and dispatches the createBooking thunk.
   * - Groups services by salon and mode (home vs. salon)
   * - Validates that all groups have a scheduled time slot
   * - Clears cart on success and redirects to /bookings
   */
  const handleSubmit = async () => {
    const bookingsPayload = [];

    cart.forEach((salon) => {
      // Group this salon's services by booking mode
      const salonServicesByMode = {};
      salon.services.forEach((service) => {
        const mode = service.bookedMode || "salon";
        if (!salonServicesByMode[mode]) salonServicesByMode[mode] = [];
        salonServicesByMode[mode].push(service);
      });

      Object.entries(salonServicesByMode).forEach(([mode, services]) => {
        const slotKey = `${salon.salonId}-${mode}`;
        const slotData = bookings[slotKey];

        // Skip if user hasn't scheduled this slot yet
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
          // Only include address/coordinates for home service bookings
          serviceLocation:
            mode === "home"
              ? {
                address: slotData.address || "User Address",
                coordinates: {
                  type: "Point",
                  coordinates: [
                    Number(slotData.lng) || 0,
                    Number(slotData.lat) || 0,
                  ],
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

    try {
      await toast.promise(
        dispatch(createBooking({ bookings: bookingsPayload })).unwrap(),
        {
          loading: "Processing booking...",
          success: "Confirmed!",
          error: "Failed to book.",
        }
      );

      // Clear cart from state and localStorage on success
      setCart([]);
      localStorage.removeItem(getCartKey(userId));
      navigate("/bookings");
    } catch (err) {
      console.error("Booking failed:", err);
    }
  };

  // ── Totals & Derived Values ───────────────────────────────

  /**
   * Calculates total prices split by service mode.
   * Home service includes an extra home service charge.
   */
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

  // Free offer calculations
  const offerUnlocked = grandTotal >= FREE_OFFER_THRESHOLD;
  const amountToFreeOffer = Math.max(0, FREE_OFFER_THRESHOLD - grandTotal);
  const discount = offerUnlocked ? FREE_OFFER_VALUE : 0;
  const finalTotal = grandTotal - discount;

  // Slot scheduling progress
  const requiredSlotsCount = cart.reduce(
    (acc, salon) => acc + new Set(salon.services.map((s) => s.bookedMode || "salon")).size,
    0
  );
  const scheduledSlotsCount = Object.keys(bookings).length;

  // ── Empty Cart State ──────────────────────────────────────
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
    <div className="min-h-screen bg-pink-50/60 pb-28 lg:pb-10">

      {/* ── Sticky Header ── */}
      <div className="sticky top-0 z-50 bg-pink-50/90 backdrop-blur-lg border-b border-pink-100/60">
        <div className="flex items-center justify-between px-5 md:px-10 lg:px-16 py-4 max-w-7xl mx-auto">

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-pink-100 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </button>

          {/* Title + service count */}
          <div className="text-center">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
              Review Booking
            </h1>
            <p className="hidden md:block text-xs text-gray-400 mt-0.5">
              {totalServices} service{totalServices > 1 ? "s" : ""} selected
            </p>
          </div>

          {/* Favourite toggle */}
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

      {/* ── Page Content ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-16 py-6 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

          {/* ── LEFT: Service Cards ── */}
          <div className="flex-1 min-w-0 space-y-5">
            <div className="flex items-center gap-3">
              <Scissors className="w-5 h-5 text-rose-400" />
              <h2 className="text-lg md:text-xl font-bold text-gray-800">Your Services</h2>
              <span className="ml-auto text-sm font-semibold text-rose-500 bg-rose-50 border border-rose-200 px-3 py-0.5 rounded-full">
                {totalServices} item{totalServices > 1 ? "s" : ""}
              </span>
            </div>

            {/* Render one card per salon per mode (home / salon) */}
            {cart.map((salon) => {
              // Split services into "Visit Salon" and "Service at Home" groups
              const groups = [
                {
                  mode: "salon",
                  label: "Visit Salon",
                  icon: <Store size={18} className="text-rose-500" />,
                  services: salon.services.filter((s) => s.bookedMode !== "home"),
                },
                {
                  mode: "home",
                  label: "Service at Home",
                  icon: <Home size={18} className="text-rose-500" />,
                  services: salon.services.filter((s) => s.bookedMode === "home"),
                },
              ].filter((g) => g.services.length > 0); // only render groups that have services

              return groups.map((group) => {
                const sectionKey = `${salon.salonId}-${group.mode}`;
                const isExpanded = expandedSections[sectionKey] !== false;
                const timeData = bookings[sectionKey];
                const groupTotal = group.services.reduce(
                  (sum, s) => sum + (Number(s.price) || 0),
                  0
                );

                return (
                  <div
                    key={sectionKey}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl border border-pink-100/60 shadow-sm overflow-hidden"
                  >
                    {/* ── Section Header (collapsible toggle) ── */}
                    <button
                      onClick={() => toggleSection(sectionKey)}
                      className="w-full flex items-center justify-between px-5 md:px-7 py-4 md:py-5 hover:bg-pink-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-rose-50 rounded-full flex items-center justify-center">
                          {group.icon}
                        </div>
                        <span className="text-base md:text-lg font-bold text-gray-900">
                          {group.label}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? "" : "-rotate-90"
                          }`}
                      />
                    </button>

                    {/* ── Expanded Section Body ── */}
                    {isExpanded && (
                      <div className="border-t border-pink-50">

                        {/* Salon info row */}
                        <div className="px-5 md:px-7 py-4 flex items-center gap-4 border-b border-pink-50 bg-pink-50/30">
                          <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-sm border border-pink-100">
                            <Scissors className="w-5 h-5 text-rose-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm md:text-base font-bold text-gray-900">
                              {salon.salonName}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500 mt-0.5 flex-wrap">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> Gomti Nagar, Lucknow
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" /> +91 987654210
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Services list */}
                        <div className="px-5 md:px-7 py-4 space-y-4">
                          {group.services.map((service) => (
                            <div
                              key={service._id}
                              className="flex items-center gap-4 py-2 border-b border-pink-50/80 last:border-0"
                            >
                              {/* Service thumbnail */}
                              <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden shrink-0 shadow-sm">
                                <img
                                  src={getServiceImage(service.name)}
                                  alt={service.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              {/* Service details */}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm md:text-base font-bold text-gray-900">
                                  {service.name}
                                </p>
                                <p className="text-xs md:text-sm text-gray-400 mt-0.5">
                                  {formatDuration(service.durationMins)}
                                </p>
                                <p className="text-base md:text-lg font-black text-gray-900 mt-1">
                                  ₹ {service.price}
                                </p>
                              </div>

                              {/* Remove service button */}
                              <button
                                onClick={() => removeService(salon.salonId, service._id)}
                                className="text-rose-300 hover:text-rose-500 transition-colors p-2 rounded-lg hover:bg-rose-50"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          ))}

                          {/* Free offer reward row (shown when offer is unlocked) */}
                          {offerUnlocked && (
                            <div className="flex items-center gap-3 bg-green-50 rounded-xl px-3 py-2">
                              <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                                <Gift className="w-6 h-6 text-green-500" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-green-700">
                                  🎁 FREE {FREE_OFFER_NAME} Service Unlocked!
                                </p>
                                <p className="text-xs text-green-500">Discount Applied: ₹0</p>
                              </div>
                              <p className="text-base font-bold text-green-600 shrink-0">₹ 0</p>
                            </div>
                          )}
                        </div>

                        {/* Schedule Slot + Subtotal row */}
                        <div className="px-5 md:px-7 py-4 border-t border-pink-50 flex items-center justify-between gap-4 flex-wrap">
                          <button
                            onClick={() => {
                              setActiveSlotInfo({ salonId: salon.salonId, mode: group.mode });
                              setIsModalOpen(true);
                            }}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${timeData
                                ? "bg-green-50 text-green-600 border border-green-200"
                                : "bg-pink-50 text-rose-500 border border-pink-200 hover:bg-pink-100"
                              }`}
                          >
                            <Clock size={16} />
                            {timeData
                              ? `${timeData.day} ${timeData.month}, ${timeData.time}`
                              : "Schedule Slot"}
                          </button>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400">Subtotal</span>
                            <span className="text-lg md:text-xl font-bold text-gray-900">
                              ₹ {groupTotal}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              });
            })}

            {/* ── Free Offer Progress Banner (mobile/tablet only) ── */}
            <div className="lg:hidden space-y-4">
              <FreeOfferBanner
                grandTotal={grandTotal}
                offerUnlocked={offerUnlocked}
                freeOfferThreshold={FREE_OFFER_THRESHOLD}
                freeOfferName={FREE_OFFER_NAME}
                freeOfferValue={FREE_OFFER_VALUE}
              />
            </div>
          </div>

          {/* ── RIGHT: Sticky Order Summary (desktop lg+) ── */}
          <div className="w-full lg:w-[380px] xl:w-[420px] shrink-0 lg:sticky lg:top-24 space-y-4">

            {/* Free Offer Banner (desktop sidebar) */}
            <FreeOfferBanner
              grandTotal={grandTotal}
              offerUnlocked={offerUnlocked}
              freeOfferThreshold={FREE_OFFER_THRESHOLD}
              freeOfferName={FREE_OFFER_NAME}
              freeOfferValue={FREE_OFFER_VALUE}
            />

            {/* ── Price Summary Card ── */}
            <div className="bg-white/90 rounded-2xl border border-pink-100/60 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-pink-50 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-400" />
                <h3 className="text-base font-bold text-gray-900">Order Summary</h3>
              </div>

              <div className="px-6 py-5 space-y-3">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Services ({totalServices})</span>
                  <span className="text-gray-800 font-medium">₹{grandTotal}</span>
                </div>

                {salonTotal > 0 && (
                  <div className="flex justify-between text-sm text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5" /> Visit Salon
                    </span>
                    <span>₹{salonTotal}</span>
                  </div>
                )}

                {homeTotal > 0 && (
                  <div className="flex justify-between text-sm text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Home className="w-3.5 h-3.5" /> At Home (incl. charges)
                    </span>
                    <span>₹{homeTotal}</span>
                  </div>
                )}

                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({FREE_OFFER_NAME})</span>
                    <span className="font-medium">- ₹{discount}</span>
                  </div>
                )}

                {/* Grand total */}
                <div className="pt-3 border-t border-pink-100 flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-black text-rose-500">₹{finalTotal}</span>
                </div>
              </div>

              {/* Slot scheduling progress indicator */}
              {requiredSlotsCount > 0 && (
                <div className="px-6 pb-4">
                  <div
                    className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg ${scheduledSlotsCount >= requiredSlotsCount
                        ? "bg-green-50 text-green-600"
                        : "bg-amber-50 text-amber-600"
                      }`}
                  >
                    {scheduledSlotsCount >= requiredSlotsCount ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 shrink-0" />
                    )}
                    {scheduledSlotsCount >= requiredSlotsCount
                      ? "All slots scheduled ✓"
                      : `${requiredSlotsCount - scheduledSlotsCount} slot(s) need scheduling`}
                  </div>
                </div>
              )}

              {/* Confirm Booking button */}
              <div className="px-6 pb-6">
                <button
                  disabled={scheduledSlotsCount < requiredSlotsCount}
                  onClick={handleSubmit}
                  className={`w-full py-4 rounded-2xl text-base font-bold transition-all shadow-lg ${scheduledSlotsCount < requiredSlotsCount
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                      : "bg-gradient-to-r from-rose-400 to-pink-500 text-white hover:shadow-xl hover:shadow-pink-300/50 active:scale-95"
                    }`}
                >
                  {scheduledSlotsCount < requiredSlotsCount
                    ? `Set ${requiredSlotsCount - scheduledSlotsCount} More Slot(s)`
                    : "Confirm Booking"}
                </button>
              </div>
            </div>

            {/* ── Trust Badges ── */}
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
        </div>
      </div>

      {/* ── Sticky Bottom CTA Bar (mobile/tablet only) ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-pink-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between px-5 md:px-10 py-3.5 max-w-4xl mx-auto">
          <div className="text-gray-800">
            <span className="text-sm font-medium text-gray-500">
              {totalServices} Service{totalServices > 1 ? "s" : ""} | ₹{grandTotal}
            </span>
            {discount > 0 && (
              <span className="ml-3 text-lg font-black text-rose-500">₹{finalTotal}</span>
            )}
          </div>
          <button
            disabled={scheduledSlotsCount < requiredSlotsCount}
            onClick={handleSubmit}
            className={`px-8 py-3 rounded-2xl text-base font-bold transition-all shadow-lg ${scheduledSlotsCount < requiredSlotsCount
                ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                : "bg-gradient-to-r from-rose-400 to-pink-500 text-white hover:shadow-xl hover:shadow-pink-300/50 active:scale-95"
              }`}
          >
            {scheduledSlotsCount < requiredSlotsCount
              ? `Set ${requiredSlotsCount - scheduledSlotsCount} More Slot(s)`
              : "Confirm Booking"}
          </button>
        </div>
      </div>

      {/* ── Date/Time Picker Modal ── */}
      <DateTimePicker
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDateTime}
      />
    </div>
  );
};

// ─── Helper Component ─────────────────────────────────────────────────────────

/**
 * FreeOfferBanner
 * Shows a progress bar towards the free offer threshold,
 * or a success banner when the offer is already unlocked.
 */
const FreeOfferBanner = ({
  grandTotal,
  offerUnlocked,
  freeOfferThreshold,
  freeOfferName,
  freeOfferValue,
}) => {
  if (offerUnlocked) {
    return (
      <div className="flex items-center gap-3 bg-green-50 rounded-2xl px-5 py-3 border border-green-200">
        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
        <span className="text-sm font-bold text-green-700">
          Offer Unlocked! You saved ₹{freeOfferValue}
        </span>
        <span className="ml-auto text-sm font-bold text-green-600">
          🎁 FREE {freeOfferName}
        </span>
      </div>
    );
  }

  if (grandTotal <= 0) return null;

  return (
    <div
      className="rounded-2xl px-5 py-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #fce7f3 0%, #f9a8d4 30%, #e8a87c 70%, #f5d0a9 100%)",
      }}
    >
      <p className="text-sm font-bold text-gray-800 relative z-10">
        ✨ Spend ₹{freeOfferThreshold} & Get {freeOfferName} FREE
      </p>
      <div className="mt-2 flex items-center gap-3 relative z-10">
        <div className="flex-1 h-2 bg-white/40 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(1, grandTotal / freeOfferThreshold) * 100}%` }}
          />
        </div>
        <span className="text-xs font-bold text-gray-700 shrink-0">
          ₹{grandTotal} / ₹{freeOfferThreshold}
        </span>
      </div>
    </div>
  );
};

export default CartPage;
