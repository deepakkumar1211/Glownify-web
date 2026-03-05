import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchServiceItemByCategory } from "../../../../redux/slice/userSlice";
import { useOutletContext, useNavigate, useParams } from "react-router-dom";
import {
  Clock,
  Plus,
  Minus,
  ShoppingCart,
  ChevronRight,
} from "lucide-react";
import {
  addToCart,
  removeFromCart,
  getCart,
  updateServiceMode,
} from "../../../../utils/CartStorage";

// Placeholder images for service categories
const SERVICE_IMAGES = {
  hair: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=200&h=200&fit=crop&crop=face",
  facial: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=200&h=200&fit=crop&crop=face",
  wax: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=200&h=200&fit=crop&crop=face",
  makeup: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=200&h=200&fit=crop&crop=face",
  nail: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=200&h=200&fit=crop&crop=face",
  spa: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=200&h=200&fit=crop&crop=face",
  beard: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=200&h=200&fit=crop&crop=face",
  color: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=200&h=200&fit=crop&crop=face",
};

const getServiceImage = (name) => {
  const lower = name?.toLowerCase() || "";
  for (const [key, url] of Object.entries(SERVICE_IMAGES)) {
    if (lower.includes(key)) return url;
  }
  return SERVICE_IMAGES.hair;
};

