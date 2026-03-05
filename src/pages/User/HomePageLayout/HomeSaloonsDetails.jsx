import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSaloonDetailsById } from "../../../redux/slice/userSlice";
import { addToCart, removeFromCart, getCart } from "../../../utils/CartStorage";
import {
  ArrowLeft, Heart, Star, MapPin, ChevronDown, ChevronUp,
  Sparkles, Clock, ShoppingCart, ChevronRight, Plus, Minus, Search, SlidersHorizontal, X,
} from "lucide-react";
import salonImgLocal from "../../../assets/salon.png";
import haircutImgLocal from "../../../assets/haircut.png";
import facialImgLocal from "../../../assets/facial.png";
import makeupImgLocal from "../../../assets/makeup.png";

// ─── Fallback Data ─────────────────────────────────────────────────────────────
// Used for placeholder/demo salon IDs (e.g. when navigating from home page cards).

const FALLBACK_SALON = {
  _id: "demo",
  shopName: "Glamour Beauty Salon",
  tagline: "Elegant & Luxurious Beauty Services",
  hours: "10:00 AM - 8:00 PM",
  isOpen: true,
  coverImage:
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop",
  galleryImages: [
    salonImgLocal,
    haircutImgLocal,
    facialImgLocal,
    makeupImgLocal,
    salonImgLocal,
    haircutImgLocal,
  ],
  location: {
    address: "Anand Nagar",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411001",
  },
  aboutUs: "We offer a wide range of premium beauty services in a relaxing and luxurious environment. Our expert stylists and beauticians are dedicated to making you look and feel your best.",
  homeService: true,
  rating: "4.8",
  reviewCount: "120",
  distance: "2.5",
  serviceCategories: [
    { _id: "cat-1", name: "Hair" },
    { _id: "cat-2", name: "Facial" },
    { _id: "cat-3", name: "Wax" },
    { _id: "cat-4", name: "Makeup" },
  ],
  specialistsData: [],
};

// ─── Category Image Mapping ────────────────────────────────────────────────────
// Maps category keywords to representative Unsplash images.

const CATEGORY_IMAGES = {
  hair: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=200&h=200&fit=crop&crop=face",
  facial: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=200&h=200&fit=crop&crop=face",
  wax: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=200&h=200&fit=crop&crop=face",
  makeup: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=200&h=200&fit=crop&crop=face",
  nail: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=200&h=200&fit=crop&crop=face",
  spa: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=200&h=200&fit=crop&crop=face",
  beard: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=200&h=200&fit=crop&crop=face",
};

// ─── Service Image Mapping (for mobile service thumbnails) ──────────────────────
const SERVICE_IMAGES = {
  hair: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=200&h=200&fit=crop&crop=face",
  facial: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=200&h=200&fit=crop&crop=face",
  wax: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=200&h=200&fit=crop&crop=face",
  makeup: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=200&h=200&fit=crop&crop=face",
  nail: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=200&h=200&fit=crop&crop=face",
  spa: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=200&h=200&fit=crop&crop=face",
  cut: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&h=200&fit=crop",
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
  const h = Math.floor(mins / 60), m = mins % 60;
  return m > 0 ? `${h} hour ${m} min` : `${h} hour`;
};

// ─── Mobile Demo Services (matches React Native app DUMMY_SERVICES) ──────────────
const MOBILE_DEMO_SERVICES = {
  "cat-1": [
    { _id: "m-h1", name: "Haircut & Styling", duration: "30 mins", salonPrice: 600, homePrice: 700, serviceMode: "both", badge: null },
    { _id: "m-h2", name: "Hair Spa", duration: "40 mins", salonPrice: 700, homePrice: 850, serviceMode: "both", badge: null },
    { _id: "m-h3", name: "Hair Coloring", duration: "1 hour", salonPrice: 1200, homePrice: null, serviceMode: "salon", badge: "Opt." },
  ],
  "cat-2": [
    { _id: "m-f1", name: "Facial Treatment", duration: "45 mins", salonPrice: 800, homePrice: 950, serviceMode: "both", badge: null },
    { _id: "m-f2", name: "Clean Up", duration: "30 mins", salonPrice: 500, homePrice: 600, serviceMode: "both", badge: "*STEALDEAL" },
  ],
  "cat-3": [
    { _id: "m-w1", name: "Full Arms Waxing", duration: "20 mins", salonPrice: 300, homePrice: 400, serviceMode: "both", badge: null },
    { _id: "m-w2", name: "Full Legs Waxing", duration: "40 mins", salonPrice: 299, homePrice: 380, serviceMode: "both", badge: null },
  ],
  "cat-4": [
    { _id: "m-m1", name: "Bridal Makeup", duration: "2 hours", salonPrice: 3500, homePrice: 4000, serviceMode: "both", badge: null },
    { _id: "m-m2", name: "Party Makeup", duration: "1 hour", salonPrice: 1999, homePrice: 2200, serviceMode: "both", badge: null },
  ],
};

