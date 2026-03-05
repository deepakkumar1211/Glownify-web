import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchIndependentProfessionals } from "../../../redux/slice/userSlice";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { ChevronRight, ChevronLeft, Star, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

const IndependentProfessionals = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { independentProfessionals, loading } = useSelector(
    (state) => state.user
  );

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    dispatch(fetchIndependentProfessionals());
  }, [dispatch]);

  // Navigate to the professional's detail page
  const goToDetailPage = (salon) => {
    localStorage.setItem("selectedSalon", JSON.stringify(salon));
    navigate(`/independentprofessionaldetailspage`);
  };

  // ── Loading skeleton ──────────────────────────────────────────
  if (loading) {
    return (
      <div className="w-full mx-auto px-4 md:px-8 lg:px-12 py-12">
        <div className="h-8 w-64 bg-slate-200 animate-pulse rounded mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-slate-100 animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!independentProfessionals?.length) return null;

  return (
    <div className="w-full mx-auto px-4 md:px-8 lg:px-12">

      {/* ── Section header with nav arrows ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Service At Home
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Top-rated independent professionals near you
          </p>
        </div>

        {/* Prev / Next buttons */}
        <div className="flex gap-2">
          <button
            ref={prevRef}
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-teal-600 hover:text-white hover:border-teal-600 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            ref={nextRef}
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-teal-600 hover:text-white hover:border-teal-600 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* ── Swiper carousel ── */}
      <div className="relative">
        <Swiper
          modules={[Autoplay, Navigation]}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          breakpoints={{
            0: { slidesPerView: 1.1, spaceBetween: 12 },
            480: { slidesPerView: 1.3, spaceBetween: 14 },
            640: { slidesPerView: 2.1, spaceBetween: 16 },
            1024: { slidesPerView: 3, spaceBetween: 16 },
            1280: { slidesPerView: 4, spaceBetween: 20 },
          }}
          className="pb-10! pt-2!"
        >
          {independentProfessionals.map((pro) => (
            <SwiperSlide key={pro._id}>

              {/* ── Compact horizontal card (matches HTML mockup style) ── */}
              <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 px-4 py-3 cursor-pointer">

                {/* Left: circular avatar + name + rating/exp */}
                <div className="flex items-center gap-3 min-w-0">

                  {/* 56 × 56 circular avatar */}
                  <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-teal-100">
                    {pro.profilePhoto ? (
                      <img
                        src={pro.profilePhoto}
                        alt={pro.user?.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-teal-50 flex items-center justify-center">
                        <ShieldCheck
                          size={24}
                          className="text-teal-400"
                          strokeWidth={1.5}
                        />
                      </div>
                    )}
                  </div>

                  {/* Name · rating · years exp */}
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 text-sm leading-tight truncate">
                      {pro.user?.name}
                    </p>

                    {/* ⭐ 4.9 | N yrs Exp */}
                    <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                      <Star
                        size={11}
                        fill="currentColor"
                        className="text-amber-400 shrink-0"
                      />
                      <span className="text-xs text-slate-500 font-medium">4.9</span>
                      <span className="text-slate-300 text-xs">|</span>
                      <span className="text-xs text-slate-500">
                        {pro.experienceYears} yrs Exp
                      </span>
                    </div>

                    {/* First specialization tag */}
                    {pro.specializations?.length > 0 && (
                      <span className="text-[10px] text-teal-600 font-medium mt-0.5 block truncate max-w-[130px]">
                        {typeof pro.specializations[0] === "string"
                          ? pro.specializations[0]
                          : pro.specializations[0]?.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: availability dot + Book Now */}
                <div className="flex flex-col items-end gap-2 shrink-0 ml-3">
                  {/* Green availability indicator */}
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Available
                  </span>

                  {/* Book Now */}
                  <button
                    onClick={() => goToDetailPage(pro)}
                    className="text-teal-600 text-[11px] font-bold hover:text-teal-800 transition-colors flex items-center gap-0.5 whitespace-nowrap"
                  >
                    Book Now <ChevronRight size={12} />
                  </button>
                </div>
              </div>

            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default IndependentProfessionals;