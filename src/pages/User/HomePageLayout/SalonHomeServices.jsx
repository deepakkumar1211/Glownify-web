import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllSalonsforhomeServices } from "../../../redux/slice/userSlice";
import { MapPin, Star, ChevronLeft, ChevronRight, Clock, CheckCircle2 } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useNavigate } from "react-router-dom";

const SalonHomeServices = ({ category, lat, lng }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const { salonsforhomeServices, loading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchAllSalonsforhomeServices({ category, lat, lng }));
  }, [dispatch, category, lat, lng]);

  const gotoDetailsPage = (id) => {
    navigate(`/salondetailPageforhome/${id}`)
    localStorage.setItem("salonIdForHomeDetails", id);
    console.log(id, "salon id for home details");
    window.scrollTo(0, 0);
  }


  const mockServices = [
    { name: "Haircut", price: 299 },
    { name: "Facial", price: 599 },
    { name: "Hair Spa", price: 899 },
  ];

  if (loading) {
    return (
      <div className="w-full mx-auto px-4 md:px-8 lg:px-12 py-12">
        <div className="h-8 w-48 bg-slate-200 animate-pulse rounded mb-6"></div>
        <div className="flex gap-6 overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="min-w-62.5 h-100 bg-slate-100 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!salonsforhomeServices?.length) return null;

  return (
    <div className="px-4 md:px-8 lg:px-12 w-full mx-auto">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Salon Home Services
          </h2>
          <p className="text-slate-500 text-sm mt-1 flex items-center gap-1">
            Professional grooming at your doorstep
          </p>
        </div>

        {/* Custom Navigation */}
        <div className="hidden md:flex gap-3">
          <button
            ref={prevRef}
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-20"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            ref={nextRef}
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-20"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="relative group">
        <Swiper
          modules={[Pagination, Autoplay, Navigation]}
          spaceBetween={24}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          breakpoints={{
            0: { slidesPerView: 1.3, spaceBetween: 16 },
            640: { slidesPerView: 2.3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 },
          }}
          className="pb-12!"
        >
          {salonsforhomeServices.map((item) => (
            <SwiperSlide key={item._id}>
              <div className="group/card h-87.5 flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">

                {/* IMAGE HEADER */}
                <div className="relative h-44 overflow-hidden">
                  {item.galleryImages?.length > 0 ? (
                    <img
                      src={item.galleryImages[0]}
                      alt={item.shopName}
                      className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                      No Image
                    </div>
                  )}

                  {/* Floating Badges */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <Star size={12} className="text-amber-500 fill-amber-500" />
                    <span className="text-[11px] font-bold text-slate-800">4.8</span>
                  </div>

                  <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-transparent to-transparent" />

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 mb-0.5">
                      {item.salonCategory}
                    </p>
                    <h3 className="font-bold text-base leading-tight truncate">
                      {item.shopName}
                    </h3>
                  </div>
                  {/* <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-4">
                    <MapPin size={12} className="text-indigo-500" />
                    <span>{Math.round(item.distanceInMeters / 1000)} km away</span>
                  </div> */}
                </div>

                {/* CONTENT SECTION */}
                <div className="p-5 flex flex-col flex-1">


                  <div className="space-y-2.5 flex-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Popular Services</p>
                    {mockServices.map((s, i) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <span className="text-slate-600 font-medium">{s.name}</span>
                        <span className="text-slate-900 font-bold text-[13px]">₹{s.price}</span>
                      </div>
                    ))}
                  </div>

                  {/* FOOTER */}
                  <div className=" border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-emerald-600">
                      <Clock size={12} />
                      <span className="text-[10px] font-bold uppercase">Quick Visit</span>
                    </div>
                    <button onClick={() => gotoDetailsPage(item._id)} className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-600 hover:text-white transition-colors">
                      Book Now
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

export default SalonHomeServices;