import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchIndependentProfessionals } from "../../../redux/slice/userSlice";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { MapPin, ChevronRight, ChevronLeft, Star, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const IndependentProfessionals = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { independentProfessionals, loading } = useSelector((state) => state.user);

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    dispatch(fetchIndependentProfessionals());
  }, [dispatch]);

  // const goToDetailsPage = (id) => {
  //   navigate( `/independentprofessionaldetailspage`)
  //   window.scrollTo(0, 0);
  //   loacalstorage.setItem("independentProfessionalIdForDetails", id);



  // }
  const goToDetailPage = (salon) => {
    localStorage.setItem(
      "selectedSalon",
      JSON.stringify(salon)
    );
    navigate(`/independentprofessionaldetailspage`);
  }

  if (loading) {
    return (
      <div className="w-full mx-auto px-4 md:px-8 lg:px-12 py-20">
        <div className="h-8 w-64 bg-slate-200 animate-pulse rounded mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-100 bg-slate-100 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!independentProfessionals?.length) return null;

  return (
    <div className="w-full mx-auto px-4 md:px-8 lg:px-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Service At Home
          </h2>
          <p className="text-slate-500 text-sm mt-1">Top-rated independent professionals near you</p>
        </div>

        {/* Custom Navigation Controls */}
        <div className="flex gap-2">
          <button
            ref={prevRef}
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all disabled:opacity-30"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            ref={nextRef}
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all disabled:opacity-30"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="relative group">
        <Swiper
          modules={[Pagination, Autoplay, Navigation]}
          spaceBetween={20}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          breakpoints={{
            0: { slidesPerView: 1.1, spaceBetween: 12 },
            480: { slidesPerView: 1.3, spaceBetween: 14 },
            640: { slidesPerView: 2.3, spaceBetween: 16 },
            1024: { slidesPerView: 4, spaceBetween: 16 },
            1280: { slidesPerView: 5, spaceBetween: 20 },
          }}
          className="pb-10! pt-2!"
        >
          {independentProfessionals.map((pro) => (
            <SwiperSlide key={pro._id}>
              <div className="flex flex-col h-80 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden group/card">

                {/* Image Section */}
                <div className="relative h-52 overflow-hidden">
                  {pro.profilePhoto ? (
                    <img
                      src={pro.profilePhoto}
                      alt={pro.user?.name}
                      className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full bg-indigo-50 text-indigo-300">
                      <ShieldCheck size={40} strokeWidth={1} />
                      <span className="text-[10px] mt-2 font-medium uppercase tracking-widest">Verified Pro</span>
                    </div>
                  )}

                  {/* Overlays */}
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/20 to-transparent" />

                  <div className="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg uppercase">
                    {pro.experienceYears}+ Yrs Exp
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-bold text-lg leading-tight truncate">
                      {pro.user?.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex items-center gap-1 text-[11px] text-white/90">
                        <MapPin size={12} className="text-indigo-400" />
                        <span>{pro.location?.radiusInKm || 5} km away</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex flex-col flex-1 bg-white">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Specialties</span>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        <Star size={10} fill="currentColor" />
                        <span className="text-[10px] font-bold text-slate-700">4.9</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {pro.specializations?.slice(0, 3).map((spec, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-slate-50 border border-slate-100 text-slate-600 text-[10px] font-medium rounded-md italic"
                        >
                          {typeof spec === 'string' ? spec : spec.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Section */}
                  <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-[11px] text-emerald-600 font-bold uppercase tracking-tight">Available</span>
                    </div>
                    <button onClick={() => goToDetailPage(pro)} className="text-indigo-600 text-xs font-bold hover:text-indigo-800 transition-colors flex items-center gap-1">
                      Book Now <ChevronRight size={14} />
                    </button>
                  </div>
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