const formatDuration = (mins) => {
  if (!mins) return "45 min";
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h} hour ${m} min` : `${h} hour`;
};

// ─── Fallback demo services for placeholder salons ───
const DEMO_SERVICES = {
  "cat-1": [ // Hair
    { _id: "demo-h1", name: "Hair Cut & Style", price: 299, durationMins: 45, serviceMode: "both", homeServiceCharge: 50 },
    { _id: "demo-h2", name: "Hair Spa Treatment", price: 799, durationMins: 60, serviceMode: "both", homeServiceCharge: 80 },
    { _id: "demo-h3", name: "Hair Coloring", price: 1499, durationMins: 90, serviceMode: "salon", homeServiceCharge: 0 },
    { _id: "demo-h4", name: "Hair Straightening", price: 2499, durationMins: 120, serviceMode: "salon", homeServiceCharge: 0 },
  ],
  "cat-2": [ // Facial
    { _id: "demo-f1", name: "Facial Treatment", price: 950, durationMins: 45, serviceMode: "both", homeServiceCharge: 60 },
    { _id: "demo-f2", name: "Clean Up", price: 600, durationMins: 30, serviceMode: "both", homeServiceCharge: 40, tag: "STEALDEAL" },
    { _id: "demo-f3", name: "Diamond Facial", price: 1499, durationMins: 75, serviceMode: "both", homeServiceCharge: 100 },
  ],
  "cat-3": [ // Wax
    { _id: "demo-w1", name: "Full Arms Waxing", price: 400, durationMins: 20, serviceMode: "both", homeServiceCharge: 40 },
    { _id: "demo-w2", name: "Full Legs Waxing", price: 299, durationMins: 40, serviceMode: "both", homeServiceCharge: 50 },
    { _id: "demo-w3", name: "Full Body Waxing", price: 899, durationMins: 90, serviceMode: "both", homeServiceCharge: 100 },
  ],
  "cat-4": [ // Makeup
    { _id: "demo-m1", name: "Party Makeup", price: 1999, durationMins: 60, serviceMode: "both", homeServiceCharge: 150 },
    { _id: "demo-m2", name: "Bridal Makeup", price: 4000, durationMins: 120, serviceMode: "both", homeServiceCharge: 200 },
    { _id: "demo-m3", name: "Engagement Makeup", price: 3499, durationMins: 90, serviceMode: "both", homeServiceCharge: 180 },
  ],
};

// Free offer threshold
const FREE_OFFER_THRESHOLD = 999;
const FREE_OFFER_NAME = "Nail Polish Service";

const SalonServices = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const userId = useSelector((state) => state?.auth?.user?._id);
  // serviceMode comes from the parent toggle ("home" | "salon") in HomeSaloonsDetails
  const { saloonDetails, activeCategory: ctxCategory, setActiveCategory, serviceMode } = useOutletContext();

  // Match all dummy ID formats: home-page placeholders, and SalonsPage dummy IDs (d-w-*, d-m-*)
  const isPlaceholder =
    id?.startsWith("placeholder") ||
    id?.startsWith("d-w-") ||
    id?.startsWith("d-m-");

  const [cartItems, setCartItems] = useState([]);
  const [demoItems, setDemoItems] = useState([]);

  const categories = saloonDetails?.serviceCategories || [];
  const selectedSalonId = saloonDetails?._id;
  const { serviceItems, loading } = useSelector((state) => state.user);

  // Use demo items for placeholder salons, real items for real salons
  const displayItems = isPlaceholder ? demoItems : serviceItems;

  useEffect(() => {
    if (userId) setCartItems(getCart(userId));
  }, [userId]);

  // Auto-select first category if none selected
  useEffect(() => {
    if (categories.length > 0 && !ctxCategory) {
      const firstCat = categories[0]._id;
      if (setActiveCategory) setActiveCategory(firstCat);
    }
  }, [categories]);

  // Load services whenever activeCategory changes
  useEffect(() => {
    if (!ctxCategory) return;
    if (isPlaceholder) {
      setDemoItems(DEMO_SERVICES[ctxCategory] || []);
    } else if (selectedSalonId) {
      dispatch(fetchServiceItemByCategory({ salonId: selectedSalonId, categoryId: ctxCategory }));
    }
  }, [ctxCategory, selectedSalonId, dispatch, isPlaceholder]);

  // Called when user taps "+Add" or the "+" stepper button.
  // Respects the current toggle (serviceMode) for the booking mode.
  const initiateAddToCart = (service) => {
    // Map toggle value ("home" | "salon") to cart's bookedMode strings
    const resolvedMode = serviceMode === "home" ? "home" : "salon";

    // Check if this service is already in cart
    const currentSalonCart = cartItems.find((s) => s.salonId === selectedSalonId);
    const existingEntry = currentSalonCart?.services.find((s) => s._id === service._id);

    if (existingEntry) {
      if (existingEntry.bookedMode !== resolvedMode) {
        // Service is in cart but with a different mode — update its mode
        const updated = updateServiceMode(userId, selectedSalonId, service._id, resolvedMode);
        setCartItems(updated);
      }
      // If same mode, nothing to do (already in cart)
    } else {
      // New service — add it with the current mode
      const updated = addToCart(userId, saloonDetails, service, resolvedMode);
      setCartItems(updated);
    }
  };


  const handleRemoveFromCart = (serviceId) => {
    const updated = removeFromCart(userId, selectedSalonId, serviceId);
    setCartItems(updated);
  };

  // Returns 1 if this service is in cart AND its bookedMode matches the current toggle.
  // Returns 0 otherwise — so switching the toggle shows "+ Add" again for mode-change.
  const getServiceQuantity = (serviceId) => {
    const resolvedMode = serviceMode === "home" ? "home" : "salon";
    const salonCart = cartItems.find((s) => s.salonId === selectedSalonId);
    const service = salonCart?.services.find(
      (s) => s._id === serviceId && s.bookedMode === resolvedMode
    );
    return service ? 1 : 0;
  };

  // Calculate cart totals for this salon
  const currentSalonCart = cartItems.find((s) => s.salonId === selectedSalonId);
  const cartServiceCount = currentSalonCart?.services?.length || 0;
  const cartTotal = currentSalonCart?.services?.reduce((sum, s) => sum + (Number(s.price) || 0), 0) || 0;

  // Free offer progress
  const amountToFreeOffer = Math.max(0, FREE_OFFER_THRESHOLD - cartTotal);
  const offerProgress = Math.min(1, cartTotal / FREE_OFFER_THRESHOLD);
  const offerUnlocked = cartTotal >= FREE_OFFER_THRESHOLD;

  const isLoading = loading && !isPlaceholder;

  return (
    <div className="w-full min-h-[400px] relative pb-24">

      <div className="py-2 space-y-3">
        {isLoading ? (
          // Skeleton loading
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white/70 rounded-2xl p-4 animate-pulse flex gap-4">
                <div className="w-20 h-20 bg-pink-100 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-pink-100 rounded w-2/3" />
                  <div className="h-3 bg-pink-50 rounded w-1/3" />
                  <div className="h-5 bg-pink-100 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {displayItems?.map((service) => {
              const qty = getServiceQuantity(service._id);
              return (
                <div
                  key={service._id}
                  className="bg-white rounded-2xl p-4 border border-pink-100/60 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex gap-4 items-center">
                    {/* Service Thumbnail */}
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden shrink-0 shadow-sm bg-gray-100">
                      <img
                        src={getServiceImage(service.name)}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Service Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <h4 className="text-sm md:text-base font-bold text-gray-900 leading-tight">
                          {service.name}
                        </h4>
                        {service.tag && (
                          <span className="text-[10px] font-bold text-rose-500 border border-rose-300 rounded px-1.5 py-0.5 leading-none">
                            *{service.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-xs md:text-sm text-gray-400 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDuration(service.durationMins)}
                      </p>
                      <p className="text-base md:text-lg font-black text-gray-900 mt-1">
                        ₹{service.price?.toLocaleString?.() || service.price}
                      </p>
                    </div>

                    {/* Add / Qty Controls */}
                    <div className="shrink-0">
                      {qty > 0 ? (
                        <div className="flex items-center gap-0 border border-pink-200 rounded-full overflow-hidden">
                          <button
                            onClick={() => handleRemoveFromCart(service._id)}
                            className="w-9 h-9 flex items-center justify-center bg-pink-50 hover:bg-pink-100 transition-colors text-rose-500"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-9 h-9 flex items-center justify-center text-sm font-bold text-gray-800 bg-white">
                            {qty}
                          </span>
                          <button
                            onClick={() => initiateAddToCart(service)}
                            className="w-9 h-9 flex items-center justify-center bg-pink-50 hover:bg-pink-100 transition-colors text-rose-500"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => initiateAddToCart(service)}
                          className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-bold border-2 border-rose-300 text-rose-500 bg-white hover:bg-rose-50 transition-all active:scale-95"
                        >
                          + Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* No services message */}
            {(!displayItems || displayItems.length === 0) && !isLoading && ctxCategory && (
              <div className="text-center py-12 bg-white rounded-2xl border border-pink-100/60">
                <span className="text-4xl text-gray-300 block mb-3">✂</span>
                <p className="text-gray-400 font-medium text-sm">No services in this category</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Free Offer Progress Banner */}
      {cartServiceCount > 0 && (
        <div className="pb-4 pt-2">
          <div
            className="rounded-2xl px-5 py-3 relative overflow-hidden"
            style={{
              background: offerUnlocked
                ? "linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 100%)"
                : "linear-gradient(135deg, #fce7f3 0%, #f9a8d4 30%, #e8a87c 70%, #f5d0a9 100%)",
            }}
          >
            <div className="relative z-10">
              <p className="text-sm font-bold text-gray-800">
                {offerUnlocked
                  ? `✅ Offer Unlocked! You saved ₹99 — FREE ${FREE_OFFER_NAME}`
                  : `✨ ₹${amountToFreeOffer} away from FREE ${FREE_OFFER_NAME}`}
              </p>
              {!offerUnlocked && (
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex-1 h-2 bg-white/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-500"
                      style={{ width: `${offerProgress * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-700 shrink-0">
                    ₹{cartTotal} / ₹{FREE_OFFER_THRESHOLD}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Cart Bar — sits above the mobile tab nav */}
      {cartServiceCount > 0 && (
        <div className="fixed bottom-10 md:bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-pink-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between px-5 md:px-10 py-3.5 max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-gray-800">
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              <span className="text-base font-bold">
                {cartServiceCount} Service{cartServiceCount > 1 ? "s" : ""} |{" "}
                <span className="text-gray-900">₹{cartTotal.toLocaleString()}</span>
              </span>
            </div>
            <button
              onClick={() => navigate("/cart")}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-400 to-pink-500 text-white font-bold text-sm shadow-lg shadow-pink-200/50 hover:shadow-xl hover:shadow-pink-300/50 active:scale-95 transition-all"
            >
              Review Booking <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalonServices;