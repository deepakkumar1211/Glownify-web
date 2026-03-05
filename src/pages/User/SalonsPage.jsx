import { useSelector, useDispatch } from "react-redux";
import {
  fetchAllSalonsByCategory,
  fetchAllFeaturedSaloons,
  setSelectedCategory,
} from "../../redux/slice/userSlice";
import { useEffect, useState, useMemo } from "react";
import { MapPin, Star, RefreshCw, Frown, Search, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// ─── Dummy Data ─────────────────────────────────────────────────────────────────
// 30 realistic-looking nearby salons used when the API returns 0 results or fails.
// Each entry mirrors the shape the API normally returns so the same SalonCard works.

const DUMMY_SALONS_WOMEN = [
  { _id: "d-w-1", shopName: "Evita Beauty Parlour", galleryImages: ["https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop"], distanceInMeters: 320, rating: "4.8", reviewCount: 210, salonCategory: "women", location: { address: "12 Rose Ave", city: "Mumbai" } },
  { _id: "d-w-2", shopName: "Refine Glow Salon", galleryImages: ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop"], distanceInMeters: 870, rating: "4.7", reviewCount: 185, salonCategory: "women", location: { address: "7 Silk Road", city: "Mumbai" } },
  { _id: "d-w-3", shopName: "Glamour Studio", galleryImages: ["https://images.unsplash.com/photo-1521590832167-7228fcb728e7?w=400&h=300&fit=crop"], distanceInMeters: 1200, rating: "4.6", reviewCount: 145, salonCategory: "women", location: { address: "34 Park Lane", city: "Mumbai" } },
  { _id: "d-w-4", shopName: "Bliss Beauty Bar", galleryImages: ["https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&h=300&fit=crop"], distanceInMeters: 1550, rating: "4.9", reviewCount: 310, salonCategory: "women", location: { address: "22 Lotus St", city: "Mumbai" } },
  { _id: "d-w-5", shopName: "Pearl Skin Studio", galleryImages: ["https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop"], distanceInMeters: 2100, rating: "4.5", reviewCount: 98, salonCategory: "women", location: { address: "5 Coral Blvd", city: "Mumbai" } },
  { _id: "d-w-6", shopName: "The Velvet Room", galleryImages: ["https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop"], distanceInMeters: 2600, rating: "4.8", reviewCount: 270, salonCategory: "women", location: { address: "9 Jasmine Rd", city: "Mumbai" } },
  { _id: "d-w-7", shopName: "Aura Wellness & Beauty", galleryImages: ["https://images.unsplash.com/photo-1487412947147-5cebf100d7fb?w=400&h=300&fit=crop"], distanceInMeters: 3000, rating: "4.7", reviewCount: 190, salonCategory: "women", location: { address: "17 Orchid Ave", city: "Mumbai" } },
  { _id: "d-w-8", shopName: "Glow Aesthetics", galleryImages: ["https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=400&h=300&fit=crop"], distanceInMeters: 3500, rating: "4.6", reviewCount: 160, salonCategory: "women", location: { address: "3 Maple St", city: "Mumbai" } },
  { _id: "d-w-9", shopName: "Luxe Lash & Beauty", galleryImages: ["https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=300&fit=crop"], distanceInMeters: 4000, rating: "4.8", reviewCount: 220, salonCategory: "women", location: { address: "28 Silver Lane", city: "Mumbai" } },
  { _id: "d-w-10", shopName: "Serenity Beauty Lounge", galleryImages: ["https://images.unsplash.com/photo-1607008829749-c0f284a49fc4?w=400&h=300&fit=crop"], distanceInMeters: 4200, rating: "4.5", reviewCount: 130, salonCategory: "women", location: { address: "11 Seashore Rd", city: "Mumbai" } },
  { _id: "d-w-11", shopName: "Radiance Skin Clinic", galleryImages: ["https://images.unsplash.com/photo-1520338801623-3f9e6b5d7e94?w=400&h=300&fit=crop"], distanceInMeters: 5100, rating: "4.9", reviewCount: 340, salonCategory: "women", location: { address: "6 Ivory Tower", city: "Mumbai" } },
  { _id: "d-w-12", shopName: "Charm & Chic Salon", galleryImages: ["https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400&h=300&fit=crop"], distanceInMeters: 5600, rating: "4.7", reviewCount: 175, salonCategory: "women", location: { address: "14 Gold Sq", city: "Mumbai" } },
  { _id: "d-w-13", shopName: "Posh Parlour", galleryImages: ["https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop"], distanceInMeters: 6000, rating: "4.6", reviewCount: 155, salonCategory: "women", location: { address: "2 Diamond St", city: "Mumbai" } },
  { _id: "d-w-14", shopName: "Divine Beauty Salon", galleryImages: ["https://images.unsplash.com/photo-1521590832167-7228fcb728e7?w=400&h=300&fit=crop"], distanceInMeters: 6500, rating: "4.8", reviewCount: 200, salonCategory: "women", location: { address: "20 Sapphire Rd", city: "Mumbai" } },
  { _id: "d-w-15", shopName: "Essence Spa & Beauty", galleryImages: ["https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop"], distanceInMeters: 7000, rating: "4.5", reviewCount: 120, salonCategory: "women", location: { address: "8 Amber Lane", city: "Mumbai" } },
  { _id: "d-w-16", shopName: "Shine & Style Salon", galleryImages: ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop"], distanceInMeters: 7500, rating: "4.7", reviewCount: 195, salonCategory: "women", location: { address: "33 Topaz Ave", city: "Mumbai" } },
  { _id: "d-w-17", shopName: "Curls & Curls", galleryImages: ["https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=400&h=300&fit=crop"], distanceInMeters: 8100, rating: "4.6", reviewCount: 148, salonCategory: "women", location: { address: "45 Ruby Rd", city: "Mumbai" } },
  { _id: "d-w-18", shopName: "Mist Beauty Salon", galleryImages: ["https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&h=300&fit=crop"], distanceInMeters: 8700, rating: "4.8", reviewCount: 230, salonCategory: "women", location: { address: "16 Emerald Blvd", city: "Mumbai" } },
  { _id: "d-w-19", shopName: "Bloom Beauty Studio", galleryImages: ["https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop"], distanceInMeters: 9200, rating: "4.9", reviewCount: 295, salonCategory: "women", location: { address: "7 Opal Cres", city: "Mumbai" } },
  { _id: "d-w-20", shopName: "Elite Glamour Salon", galleryImages: ["https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop"], distanceInMeters: 9800, rating: "4.7", reviewCount: 210, salonCategory: "women", location: { address: "30 Onyx St", city: "Mumbai" } },
  { _id: "d-w-21", shopName: "Glam & Groove", galleryImages: ["https://images.unsplash.com/photo-1487412947147-5cebf100d7fb?w=400&h=300&fit=crop"], distanceInMeters: 10500, rating: "4.6", reviewCount: 165, salonCategory: "women", location: { address: "22 Pearl Way", city: "Mumbai" } },
  { _id: "d-w-22", shopName: "Soft Touch Beauty", galleryImages: ["https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=300&fit=crop"], distanceInMeters: 11200, rating: "4.8", reviewCount: 245, salonCategory: "women", location: { address: "4 Crystal Rd", city: "Mumbai" } },
  { _id: "d-w-23", shopName: "Heaven Hair & Beauty", galleryImages: ["https://images.unsplash.com/photo-1607008829749-c0f284a49fc4?w=400&h=300&fit=crop"], distanceInMeters: 12000, rating: "4.5", reviewCount: 110, salonCategory: "women", location: { address: "18 Marble St", city: "Mumbai" } },
  { _id: "d-w-24", shopName: "Bridal Blossom Salon", galleryImages: ["https://images.unsplash.com/photo-1520338801623-3f9e6b5d7e94?w=400&h=300&fit=crop"], distanceInMeters: 12600, rating: "4.9", reviewCount: 360, salonCategory: "women", location: { address: "10 Quartz Lane", city: "Mumbai" } },
  { _id: "d-w-25", shopName: "Natura Beauty Bar", galleryImages: ["https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400&h=300&fit=crop"], distanceInMeters: 13500, rating: "4.7", reviewCount: 188, salonCategory: "women", location: { address: "26 Slate Blvd", city: "Mumbai" } },
  { _id: "d-w-26", shopName: "Golden Touch Salon", galleryImages: ["https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop"], distanceInMeters: 14000, rating: "4.6", reviewCount: 157, salonCategory: "women", location: { address: "39 Bronze Ave", city: "Mumbai" } },
  { _id: "d-w-27", shopName: "Pink Rose Beauty", galleryImages: ["https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop"], distanceInMeters: 14800, rating: "4.8", reviewCount: 215, salonCategory: "women", location: { address: "5 Copper Cres", city: "Mumbai" } },
  { _id: "d-w-28", shopName: "Sparkle Beauty Salon", galleryImages: ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop"], distanceInMeters: 15500, rating: "4.5", reviewCount: 135, salonCategory: "women", location: { address: "13 Silver Oak Rd", city: "Mumbai" } },
  { _id: "d-w-29", shopName: "Nailfection Studio", galleryImages: ["https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop"], distanceInMeters: 16200, rating: "4.7", reviewCount: 177, salonCategory: "women", location: { address: "21 Walnut St", city: "Mumbai" } },
  { _id: "d-w-30", shopName: "Timeless Beauty Salon", galleryImages: ["https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&h=300&fit=crop"], distanceInMeters: 17000, rating: "4.9", reviewCount: 310, salonCategory: "women", location: { address: "8 Birch Lane", city: "Mumbai" } },
];

const DUMMY_SALONS_MEN = [
  { _id: "d-m-1", shopName: "Royal Cuts", galleryImages: ["https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop"], distanceInMeters: 500, rating: "4.9", reviewCount: 320, salonCategory: "men", location: { address: "1 King St", city: "Mumbai" } },
  { _id: "d-m-2", shopName: "Urban Style Barbers", galleryImages: ["https://images.unsplash.com/photo-1585747860019-8e8ef3f0e6c4?w=400&h=300&fit=crop"], distanceInMeters: 1100, rating: "4.7", reviewCount: 180, salonCategory: "men", location: { address: "15 Emperor Rd", city: "Mumbai" } },
  { _id: "d-m-3", shopName: "The Fade Factory", galleryImages: ["https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop"], distanceInMeters: 2000, rating: "4.8", reviewCount: 240, salonCategory: "men", location: { address: "7 Knight Ave", city: "Mumbai" } },
  { _id: "d-m-4", shopName: "Sharp Blades Salon", galleryImages: ["https://images.unsplash.com/photo-1585747860019-8e8ef3f0e6c4?w=400&h=300&fit=crop"], distanceInMeters: 3200, rating: "4.6", reviewCount: 145, salonCategory: "men", location: { address: "22 Duke St", city: "Mumbai" } },
  { _id: "d-m-5", shopName: "The Grooming Lounge", galleryImages: ["https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop"], distanceInMeters: 4500, rating: "4.5", reviewCount: 115, salonCategory: "men", location: { address: "9 Baron Blvd", city: "Mumbai" } },
  { _id: "d-m-6", shopName: "Maverick Barber Shop", galleryImages: ["https://images.unsplash.com/photo-1585747860019-8e8ef3f0e6c4?w=400&h=300&fit=crop"], distanceInMeters: 5800, rating: "4.7", reviewCount: 190, salonCategory: "men", location: { address: "3 Count Cres", city: "Mumbai" } },
  { _id: "d-m-7", shopName: "Dapper Den", galleryImages: ["https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop"], distanceInMeters: 7200, rating: "4.8", reviewCount: 260, salonCategory: "men", location: { address: "18 Marquis Rd", city: "Mumbai" } },
  { _id: "d-m-8", shopName: "Classic Cuts Studio", galleryImages: ["https://images.unsplash.com/photo-1585747860019-8e8ef3f0e6c4?w=400&h=300&fit=crop"], distanceInMeters: 8900, rating: "4.6", reviewCount: 155, salonCategory: "men", location: { address: "11 Earl St", city: "Mumbai" } },
  { _id: "d-m-9", shopName: "Razor Edge Barbers", galleryImages: ["https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop"], distanceInMeters: 10100, rating: "4.9", reviewCount: 340, salonCategory: "men", location: { address: "5 Sir Lane", city: "Mumbai" } },
  { _id: "d-m-10", shopName: "The Gentleman's Club", galleryImages: ["https://images.unsplash.com/photo-1585747860019-8e8ef3f0e6c4?w=400&h=300&fit=crop"], distanceInMeters: 11700, rating: "4.7", reviewCount: 205, salonCategory: "men", location: { address: "30 Regent St", city: "Mumbai" } },
  // Continuing to 30 by reusing a few names with different locations
  { _id: "d-m-11", shopName: "Prestige Barber Room", galleryImages: ["https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop"], distanceInMeters: 12500, rating: "4.5", reviewCount: 125, salonCategory: "men", location: { address: "40 Crown Rd", city: "Mumbai" } },
  { _id: "d-m-12", shopName: "Alpha Grooming Hub", galleryImages: ["https://images.unsplash.com/photo-1585747860019-8e8ef3f0e6c4?w=400&h=300&fit=crop"], distanceInMeters: 13400, rating: "4.8", reviewCount: 280, salonCategory: "men", location: { address: "6 Throne Ave", city: "Mumbai" } },
  { _id: "d-m-13", shopName: "Bold & Brave Cuts", galleryImages: ["https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop"], distanceInMeters: 14200, rating: "4.6", reviewCount: 162, salonCategory: "men", location: { address: "15 Sceptre St", city: "Mumbai" } },
  { _id: "d-m-14", shopName: "The Shave Society", galleryImages: ["https://images.unsplash.com/photo-1585747860019-8e8ef3f0e6c4?w=400&h=300&fit=crop"], distanceInMeters: 15000, rating: "4.7", reviewCount: 198, salonCategory: "men", location: { address: "27 Orb Lane", city: "Mumbai" } },
  { _id: "d-m-15", shopName: "Beards & Beyond", galleryImages: ["https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop"], distanceInMeters: 15900, rating: "4.9", reviewCount: 315, salonCategory: "men", location: { address: "9 Mace Blvd", city: "Mumbai" } },
  { _id: "d-m-16", shopName: "Summit Barber Studio", galleryImages: ["https://images.unsplash.com/photo-1585747860019-8e8ef3f0e6c4?w=400&h=300&fit=crop"], distanceInMeters: 16700, rating: "4.6", reviewCount: 140, salonCategory: "men", location: { address: "35 Peak Rd", city: "Mumbai" } },
  { _id: "d-m-17", shopName: "Trim & Tidy", galleryImages: ["https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop"], distanceInMeters: 17500, rating: "4.8", reviewCount: 225, salonCategory: "men", location: { address: "4 Summit Ave", city: "Mumbai" } },
  { _id: "d-m-18", shopName: "Heritage Barbers", galleryImages: ["https://images.unsplash.com/photo-1585747860019-8e8ef3f0e6c4?w=400&h=300&fit=crop"], distanceInMeters: 18400, rating: "4.5", reviewCount: 118, salonCategory: "men", location: { address: "12 Valley Rd", city: "Mumbai" } },
  { _id: "d-m-19", shopName: "Modern Man Salon", galleryImages: ["https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop"], distanceInMeters: 19200, rating: "4.7", reviewCount: 183, salonCategory: "men", location: { address: "20 Ridge St", city: "Mumbai" } },
  { _id: "d-m-20", shopName: "The Style Collective", galleryImages: ["https://images.unsplash.com/photo-1585747860019-8e8ef3f0e6c4?w=400&h=300&fit=crop"], distanceInMeters: 20000, rating: "4.9", reviewCount: 345, salonCategory: "men", location: { address: "8 Cliff Ave", city: "Mumbai" } },
  { _id: "d-m-21", shopName: "Vogue Cuts", galleryImages: ["https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop"], distanceInMeters: 21000, rating: "4.6", reviewCount: 152, salonCategory: "men", location: { address: "3 Glen Rd", city: "Mumbai" } },
  { _id: "d-m-22", shopName: "Pixel Fade Studio", galleryImages: ["https://images.unsplash.com/photo-1585747860019-8e8ef3f0e6c4?w=400&h=300&fit=crop"], distanceInMeters: 22000, rating: "4.8", reviewCount: 268, salonCategory: "men", location: { address: "17 Meadow St", city: "Mumbai" } },
  { _id: "d-m-23", shopName: "Steel & Scissors", galleryImages: ["https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop"], distanceInMeters: 23000, rating: "4.7", reviewCount: 194, salonCategory: "men", location: { address: "25 Field Lane", city: "Mumbai" } },
  { _id: "d-m-24", shopName: "Ink & Clippers", galleryImages: ["https://images.unsplash.com/photo-1585747860019-8e8ef3f0e6c4?w=400&h=300&fit=crop"], distanceInMeters: 24000, rating: "4.5", reviewCount: 122, salonCategory: "men", location: { address: "11 Forest Ave", city: "Mumbai" } },
  { _id: "d-m-25", shopName: "The Clean Cut", galleryImages: ["https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop"], distanceInMeters: 25000, rating: "4.9", reviewCount: 332, salonCategory: "men", location: { address: "6 Brook Rd", city: "Mumbai" } },
  { _id: "d-m-26", shopName: "Kingdom Kuts", galleryImages: ["https://images.unsplash.com/photo-1585747860019-8e8ef3f0e6c4?w=400&h=300&fit=crop"], distanceInMeters: 26000, rating: "4.6", reviewCount: 158, salonCategory: "men", location: { address: "14 River St", city: "Mumbai" } },
  { _id: "d-m-27", shopName: "Blaze Barber Co.", galleryImages: ["https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop"], distanceInMeters: 27000, rating: "4.8", reviewCount: 235, salonCategory: "men", location: { address: "2 Creek Lane", city: "Mumbai" } },
  { _id: "d-m-28", shopName: "Craft & Comb", galleryImages: ["https://images.unsplash.com/photo-1585747860019-8e8ef3f0e6c4?w=400&h=300&fit=crop"], distanceInMeters: 28000, rating: "4.7", reviewCount: 208, salonCategory: "men", location: { address: "29 Pond Ave", city: "Mumbai" } },
  { _id: "d-m-29", shopName: "Next Level Cuts", galleryImages: ["https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop"], distanceInMeters: 29000, rating: "4.5", reviewCount: 128, salonCategory: "men", location: { address: "7 Lake Rd", city: "Mumbai" } },
  { _id: "d-m-30", shopName: "Grand Barber Palace", galleryImages: ["https://images.unsplash.com/photo-1585747860019-8e8ef3f0e6c4?w=400&h=300&fit=crop"], distanceInMeters: 30000, rating: "4.9", reviewCount: 380, salonCategory: "men", location: { address: "50 Ocean Blvd", city: "Mumbai" } },
];

/**
 * Returns dummy salons based on the selected category.
 * "all" merges both women and men lists (60 cards sorted by distance).
 */
const getDummySalons = (category) => {
  if (category === "men") return DUMMY_SALONS_MEN;
  if (category === "all") {
    // Merge both lists and sort by distance so nearest appears first
    return [...DUMMY_SALONS_WOMEN, ...DUMMY_SALONS_MEN].sort(
      (a, b) => (a.distanceInMeters ?? 0) - (b.distanceInMeters ?? 0)
    );
  }
  return DUMMY_SALONS_WOMEN; // default to women
};

// ─── Skeleton Card ─────────────────────────────────────────────────────────────

/**
 * SkeletonCard
 * Animated placeholder shown while salon data is loading.
 */
const SkeletonCard = () => (
  <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 animate-pulse">
    <div className="h-52 bg-gray-200" />
    <div className="p-5 space-y-3">
      <div className="h-5 bg-gray-200 rounded-full w-3/4" />
      <div className="h-4 bg-gray-100 rounded-full w-1/2" />
      <div className="flex gap-4 pt-2">
        <div className="h-3 bg-gray-100 rounded-full w-1/3" />
        <div className="h-3 bg-gray-100 rounded-full w-1/4" />
      </div>
      <div className="flex justify-end pt-2">
        <div className="h-8 w-24 bg-gray-200 rounded-full" />
      </div>
    </div>
  </div>
);

// ─── Salon Card ────────────────────────────────────────────────────────────────

/**
 * SalonCard
 * Renders a single salon listing with image, badge, name, distance, address,
 * and action buttons.
 *
 * @param {object}   salon           - Salon data from Redux/API or dummy data
 * @param {Function} onNavigate      - Called with salon._id when user clicks View/Book
 * @param {Function} formatDistance  - Formats distance in meters to a readable string
 */
const SalonCard = ({ salon, onNavigate, formatDistance }) => {
  // Determine if the salon is currently open based on its hours
  const isOpen = (() => {
    try {
      if (!salon.openingTime || !salon.closingTime) return null;
      const now = new Date();
      const [oh, om] = salon.openingTime.split(":").map(Number);
      const [ch, cm] = salon.closingTime.split(":").map(Number);
      const open = oh * 60 + om;
      const close = ch * 60 + cm;
      const cur = now.getHours() * 60 + now.getMinutes();
      return cur >= open && cur <= close;
    } catch {
      return null; // if parsing fails, don't show open/closed badge
    }
  })();

  // Best available image for the salon
  const imageUrl =
    salon.galleryImages?.[0] || salon.profileImage || salon.coverImage || null;

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col">

      {/* ── Card Image ── */}
      <div className="relative h-52 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={salon.shopName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          // Fallback icon when no image is available
          <Star size={40} className="text-indigo-200" strokeWidth={1} />
        )}

        {/* Category badge (top-left) */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-gray-100">
          <span className="text-[12px] font-black text-indigo-600 uppercase tracking-widest">
            {salon.salonCategory || salon.gender || "SALON"}
          </span>
        </div>

        {/* Open/Closed badge (top-right) — shown only when hours are available */}
        {isOpen !== null && (
          <div
            className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-bold shadow-sm ${isOpen ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
              }`}
          >
            {isOpen ? "Open" : "Closed"}
          </div>
        )}

        {/* Rating badge (top-right) — shown only when open/closed status is unavailable */}
        {isOpen === null && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm flex items-center gap-1 border border-gray-100">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            <span className="text-sm font-bold text-gray-700">
              {salon.rating || "4.8"}
            </span>
          </div>
        )}
      </div>

      {/* ── Card Content ── */}
      <div className="p-5 flex flex-col flex-1">

        {/* Salon name + rating (rating shown alongside name when hours are known) */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h2 className="text-xl font-bold text-gray-900 truncate">{salon.shopName}</h2>
          {isOpen !== null && (
            <div className="flex items-center gap-1 shrink-0">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <span className="text-sm font-bold text-gray-700">
                {salon.rating || "4.8"}
              </span>
            </div>
          )}
        </div>

        {/* Distance from user */}
        {(salon.distanceInMeters || salon.distance) && (
          <p className="text-xs font-semibold text-indigo-600 mb-3 flex items-center gap-1">
            <MapPin size={13} className="inline-block" />
            {salon.distanceInMeters
              ? formatDistance(salon.distanceInMeters)
              : `${salon.distance} km away`}
          </p>
        )}

        {/* Street address */}
        {salon.location?.address && (
          <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
            <MapPin size={12} />
            {salon.location.address}
            {salon.location.city ? `, ${salon.location.city}` : ""}
          </p>
        )}

        {/* Push footer to bottom */}
        <div className="flex-1" />

        {/* Footer: View + Book Visit buttons */}
        <div className="flex justify-between items-center border-t border-gray-50 pt-3 mt-2">
          <button
            onClick={() => onNavigate(salon._id)}
            className="text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-full transition-colors"
          >
            View
          </button>
          <button
            onClick={() => onNavigate(salon._id)}
            className="text-sm font-extrabold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Book Visit →
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────

/**
 * SalonsPage
 * ─────────────────────────────────────────────────────────────────────────────
 * Lists salons filtered by the selected category (from Redux state).
 *
 * Data priority (highest to lowest):
 *   1. API nearby salons  (fetchAllSalonsByCategory)
 *   2. Featured salons    (fetchAllFeaturedSaloons — fallback when nearby is empty)
 *   3. 30 dummy salons    (always shown if both API calls return empty or fail)
 *
 * Controls:
 *   - Sort toggle  : Nearest First ↔ Farthest First (sorts by distanceInMeters)
 *   - Name filter  : Real-time text search across salon names
 */
const SalonsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { salons, featuredSalons, selectedCategory, loading } = useSelector(
    (state) => state.user
  );

  // ── Local State ────────────────────────────────────────────
  const [fetchError, setFetchError] = useState(false);
  const [fetchAttempted, setFetchAttempted] = useState(false);
  const [fallbackLabel, setFallbackLabel] = useState(""); // explains why certain salons are shown
  const [sortNearest, setSortNearest] = useState(true);  // true = nearest first
  const [nameFilter, setNameFilter] = useState("");     // text search value

  // GPS coords from localStorage (set when the user grants location permission)
  const lat = localStorage.getItem("lat");
  const lng = localStorage.getItem("lng");

  // ── Category Tabs (All / Women / Men) ────────────────────────
  const CATEGORY_TABS = [
    { label: "All", value: "all", emoji: "💅" },
    { label: "Women", value: "women", emoji: "👩" },
    { label: "Men", value: "men", emoji: "👨" },
  ];

  /**
   * When the user switches tabs:
   * - Update Redux so the rest of the app stays in sync.
   * - Reset local filters so the new category always shows fresh results.
   */
  const handleCategoryChange = (value) => {
    dispatch(setSelectedCategory(value));
    setNameFilter("");      // clear search when switching tabs
  };

  /**
   * Converts raw metres to a human-readable distance string.
   * e.g. 850 → "850 m away"  |  1500 → "1.5 km away"
   */
  const formatDistance = (meters) => {
    if (!meters) return "";
    return meters < 1000
      ? `${Math.round(meters)} m away`
      : `${(meters / 1000).toFixed(1)} km away`;
  };

  /**
   * Main data-fetch function.
   * Encapsulated so it can be called on mount, category change, and retry.
   */
  const fetchSalons = async () => {
    setFetchError(false);
    setFetchAttempted(false);
    setFallbackLabel("");

    try {
      // Include GPS coords only if they are available
      const params = { category: selectedCategory };
      if (lat && lng) {
        params.lat = lat;
        params.lng = lng;
      }

      const result = await dispatch(fetchAllSalonsByCategory(params)).unwrap();
      setFetchAttempted(true);

      // If nearby search returned 0 results, load featured salons as fallback
      if (!result || result.length === 0) {
        await dispatch(fetchAllFeaturedSaloons()).unwrap();
        setFallbackLabel(
          lat && lng
            ? "Showing popular salons because no nearby results were found"
            : "Showing popular salons near you"
        );
      }
    } catch (err) {
      console.error("Fetch salons failed:", err);
      setFetchAttempted(true);

      // Last resort: try to at least show featured salons
      try {
        await dispatch(fetchAllFeaturedSaloons()).unwrap();
        setFallbackLabel("Showing popular salons (nearby fetch failed)");
      } catch {
        // Both API calls failed — dummy salons will be displayed instead
        setFetchError(true);
        setFallbackLabel("Showing sample salons — live data unavailable");
      }
    }
  };

  // Re-fetch whenever category or location changes
  useEffect(() => {
    if (!selectedCategory) return;
    fetchSalons();
  }, [selectedCategory, lat, lng]);

  // ── Derived Display Data ───────────────────────────────────
  // Priority: nearby API → featured API → dummy salons (always a fallback)
  // For "all" category we combine both dummy genders when API returns nothing.
  const rawSalons = (() => {
    if (salons && salons.length > 0) {
      // If selectedCategory is "all", show everything from the API;
      // otherwise the API already filtered by category.
      return salons;
    }
    if (featuredSalons && featuredSalons.length > 0) return featuredSalons;
    return getDummySalons(selectedCategory); // guaranteed cards for all tabs
  })();

  /**
   * Apply sort and name filter using useMemo so we only recompute
   * when the underlying data, sort order, or filter text changes.
   */
  const displaySalons = useMemo(() => {
    // 1. Filter by name (case-insensitive)
    const filtered = nameFilter.trim()
      ? rawSalons.filter((s) =>
        s.shopName?.toLowerCase().includes(nameFilter.toLowerCase())
      )
      : rawSalons;

    // 2. Sort by distance (distanceInMeters is present on both API and dummy data)
    const sorted = [...filtered].sort((a, b) => {
      const da = a.distanceInMeters ?? Infinity;
      const db = b.distanceInMeters ?? Infinity;
      return sortNearest ? da - db : db - da;
    });

    return sorted;
  }, [rawSalons, sortNearest, nameFilter]);

  // Whether to show the API fallback label pill
  const isDummyData =
    (!salons || salons.length === 0) &&
    (!featuredSalons || featuredSalons.length === 0);

  // Show skeleton only on the very first load before any fetch completes
  const isLoading = loading && !fetchAttempted;

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FFF8F1] py-12 px-4">
      <div className="w-full mx-auto px-4 md:px-8 lg:px-12">

        {/* ── Page Header ── */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Nearby{" "}
              <span className="text-indigo-600 capitalize">
                {selectedCategory === "all" ? "Salons" : `${selectedCategory}s`}
              </span>
            </h1>
            <p className="mt-2 text-slate-500 font-medium">
              {isLoading
                ? "Finding top-rated spots near you…"
                : `Showing ${displaySalons.length} top-rated spots near your location`}
            </p>

            {/* Explanation pill — shown when API returns empty and we fall back */}
            {fallbackLabel && (
              <p className="mt-1 text-xs text-amber-600 font-semibold bg-amber-50 border border-amber-200 px-3 py-1 rounded-full inline-block">
                ℹ️ {fallbackLabel}
              </p>
            )}

            {/* Dummy data pill — shown only when both APIs returned nothing */}
            {!isLoading && isDummyData && (
              <p className="mt-1 ml-1 text-xs text-teal-700 font-semibold bg-teal-50 border border-teal-200 px-3 py-1 rounded-full inline-block">
                📍 Showing sample salons near you
              </p>
            )}
          </div>

          {/* Location source indicator */}
          <div className="flex items-center space-x-2 text-sm text-slate-400">
            <MapPin size={16} />
            <span>
              {lat && lng ? "Based on your current location" : "Showing popular results"}
            </span>
          </div>
        </div>

        {/* ── Category Toggle: All / Women / Men ── */}
        <div className="flex items-center gap-2 mb-6">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleCategoryChange(tab.value)}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-bold border transition-all duration-200 ${selectedCategory === tab.value
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-indigo-50 hover:border-indigo-300"
                }`}
            >
              <span>{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Sort & Filter Controls ── */}
        {!isLoading && (
          <div className="flex flex-col sm:flex-row gap-3 mb-8">

            {/* Name search input */}
            <div className="relative flex-1 max-w-xs">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search by salon name…"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-full border border-gray-200 text-sm text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>

            {/* Sort toggle button */}
            <button
              onClick={() => setSortNearest((prev) => !prev)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 bg-white text-sm font-semibold text-gray-700 shadow-sm hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
            >
              <SlidersHorizontal size={15} />
              {sortNearest ? "Nearest First" : "Farthest First"}
            </button>
          </div>
        )}

        {/* ── Loading Skeletons ── */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* ── Salon Grid ── */}
        {!isLoading && displaySalons.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displaySalons.map((salon) => (
              <SalonCard
                key={salon._id}
                salon={salon}
                onNavigate={(id) => navigate(`/salon/${id}`)}
                formatDistance={formatDistance}
              />
            ))}
          </div>
        )}

        {/* ── No Results for Current Filter ── */}
        {!isLoading && displaySalons.length === 0 && nameFilter.trim() && (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-5">
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-5xl">
              🔍
            </div>
            <div>
              <p className="text-xl font-bold text-gray-700">No salons match "{nameFilter}"</p>
              <p className="text-gray-400 mt-1 text-sm">
                Try a different search term or clear the filter.
              </p>
            </div>
            <button
              onClick={() => setNameFilter("")}
              className="bg-indigo-600 text-white px-6 py-3 rounded-full font-bold hover:bg-indigo-700 transition-colors"
            >
              Clear Filter
            </button>
          </div>
        )}

        {/* ── Hard Error State (API failed AND no dummy rendered — extremely unlikely) ── */}
        {!isLoading && fetchError && displaySalons.length === 0 && !nameFilter && (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-5">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center">
              <Frown size={40} className="text-rose-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-700">Unable to load salons</p>
              <p className="text-gray-400 mt-1 text-sm">
                Please check your internet connection and try again.
              </p>
            </div>
            <button
              onClick={fetchSalons}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-full font-bold hover:bg-indigo-700 transition-colors"
            >
              <RefreshCw size={16} />
              Retry
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default SalonsPage;
