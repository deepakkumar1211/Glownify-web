import React from "react";
import { MapPin, Star, ShieldCheck, Sparkles, Calendar, Scissors } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { HeroSection1 } from "../../../components/User/HeroSection1";
import { HeroSection2 } from "../../../components/User/HeroSection2";

const Hero = () => {
  
  return (
    <div className="relative w-full overflow-hidden bg-white">
      {/* Main Swiper Container */}
      <Swiper
        modules={[Pagination, Autoplay]}
        // pagination={{ clickable: true, dynamicBullets: true }}
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
    </div>
  );
};

// Sub-component for the Phone to keep code clean




export default Hero;