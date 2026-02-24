import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSaloonDetailsById } from "../../../redux/slice/userSlice";
import {
  ArrowLeft,
  Heart,
  Star,
  MapPin,
  ChevronDown,
  Pencil,
  Sparkles,
} from "lucide-react";

// ─── Fallback Data ─────────────────────────────────────────────────────────────
// Used for placeholder/demo salon IDs (e.g. when navigating from home page cards).

const FALLBACK_SALON = {
  _id: "demo",
  shopName: "Glamour Salon & Spa",
  coverImage:
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop",
  galleryImages: [
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1521590832167-7228fcb728e7?w=400&h=300&fit=crop",
  ],
  location: {
    address: "Gomti Nagar",
    city: "Lucknow",
    state: "Uttar Pradesh",
    pincode: "226010",
  },
  homeService: true,
  rating: "4.5",
  reviewCount: "120",
  distance: "2.3",
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

  // Derived values for the services heading
  const itemCount = serviceItems?.length || 0;
  const activeCatName = categories.find((c) => c._id === activeCategory)?.name || "Cat";

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
    <div className="w-full min-h-screen bg-pink-50/70">

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

        {/* ── Address Row ── */}
        <div className={`${PX} pt-6 md:pt-7 pb-4 md:pb-5 border-b border-pink-100`}>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-rose-50 rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-4 h-4 md:w-5 md:h-5 text-rose-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm md:text-base lg:text-lg text-gray-800 font-medium leading-snug">
                You are booking from:{" "}
                <span className="text-gray-900 font-bold">
                  {salon.location?.address || "Your location"}
                  {salon.location?.city ? `, ${salon.location.city}` : ""}
                </span>
              </p>
              {/* Home service note */}
              {salon.homeService && (
                <p className="text-xs md:text-sm text-gray-400 mt-1">
                  For home service, professional will visit this address.
                </p>
              )}
            </div>
            <button className="flex items-center gap-1.5 text-rose-500 text-xs md:text-sm font-bold border border-rose-200 rounded-xl px-3 md:px-4 py-1.5 md:py-2 hover:bg-rose-50 transition-colors shrink-0">
              <Pencil className="w-3 h-3 md:w-3.5 md:h-3.5" /> Edit
            </button>
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

              {/* "More" placeholder circle */}
              <button className="flex flex-col items-center gap-1.5 shrink-0 focus:outline-none">
                <div className="w-16 h-16 md:w-[4.5rem] md:h-[4.5rem] lg:w-20 lg:h-20 rounded-full bg-gray-100 flex items-center justify-center ring-[2px] ring-gray-200 shadow-md">
                  <span className="text-xs font-bold text-gray-500">Mo</span>
                </div>
                <span className="text-[11px] md:text-xs lg:text-sm font-semibold text-gray-500 text-center">
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
                  ? "bg-gradient-to-r from-rose-400 to-pink-400 text-white shadow-md"
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
                ? "bg-gradient-to-r from-rose-400 to-pink-400 text-white shadow-md"
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
  );
};

export default HomeSaloonsDetails;