// ─── Sub-service options (shown in bottom sheet when Add is tapped) ───────────
// Keyed by parent service _id. Each sub-service has its own price, duration, image.
const SUB_SERVICES = {
  "m-h1": [
    { _id: "m-h1-a", name: "Women Cut", duration: "20 mins", price: 250, image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&h=200&fit=crop&crop=face" },
    { _id: "m-h1-b", name: "Men Cut", duration: "15 mins", price: 200, image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=200&h=200&fit=crop&crop=face" },
    { _id: "m-h1-c", name: "Blow Dry", duration: "20 mins", price: 300, image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&h=200&fit=crop" },
    { _id: "m-h1-d", name: "Trim & Style", duration: "15 mins", price: 150, image: null },
  ],
  "m-h2": [
    { _id: "m-h2-a", name: "Spa Treatment", duration: "30 mins", price: 400, image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=200&h=200&fit=crop" },
    { _id: "m-h2-b", name: "Deep Conditioning", duration: "20 mins", price: 350, image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=200&h=200&fit=crop&crop=face" },
  ],
  "m-f1": [
    { _id: "m-f1-a", name: "Basic Facial", duration: "30 mins", price: 500, image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=200&h=200&fit=crop&crop=face" },
    { _id: "m-f1-b", name: "Gold Facial", duration: "45 mins", price: 800, image: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=200&h=200&fit=crop" },
    { _id: "m-f1-c", name: "Anti-Ageing Facial", duration: "60 mins", price: 1200, image: "https://images.unsplash.com/photo-1591343395082-e120087004b4?w=200&h=200&fit=crop" },
  ],
  "m-f2": [
    { _id: "m-f2-a", name: "Normal Clean Up", duration: "20 mins", price: 300, image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=200&h=200&fit=crop" },
    { _id: "m-f2-b", name: "D-Tan Clean Up", duration: "30 mins", price: 400, image: "https://images.unsplash.com/photo-1591343395082-e120087004b4?w=200&h=200&fit=crop" },
  ],
  "m-w1": [
    { _id: "m-w1-a", name: "Half Arms", duration: "10 mins", price: 150, image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=200&h=200&fit=crop" },
    { _id: "m-w1-b", name: "Full Arms", duration: "20 mins", price: 300, image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=200&h=200&fit=crop" },
  ],
  "m-w2": [
    { _id: "m-w2-a", name: "Half Legs", duration: "20 mins", price: 199, image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=200&h=200&fit=crop" },
    { _id: "m-w2-b", name: "Full Legs", duration: "40 mins", price: 299, image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=200&h=200&fit=crop" },
  ],
  "m-m1": [
    { _id: "m-m1-a", name: "Bridal (Basic)", duration: "90 mins", price: 2500, image: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=200&h=200&fit=crop" },
    { _id: "m-m1-b", name: "Bridal (Premium)", duration: "2 hours", price: 4000, image: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=200&h=200&fit=crop" },
  ],
  "m-m2": [
    { _id: "m-m2-a", name: "Day Makeup", duration: "45 mins", price: 999, image: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=200&h=200&fit=crop" },
    { _id: "m-m2-b", name: "Party Makeup", duration: "1 hour", price: 1499, image: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=200&h=200&fit=crop" },
    { _id: "m-m2-c", name: "HD Makeup", duration: "75 mins", price: 1999, image: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=200&h=200&fit=crop" },
  ],
};

/**
 * Returns the best-matching image URL for a given service category name.
 * Falls back to the hair image if no keyword match is found.
 */
const getCategoryImage = (name) => {
  const lower = name?.toLowerCase() || "";
  for (const [key, url] of Object.entries(CATEGORY_IMAGES)) {
    if (lower.includes(key)) return url;
  }
  return CATEGORY_IMAGES.hair;
};

// ─── Shared Horizontal Padding ─────────────────────────────────────────────────
// Keeps left/right padding consistent across all sections.
const PX = "px-5 md:px-8 lg:px-12 xl:px-16";

// ─── Main Component ────────────────────────────────────────────────────────────

/**
 * HomeSaloonsDetails
 * ─────────────────────────────────────────────────────────────
 * Detail page for a single salon. Shows:
 *   - Sticky header bar (back, title, favourite)
 *   - Hero image with rating overlay
 *   - Address section
 *   - Service category circles
 *   - Home/Salon service mode toggle
 *   - Navigation tabs (Services, Gallery, Map, Reviews, Specialists)
 *   - Tab content rendered via <Outlet>
 *
 * Fetches salon data by `id` from the URL params.
 * For placeholder IDs, uses FALLBACK_SALON without an API call.
 */
const HomeSaloonsDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { saloonDetails, loading, serviceItems } = useSelector(
    (state) => state.user
  );

  // ── Local State ───────────────────────────────────────────
  const [isFavorited, setIsFavorited] = useState(false);
  const [serviceMode, setServiceMode] = useState("home");    // "home" | "salon"
  const [activeCategory, setActiveCategory] = useState(null);
  const [aboutOpen, setAboutOpen] = useState(false);         // About Us accordion
  const [carouselIndex, setCarouselIndex] = useState(0);     // Mobile image carousel
  const [cartItems, setCartItems] = useState([]);             // Mobile cart state
  const [serviceSearch, setServiceSearch] = useState("");    // Mobile service search
  // Sub-service bottom sheet state
  const [subSheet, setSubSheet] = useState(null);             // { service, subServices } | null
  const [selectedSubs, setSelectedSubs] = useState({});       // { subId: true }

  // Auth user id (needed for CartStorage)
  const userId = useSelector((state) => state?.auth?.user?._id);

  // Treat any dummy/demo ID as a placeholder — no real API call needed.
  // "placeholder" prefix = home page cards; "d-w-" / "d-m-" = dummy salon IDs from SalonsPage.
  const isPlaceholder =
    id?.startsWith("placeholder") ||
    id?.startsWith("d-w-") ||
    id?.startsWith("d-m-");

  // ── Fetch salon data ──────────────────────────────────────
  useEffect(() => {
    if (id && !isPlaceholder) {
      dispatch(getSaloonDetailsById(id));
    }
  }, [dispatch, id, isPlaceholder]);

  // Resolve which salon data to display
  const salon = isPlaceholder ? FALLBACK_SALON : saloonDetails || FALLBACK_SALON;
  const categories = salon.serviceCategories || [];

  // Auto-select the first available category on load
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]._id);
    }
  }, [categories]);

  // Load cart from storage on mount / userId change — deduplicate stale data
  useEffect(() => {
    if (!userId) return;
    let raw = getCart(userId);
    // Deduplicate: if a sub-service (e.g. "m-h1-a") exists, remove the bare
    // parent ID ("m-h1") that may have been added before sub-service sheet existed.
    raw = raw.map((salonEntry) => {
      const services = salonEntry.services;
      const subIds = services.map((s) => s._id);
      // Find parent IDs that have at least one sub-service already in cart
      const dedupedServices = services.filter((s) => {
        // Keep sub-services and normal services; drop bare parent IDs that
        // have sub-service duplicates (e.g. keep "m-h1-a", drop "m-h1" if "m-h1-a" exists)
        const hasSubInCart = subIds.some(
          (id) => id !== s._id && id.startsWith(s._id + "-")
        );
        return !hasSubInCart;
      });
      // Also deduplicate by _id (keep first occurrence only)
      const seen = new Set();
      const uniqueServices = dedupedServices.filter((s) => {
        if (seen.has(s._id)) return false;
        seen.add(s._id);
        return true;
      });
      return { ...salonEntry, services: uniqueServices };
    }).filter((e) => e.services.length > 0);
    // Write deduplicated cart back to localStorage
    localStorage.setItem(getCartKey(userId), JSON.stringify(raw));
    setCartItems(raw);
  }, [userId]);

  // Derived values for the services heading
  const itemCount = serviceItems?.length || 0;
  const activeCatName = categories.find((c) => c._id === activeCategory)?.name || "Cat";

  // ── Mobile view derived data ──────────────────────────────────
  // Services for the mobile view (demo for placeholders, API for real salons)
  const rawMobileServices = isPlaceholder
    ? (MOBILE_DEMO_SERVICES[activeCategory] || [])
    : (serviceItems || []).map(s => ({
      ...s,
      salonPrice: s.price,
      homePrice: s.homeServiceCharge ? s.price + s.homeServiceCharge : null,
      duration: formatDuration(s.durationMins),
    }));
  const mobileDisplayServices = rawMobileServices.filter(
    s => !(serviceMode === "home" && s.serviceMode === "salon")
  );
  // Search filter applied over the mode-filtered list
  const filteredMobileServices = serviceSearch
    ? mobileDisplayServices.filter(s => s.name?.toLowerCase().includes(serviceSearch.toLowerCase()))
    : mobileDisplayServices;

  // Cart helpers for mobile view
  const selectedSalonId = salon?._id;
  const mobileAddToCart = (service) => {
    const resolvedMode = serviceMode === "home" ? "home" : "salon";
    const price = resolvedMode === "home" && service.homePrice != null ? service.homePrice : service.salonPrice || service.price || 0;
    const updated = addToCart(userId, salon, { ...service, price }, resolvedMode);
    setCartItems(updated);
  };
  const mobileRemoveFromCart = (serviceId) => {
    const resolvedMode = serviceMode === "home" ? "home" : "salon";
    const updated = removeFromCart(userId, selectedSalonId, serviceId, resolvedMode);
    setCartItems(updated);
  };
  const isMobileServiceInCart = (serviceId) => {
    const salonCart = cartItems.find(s => s.salonId === selectedSalonId);
    if (!salonCart) return false;
    const resolvedMode = serviceMode === "home" ? "home" : "salon";
    // Match exact ID OR any sub-service ID that starts with "parentId-"
    // AND must match the current bookedMode
    return salonCart.services.some(
      s => (s._id === serviceId || s._id.startsWith(serviceId + "-")) && s.bookedMode === resolvedMode
    );
  };
  // Removes the parent service OR all its sub-services from the cart for the CURRENT mode
  const mobileRemoveParentAndSubs = (serviceId) => {
    const salonCart = cartItems.find(s => s.salonId === selectedSalonId);
    if (!salonCart) return;
    const resolvedMode = serviceMode === "home" ? "home" : "salon";
    // Find all IDs to remove (exact match + sub-service matches) for THIS mode
    const toRemove = salonCart.services
      .filter(s => (s._id === serviceId || s._id.startsWith(serviceId + "-")) && s.bookedMode === resolvedMode)
      .map(s => s._id);
    let updated = cartItems;
    toRemove.forEach(id => {
      updated = removeFromCart(userId, selectedSalonId, id, resolvedMode);
    });
    setCartItems(updated);
  };
  // Clear the entire cart for this salon
  const mobileClearCart = () => {
    const key = `@user_cart_${userId}`;
    const updated = getCart(userId).filter((s) => s.salonId !== selectedSalonId);
    localStorage.setItem(key, JSON.stringify(updated));
    setCartItems(updated);
  };
  const currentSalonCart = cartItems.find(s => s.salonId === selectedSalonId);
  const mobileCartCount = currentSalonCart?.services?.length || 0;
  const mobileCartTotal = currentSalonCart?.services?.reduce((sum, s) => sum + (Number(s.price) || 0), 0) || 0;

  // Reviews fallback for mobile view
  const mobileReviews = (salon?.reviews?.length > 0 ? salon.reviews : [
    { id: "1", userName: "Pooja S", userAvatar: "https://i.pravatar.cc/150?img=1", rating: 5, comment: "Great service and very clean!" },
    { id: "2", userName: "Amit K", userAvatar: "https://i.pravatar.cc/150?img=2", rating: 5, comment: "Loved the facial, will book again!" },
    { id: "3", userName: "Priya M", userAvatar: "https://i.pravatar.cc/150?img=3", rating: 4, comment: "Amazing experience, staff was very friendly!" },
  ]);
  const mobileAvgRating = salon?.rating ||
    (mobileReviews.reduce((s, r) => s + r.rating, 0) / mobileReviews.length).toFixed(1);
  const mobileFullStars = Math.floor(Number(mobileAvgRating));
  const salonImages = (salon.galleryImages?.length > 0 ? salon.galleryImages : [salon.coverImage]).filter(Boolean);

  // ── Loading State ─────────────────────────────────────────
  if (loading && !isPlaceholder) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-b from-pink-50 to-white">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
          <Sparkles className="w-6 h-6 text-pink-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="mt-4 text-gray-500 font-medium animate-pulse">
          Loading salon details...
        </p>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────
  return (
    <>

      {/* ══════════════════════════════════════════════════════════
        MOBILE-ONLY VIEW  (≤767px) — matches React Native app
        Uses block md:hidden so desktop is completely unaffected.
        ══════════════════════════════════════════════════════════ */}
      <div className="block md:hidden bg-[#F9EFEE] min-h-screen pb-32">

        {/* 1 — Image Carousel */}
        <div className="mx-4 mt-4 rounded-3xl overflow-hidden relative" style={{ height: 260 }}>
          <div
            className="flex h-full overflow-x-auto snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" }}
            onScroll={(e) => {
              const el = e.currentTarget;
              setCarouselIndex(Math.round(el.scrollLeft / el.offsetWidth));
            }}
          >
            {salonImages.map((img, i) => (
              <img key={i} src={img} alt={salon.shopName} className="object-cover flex-shrink-0 snap-center" style={{ width: "100%", height: 260, minWidth: "100%" }} />
            ))}
          </div>
          {/* Back + Title + Heart */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            <div className="flex items-center gap-2">
              <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-black/30 flex items-center justify-center">
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <span className="text-white text-lg font-bold drop-shadow truncate max-w-[180px]">{salon.shopName}</span>
            </div>
            <button onClick={() => setIsFavorited(!isFavorited)} className={`w-9 h-9 rounded-full flex items-center justify-center ${isFavorited ? "bg-[#EA8491]" : "bg-black/30"}`}>
              <Heart className="w-[18px] h-[18px] text-white" fill={isFavorited ? "white" : "none"} />
            </button>
          </div>
          {/* Dot indicators */}
          {salonImages.length > 1 && (
            <div className="absolute bottom-14 left-0 right-0 flex justify-center gap-1">
              {salonImages.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all ${i === carouselIndex ? "bg-white w-5" : "bg-white/40 w-1"}`} />
              ))}
            </div>
          )}
          {/* Bottom info pills */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <div className="flex items-center gap-1 bg-black/40 rounded-xl px-3 py-1.5">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-white text-xs font-bold">{salon.rating || "4.8"}</span>
              <span className="text-white/70 text-xs">({salon.reviewCount || "120"})</span>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center bg-black/40 rounded-xl px-3 py-1.5 gap-1">
                <MapPin className="w-3 h-3 text-white" />
                <span className="text-white text-xs">{salon.distance || "2.5"} km</span>
              </div>
              <button className="flex items-center bg-[#EA8491] rounded-xl px-3 py-1.5 gap-1">
                <MapPin className="w-3 h-3 text-white" />
                <span className="text-white text-xs font-semibold">Map</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2 — Salon Name / Status / Tagline / Hours */}
        <div className="mx-4 mt-4">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-xl font-bold text-gray-900 leading-tight">{salon.shopName}</h1>
            <span className={`shrink-0 flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${(salon.isOpen ?? true) ? "text-emerald-600 bg-emerald-50" : "text-red-500 bg-red-50"}`}>
              <span className={`w-2 h-2 rounded-full ${(salon.isOpen ?? true) ? "bg-emerald-500" : "bg-red-500"}`} />
              {(salon.isOpen ?? true) ? "Open" : "Closed"}
            </span>
          </div>
          {salon.tagline && <p className="mt-1 text-sm text-gray-500">{salon.tagline}</p>}
          {salon.hours && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
              <Clock className="w-3 h-3 shrink-0" />
              <span>{salon.hours}</span>
            </div>
          )}
        </div>

        {/* 3 — Address Card */}
        <div className="mx-4 mt-4 border border-pink-200 rounded-2xl overflow-hidden bg-white">
          <div className="px-4 pt-3 pb-1">
            <span className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">Your Address</span>
          </div>
          <div className="flex items-center gap-3 px-4 pb-3">
            <div className="w-8 h-8 bg-rose-50 rounded-full flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-rose-500" />
            </div>
            <p className="flex-1 text-sm text-gray-800 font-medium leading-snug">
              {salon.location?.address || "Your location"}{salon.location?.city ? `, ${salon.location.city}` : ""}
            </p>
            <button className="text-rose-500 text-sm font-bold shrink-0">Edit</button>
          </div>
        </div>

        {/* 4 — About Us Accordion */}
        <div className="mx-4 mt-3 border border-pink-200 rounded-2xl overflow-hidden bg-white">
          <button onClick={() => setAboutOpen(!aboutOpen)} className="w-full flex items-center justify-between px-4 py-3.5">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 flex items-center justify-center bg-pink-100 rounded-full text-pink-500 font-bold text-sm">?</span>
              <span className="text-sm font-semibold text-gray-800">About Us</span>
            </div>
            {aboutOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>
          {aboutOpen && (
            <div className="px-4 pb-4 pt-1 text-xs text-gray-500 leading-relaxed border-t border-pink-100">
              {salon.aboutUs || "We provide premium beauty and wellness services tailored just for you."}
            </div>
          )}
        </div>

        {/* 5 — Gallery (commented out for now) */}
        {/* <div className="mx-4 mt-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900">Gallery</h2>
            <span className="text-[#EA8491] text-xs font-semibold">{salonImages.length} photos</span>
          </div>
          <div className="bg-white rounded-2xl overflow-hidden border border-pink-100" style={{ borderTopWidth: 2, borderTopColor: "#EA8491" }}>
            <div className="flex gap-1 p-2 pb-1">
              <div className="relative flex-1 rounded-xl overflow-hidden" style={{ height: 160 }}>
                <img src={salonImages[0]} alt="featured" className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 bg-[#EA8491] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">Featured</span>
              </div>
              <div className="flex-1 rounded-xl overflow-hidden" style={{ height: 160 }}>
                <img src={salonImages[1] || salonImages[0]} alt="gallery" className="w-full h-full object-cover" />
              </div>
            </div>
            {salonImages.length > 2 && (
              <div className="flex gap-1 px-2 pb-2">
                {salonImages.slice(2, 5).map((img, i) => (
                  <div key={i} className="flex-1 rounded-xl overflow-hidden" style={{ height: 90 }}>
                    <img src={img} alt={`gallery-${i}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div> */}

        {/* 5 — Our Services (category circles) */}
        <div className="mx-4 mt-5">
          <h2 className="text-sm font-bold text-gray-900 mb-3">Our Services</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 px-1 pt-1" style={{ scrollbarWidth: "none" }}>
            {categories.map((cat) => {
              const isActive = activeCategory === cat._id;
              return (
                <button key={cat._id} onClick={() => setActiveCategory(cat._id)} className="flex flex-col items-center gap-1.5 shrink-0">
                  <div className={`w-16 h-16 rounded-full overflow-hidden shadow-md transition-all ${isActive ? "ring-[3px] ring-[#EA8491] ring-offset-2" : "ring-[2px] ring-gray-200"}`}>
                    <img src={getCategoryImage(cat.name)} alt={cat.name} className="w-full h-full object-cover" />
                  </div>
                  <span className={`text-[11px] font-semibold text-center ${isActive ? "text-[#EA8491]" : "text-gray-600"}`}>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 6 — Booking Mode Toggle */}
        <div className="mx-4 mt-4">
          <div className="flex bg-white rounded-full p-1.5 shadow-sm border border-gray-100">
            {salon.homeService && (
              <button
                onClick={() => setServiceMode("home")}
                className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${serviceMode === "home" ? "bg-[#EA8491] text-white shadow" : "text-gray-500"}`}
              >
                Salon at Home
              </button>
            )}
            <button
              onClick={() => setServiceMode("salon")}
              className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${serviceMode === "salon" ? "bg-[#EA8491] text-white shadow" : "text-gray-500"}`}
            >
              Visit Salon
            </button>
          </div>
        </div>

        {/* 8 — All Services List */}
        <div className="mx-4 mt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900">All Services</h2>
            <div className="bg-gray-100 rounded-lg px-2.5 py-1">
              <span className="text-gray-500 text-xs font-medium">{filteredMobileServices.length} total</span>
            </div>
          </div>
          {/* Search bar */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-2">
              <Search size={14} color="#9ca3af" />
              <input
                type="text"
                placeholder="Search for a service..."
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
                className="flex-1 text-xs outline-none bg-transparent text-gray-700 placeholder-gray-400"
              />
            </div>
            <button className="w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center">
              <SlidersHorizontal size={15} color="#EA8491" />
            </button>
          </div>
          {/* Services card with pink top border like app */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 overflow-hidden" style={{ borderTopWidth: 2, borderTopColor: "#EA8491" }}>
            {filteredMobileServices.length > 0 ? filteredMobileServices.map((service) => {
              const price = serviceMode === "home" && service.homePrice != null ? service.homePrice : service.salonPrice || service.price || 0;
              const inCart = isMobileServiceInCart(service._id);
              const unavailable = serviceMode === "home" && service.serviceMode === "salon";
              return (
                <div key={service._id} className={`flex items-center gap-3 py-4 border-b border-gray-50 last:border-0 ${unavailable ? "opacity-40" : ""}`}>
                  {/* Thumbnail */}
                  <div className="w-[60px] h-[60px] rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                    <img src={getServiceImage(service.name)} alt={service.name} className="w-full h-full object-cover" />
                  </div>
                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                      <span className="text-gray-900 font-semibold text-sm">{service.name}</span>
                      {service.badge && (
                        <span className="bg-amber-50 border border-amber-100 rounded-md px-1.5 py-0.5 text-amber-600 text-[10px] font-bold">{service.badge}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-400 text-xs">{service.duration || formatDuration(service.durationMins)}</span>
                    </div>
                    <span className="text-gray-900 font-bold text-sm">₹{price?.toLocaleString?.() || price}</span>
                  </div>
                  {/* CTA */}
                  {!unavailable ? (
                    <button
                      onClick={() => {
                        if (inCart) {
                          mobileRemoveParentAndSubs(service._id);
                        } else {
                          // Open sub-service bottom sheet if sub-services exist
                          const subs = SUB_SERVICES[service._id];
                          if (subs && subs.length > 0) {
                            setSubSheet({ service, subServices: subs });
                            setSelectedSubs({});
                          } else {
                            mobileAddToCart(service);
                          }
                        }
                      }}
                      className={`shrink-0 px-4 py-2 rounded-xl border text-xs font-bold transition-all active:scale-95 ${inCart ? "bg-[#EA8491] border-[#EA8491] text-white" : "bg-white border-[#EA8491] text-[#EA8491]"
                        }`}
                    >
                      {inCart ? "✓ Added" : "+ Add"}
                    </button>
                  ) : (
                    <div className="shrink-0 bg-gray-100 rounded-lg px-2.5 py-1.5">
                      <span className="text-gray-400 text-[10px] font-semibold">Salon only</span>
                    </div>
                  )}
                </div>
              );
            }) : (
              <div className="py-10 flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-3xl text-gray-300">✂</span>
                </div>
                <span className="text-gray-400 text-sm font-medium">No services in this category</span>
              </div>
            )}
          </div>
        </div>

        {/* 8 — Customer Reviews */}
        <div className="mx-4 mt-6 mb-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" style={{ borderTopWidth: 2, borderTopColor: "#EA8491" }}>
            {/* Header */}
            <div className="px-4 pt-4 pb-3 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Customer Reviews</h3>
              <button className="text-[#EA8491] text-xs font-semibold flex items-center gap-0.5">
                See all <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            {/* Amber rating banner */}
            <div className="mx-4 mb-3 bg-amber-50 rounded-xl px-4 py-3 flex items-center gap-3">
              <span className="text-4xl font-bold text-amber-500 leading-none">{mobileAvgRating}</span>
              <div className="flex flex-col gap-1">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className={`w-[15px] h-[15px] ${s <= mobileFullStars ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`} />
                  ))}
                </div>
                <span className="text-xs text-amber-700 font-medium">
                  Based on {mobileReviews.length} review{mobileReviews.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
            <div className="h-px bg-gray-50 mx-4" />
            {/* Review rows — show first 2 like app */}
            {mobileReviews.slice(0, 2).map((review, i) => (
              <div key={review.id || i} className={`flex items-start px-4 py-3.5 gap-3 ${i < 1 ? "border-b border-gray-50" : ""}`}>
                <div className="w-9 h-9 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                  {review.userAvatar
                    ? <img src={review.userAvatar} alt={review.userName} className="w-full h-full object-cover" />
                    : <span className="text-sm font-bold text-gray-500">{(review.userName || review.name)?.charAt(0)?.toUpperCase()}</span>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-800">{review.userName || review.name}</span>
                    <div className="flex gap-px">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} className={`w-[10px] h-[10px] ${s <= review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 leading-4">{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 9 — Fixed Bottom Cart Bar */}
        <div className="fixed bottom-16 left-0 right-0 z-40 bg-white px-4 pt-3 pb-3 border-t border-gray-100 shadow-lg">
          {mobileCartCount > 0 ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/cart")}
                className="flex-1 bg-[#EA8491] rounded-2xl flex items-center justify-between px-5 py-4 active:opacity-90 transition-opacity"
              >
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 rounded-lg px-2 py-0.5">
                    <span className="text-white text-xs font-bold">{mobileCartCount} {mobileCartCount === 1 ? "service" : "services"}</span>
                  </div>
                  <span className="text-white text-base font-semibold">₹{mobileCartTotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-white font-bold text-base">Continue</span>
                  <ChevronRight className="w-4 h-4 text-white" />
                </div>
              </button>
              {/* Clear cart button */}
              <button
                onClick={mobileClearCart}
                className="w-11 h-11 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 py-4 flex items-center justify-center gap-2">
              <ShoppingCart className="w-5 h-5 text-gray-300" />
              <span className="text-gray-400 font-semibold text-sm">Select a service to continue</span>
            </div>
          )}
        </div>

        {/* ── Sub-Service Bottom Sheet ── */}
        {subSheet && (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center"
            style={{ background: "rgba(0,0,0,0.45)" }}
            onClick={() => setSubSheet(null)}
          >
            <div
              className="w-full bg-white rounded-t-3xl overflow-hidden shadow-2xl"
              style={{ maxHeight: "82vh" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-gray-200" />
              </div>

              {/* Header */}
              <div className="flex items-start justify-between px-5 pt-2 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{subSheet.service.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {subSheet.subServices.length} options • {subSheet.service.duration}
                  </p>
                  <p className="text-xs text-gray-400">Select one or more sub-services to add</p>
                </div>
                <button
                  onClick={() => setSubSheet(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mt-1 shrink-0"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Sub-service list */}
              <div className="overflow-y-auto px-4 pb-4" style={{ maxHeight: "52vh" }}>
                {subSheet.subServices.map((sub) => {
                  const checked = !!selectedSubs[sub._id];
                  return (
                    <button
                      key={sub._id}
                      onClick={() =>
                        setSelectedSubs((prev) => ({ ...prev, [sub._id]: !prev[sub._id] }))
                      }
                      className={`w-full flex items-center gap-3 rounded-2xl px-3 py-3 mb-2 border transition-all ${checked
                        ? "bg-pink-50 border-[#EA8491]"
                        : "bg-white border-gray-100"
                        }`}
                    >
                      {/* Thumbnail */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-pink-100 shrink-0">
                        {sub.image ? (
                          <img src={sub.image} alt={sub.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-2xl">✂️</span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 text-left">
                        <p className="text-sm font-semibold text-gray-900">{sub.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{sub.duration}</p>
                      </div>

                      {/* Price + checkbox */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="text-sm font-bold text-gray-900">₹{sub.price}</span>
                        <div
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${checked
                            ? "bg-[#EA8491] border-[#EA8491]"
                            : "border-gray-300 bg-white"
                            }`}
                        >
                          {checked && (
                            <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                              <path d="M1 4L4 7.5L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Footer — selected count + Add to Cart */}
              {(() => {
                const selectedList = subSheet.subServices.filter((s) => selectedSubs[s._id]);
                const total = selectedList.reduce((sum, s) => sum + s.price, 0);
                return (
                  <div className="px-4 pt-2 pb-24 border-t border-gray-100">
                    {selectedList.length > 0 && (
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-gray-500 font-medium">
                          {selectedList.length} selected
                        </span>
                        <span className="text-sm font-bold text-gray-900">₹{total}</span>
                      </div>
                    )}
                    <button
                      disabled={selectedList.length === 0}
                      onClick={() => {
                        // Add each selected sub-service as a separate cart item
                        selectedList.forEach((sub) => {
                          mobileAddToCart({
                            ...subSheet.service,
                            _id: sub._id,
                            name: `${subSheet.service.name} – ${sub.name}`,
                            salonPrice: sub.price,
                            homePrice: sub.price + 100,
                            duration: sub.duration,
                          });
                        });
                        setSubSheet(null);
                        setSelectedSubs({});
                      }}
                      className={`w-full py-4 rounded-2xl text-base font-bold transition-all ${selectedList.length > 0
                        ? "bg-[#EA8491] text-white active:scale-95"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                      {selectedList.length > 0
                        ? `Add ${selectedList.length} to Cart`
                        : "Select services to add"}
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════
        DESKTOP / TABLET VIEW  (≥768px) — original unchanged layout
        ══════════════════════════════════════════════════════════ */}
      <div className="hidden md:block w-full min-h-screen bg-pink-50/70">

        {/* ── Sticky Header Bar ── */}
        <div className="sticky top-0 z-50 bg-pink-50/90 backdrop-blur-lg border-b border-pink-100/50">
          <div className={`flex items-center justify-between ${PX} py-3`}>
            {/* Back button */}
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-pink-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
            </button>

            {/* Salon name */}
            <h1 className="text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 truncate max-w-[60%]">
              {salon.shopName}
            </h1>

            {/* Favourite toggle */}
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-pink-100 transition-colors"
            >
              <Heart
                className={`w-5 h-5 md:w-6 md:h-6 transition-colors ${isFavorited
                  ? "text-rose-500 fill-rose-500"
                  : "text-rose-400 fill-rose-400"
                  }`}
              />
            </button>
          </div>
        </div>

        {/* ── Hero Image ── */}
        <div className="relative w-full h-52 sm:h-60 md:h-72 lg:h-80 xl:h-[24rem] overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={
              salon.coverImage ||
              salon.galleryImages?.[0] ||
              "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop"
            }
            alt={salon.shopName}
          />

          {/* Gradient overlay to make text readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Rating · Distance · View on Map — overlaid at the bottom of the image */}
          <div className={`absolute bottom-0 left-0 right-0 ${PX} pb-4 md:pb-5`}>
            <div className="flex items-center gap-2 md:gap-3 text-white text-xs md:text-sm lg:text-base font-medium flex-wrap">

              {/* Rating badge */}
              <div className="flex items-center gap-1.5">
                <span className="bg-amber-500 text-white text-[11px] md:text-xs px-2 py-0.5 md:px-2.5 md:py-1 rounded-full font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-white" />
                  {salon.rating || "4.5"}
                </span>
                <span className="text-white/90">
                  ({salon.reviewCount || "120"} Reviews)
                </span>
              </div>

              <span className="text-white/40">|</span>

              {/* Distance */}
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{salon.distance || "2.3"} km away</span>
              </div>

              <span className="text-white/40">|</span>

              {/* Map link */}
              <NavLink
                to="map"
                className="flex items-center gap-1 text-white/95 hover:text-white hover:underline"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>View on Map</span>
              </NavLink>
            </div>
          </div>
        </div>

        {/* ── Content Panel (sits below the hero image) ── */}
        <div className="bg-pink-50/80 rounded-t-3xl -mt-5 relative z-10">

          {/* ── Salon Name + Open Badge + Tagline + Hours ── */}
          <div className={`${PX} pt-5 md:pt-6 pb-4 border-b border-pink-100`}>

            {/* Name row */}
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                {salon.shopName}
              </h1>
              {/* Open / Closed badge */}
              <span
                className={`shrink-0 flex items-center gap-1.5 text-xs md:text-sm font-bold px-3 py-1 rounded-full ${(salon.isOpen ?? true)
                  ? "text-emerald-600 bg-emerald-50"
                  : "text-red-500 bg-red-50"
                  }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${(salon.isOpen ?? true) ? "bg-emerald-500" : "bg-red-500"
                    }`}
                />
                {(salon.isOpen ?? true) ? "Open" : "Closed"}
              </span>
            </div>

            {/* Tagline */}
            {salon.tagline && (
              <p className="mt-1 text-sm md:text-base text-gray-500">{salon.tagline}</p>
            )}

            {/* Business hours */}
            {salon.hours && (
              <div className="flex items-center gap-1.5 mt-2 text-xs md:text-sm text-gray-500">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>{salon.hours}</span>
              </div>
            )}
          </div>

          {/* ── YOUR ADDRESS Card ── */}
          <div className={`${PX} pt-4 pb-3`}>
            <div className="border border-pink-200 rounded-2xl overflow-hidden">
              {/* Card label */}
              <div className="px-4 pt-3 pb-1">
                <span className="text-[10px] md:text-xs font-semibold tracking-widest text-gray-400 uppercase">
                  Your Address
                </span>
              </div>
              {/* Address row */}
              <div className="flex items-center gap-3 px-4 pb-3">
                <div className="w-8 h-8 md:w-9 md:h-9 bg-rose-50 rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-rose-500" />
                </div>
                <p className="flex-1 text-sm md:text-base text-gray-800 font-medium leading-snug">
                  {salon.location?.address || "Your location"}
                  {salon.location?.city ? `, ${salon.location.city}` : ""}
                </p>
                <button className="text-rose-500 text-sm md:text-base font-bold hover:underline shrink-0">
                  Edit
                </button>
              </div>
            </div>
          </div>

          {/* ── About Us Accordion ── */}
          <div className={`${PX} pt-1 pb-4`}>
            <div className="border border-pink-200 rounded-2xl overflow-hidden">
              <button
                onClick={() => setAboutOpen(!aboutOpen)}
                className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-pink-50/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 flex items-center justify-center bg-pink-100 rounded-full text-pink-500 font-bold text-sm">?</span>
                  <span className="text-sm md:text-base font-semibold text-gray-800">About Us</span>
                </div>
                {aboutOpen
                  ? <ChevronUp className="w-4 h-4 text-gray-400" />
                  : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>
              {/* Collapsible content */}
              {aboutOpen && (
                <div className="px-4 pb-4 pt-1 text-xs md:text-sm text-gray-500 leading-relaxed border-t border-pink-100">
                  {salon.aboutUs || "We provide premium beauty and wellness services tailored just for you."}
                </div>
              )}
            </div>
          </div>

          {/* ── Our Services Section ── */}
          <div className={`${PX} pt-5 pb-2 md:pt-6`}>
            <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4">
              Our Services
            </h2>

            {/* Category Circles — horizontally scrollable */}
            {categories.length > 0 && (
              <div className="flex gap-5 md:gap-6 lg:gap-8 overflow-x-auto no-scrollbar pb-2">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat._id;
                  return (
                    <button
                      key={cat._id}
                      onClick={() => setActiveCategory(cat._id)}
                      className="flex flex-col items-center gap-1.5 shrink-0 focus:outline-none"
                    >
                      {/* Circle image with active ring */}
                      <div
                        className={`w-16 h-16 md:w-[4.5rem] md:h-[4.5rem] lg:w-20 lg:h-20 rounded-full overflow-hidden shadow-md transition-all duration-300 ${isActive
                          ? "ring-[3px] ring-rose-400 ring-offset-2"
                          : "ring-[2px] ring-gray-200"
                          }`}
                      >
                        <img
                          src={getCategoryImage(cat.name)}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span
                        className={`text-[11px] md:text-xs lg:text-sm font-semibold text-center transition-colors ${isActive ? "text-rose-500" : "text-gray-600"
                          }`}
                      >
                        {cat.name}
                      </span>
                    </button>
                  );
                })}

                {/* "More" circle — image-based to match other category circles */}
                <button className="flex flex-col items-center gap-1.5 shrink-0 focus:outline-none">
                  <div className="w-16 h-16 md:w-[4.5rem] md:h-[4.5rem] lg:w-20 lg:h-20 rounded-full overflow-hidden shadow-md ring-[2px] ring-gray-200">
                    <img
                      src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&h=200&fit=crop&crop=face"
                      alt="More"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[11px] md:text-xs lg:text-sm font-semibold text-gray-600 text-center">
                    More
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* ── Service Mode Toggle (Home / Visit Salon) ── */}
          <div className={`${PX} py-4`}>
            <div className="inline-flex bg-white rounded-full p-1 shadow-sm border border-gray-100">

              {/* "Salon at Home" option — only shown if salon offers home service */}
              {salon.homeService && (
                <button
                  onClick={() => setServiceMode("home")}
                  className={`px-6 md:px-8 py-2.5 rounded-full text-sm md:text-base font-bold transition-all duration-300 ${serviceMode === "home"
                    ? "bg-teal-600 text-white shadow-md"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  Salon at Home
                </button>
              )}

              {/* "Visit Salon" option — always shown */}
              <button
                onClick={() => setServiceMode("salon")}
                className={`px-6 md:px-8 py-2.5 rounded-full text-sm md:text-base font-bold transition-all duration-300 ${serviceMode === "salon"
                  ? "bg-teal-600 text-white shadow-md"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Visit Salon
              </button>
            </div>
          </div>

          {/* ── Navigation Tabs ── */}
          <div className="sticky top-[57px] z-40 bg-white/95 backdrop-blur-md border-y border-gray-100">
            <div className={`flex overflow-x-auto no-scrollbar ${PX} gap-1`}>
              {[
                { to: "services", label: "Services" },
                { to: "gallery", label: "Gallery" },
                { to: "map", label: "Map & Location" },
                { to: "reviews", label: "Reviews" },
                { to: "specialists", label: "Specialists" },
              ].map((tab) => (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  className={({ isActive }) =>
                    `px-5 py-3.5 text-sm md:text-base font-bold whitespace-nowrap transition-all duration-200 border-b-2 ${isActive
                      ? "text-rose-500 border-rose-500"
                      : "text-gray-400 border-transparent hover:text-gray-600"
                    }`
                  }
                >
                  {tab.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* ── All Services Heading Row ── */}
          <div className={`${PX} pt-5 pb-2 flex items-center justify-between`}>
            <h2 className="text-base md:text-lg font-bold text-gray-900">
              All Services
            </h2>
            {/* Shows active category name + item count */}
            <button className="flex items-center gap-1 text-xs md:text-sm text-gray-500 font-medium">
              {activeCatName} {itemCount} Items
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* ── Tab Content Area (child routes rendered here) ── */}
          <div className={`${PX} pb-6 md:pb-8 min-h-[400px]`}>
            <Outlet
              context={{
                saloonDetails: salon,
                serviceMode,
                activeCategory,
                setActiveCategory,
              }}
            />
          </div>
        </div>
      </div>

    </> /* end mobile+desktop fragment */
  );
};

export default HomeSaloonsDetails;