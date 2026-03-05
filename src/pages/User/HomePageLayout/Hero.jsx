import React, { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { HeroSection1 } from "../../../components/User/HeroSection1";
import { HeroSection2 } from "../../../components/User/HeroSection2";

const Hero = () => {
  // Read location string from localStorage (set after geolocation)
  const [locationLabel, setLocationLabel] = useState("Detecting location...");

  useEffect(() => {
    // Try to build a label from stored coordinates
    const lat = localStorage.getItem("lat");
    const lng = localStorage.getItem("lng");

    if (lat && lng) {
      // Reverse geocode via browser-friendly Nominatim (no key required)
      fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      )
        .then((res) => res.json())
        .then((data) => {
          const suburb =
            data.address?.suburb ||
            data.address?.neighbourhood ||
            data.address?.village ||
            data.address?.town ||
            data.address?.city_district ||
            "";
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.county ||
            "";
          setLocationLabel(suburb ? `${suburb}, ${city}` : city || "Your Location");
        })
        .catch(() => setLocationLabel("Your Location"));
    }
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-white">
      {/* Main Swiper Container */}
      <Swiper
        modules={[Pagination, Autoplay]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="w-full"
      >
        {/* SLIDE 1 */}
        <SwiperSlide>
          <HeroSection1 />
        </SwiperSlide>

        {/* SLIDE 2 */}
        <SwiperSlide>
          <HeroSection2 />
        </SwiperSlide>
      </Swiper>

      {/* FIXED MARQUEE - Positioned at bottom of the hero area */}
      <div className="absolute bottom-8 left-[-5%] z-20 py-6 bg-slate-900 -rotate-1 w-[110%] shadow-2xl pointer-events-none">
        <marquee scrollamount="10">
          <div className="flex gap-20 text-white/90 font-bold uppercase tracking-[0.4em] text-xs">
            <span>• INSTANT BOOKING</span>
            <span className="text-rose-400">• VERIFIED PROFESSIONALS</span>
            <span>• NO WAITING TIME</span>
            <span className="text-rose-400">• 5-STAR SERVICE</span>
            <span>• LUXURY EXPERIENCE</span>
          </div>
        </marquee>
      </div>

      {/* ── Teal Location Pill (matches HTML mockup header search bar) ── */}
      <div className="flex justify-start px-4 md:px-8 lg:px-12 py-3 bg-white border-b border-slate-100">
        <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-700 rounded-full px-4 py-2 text-sm font-medium shadow-sm">
          <MapPin size={15} className="text-teal-500 shrink-0" />
          <span className="truncate max-w-[280px]">{locationLabel}</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;