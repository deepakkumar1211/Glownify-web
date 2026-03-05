import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomeSaloonsByCategory } from "../../../redux/slice/userSlice";
import { useNavigate } from "react-router-dom";
import { MapPin, ArrowRight, ChevronLeft, ChevronRight, Star, Heart } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const placeholderSalons = [
  {
    _id: "placeholder-1",
    shopName: "Evita Beauty Parlour",
    galleryImages: ["https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop"],
    distance: "321.7",
    rating: "4.8",
    reviewCount: "200",
    gender: "women",
  },
  {
    _id: "placeholder-2",
    shopName: "Refine Glow Salon",
    galleryImages: ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop"],
    distance: "321.7",
    rating: "4.8",
    reviewCount: "200",
    gender: "women",
  },
  {
    _id: "placeholder-3",
    shopName: "Glamour Studio",
    galleryImages: ["https://images.unsplash.com/photo-1521590832167-7228fcb728e7?w=400&h=300&fit=crop"],
    distance: "15.2",
    rating: "4.6",
    reviewCount: "150",
    gender: "women",
  },
  {
    _id: "placeholder-4",
    shopName: "Royal Cuts",
    galleryImages: ["https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop"],
    distance: "8.5",
    rating: "4.9",
    reviewCount: "320",
    gender: "men",
  },
  {
    _id: "placeholder-5",
    shopName: "Urban Style Barbers",
    galleryImages: ["https://images.unsplash.com/photo-1585747860019-8e8ef3f0e6c4?w=400&h=300&fit=crop"],
    distance: "12.3",
    rating: "4.7",
    reviewCount: "180",
    gender: "men",
  },
];

const HomeSaloons = ({ category, lat, lng, fallbackSalons = [] }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const { homeSaloonsByCategory = [], loading } = useSelector((state) => state.user);

  // Use API data first, then fallback salons, then placeholders
  const apiOrFallback = homeSaloonsByCategory?.length > 0 ? homeSaloonsByCategory : fallbackSalons;
  const salonsToShow = apiOrFallback?.length > 0
    ? apiOrFallback
    : placeholderSalons.filter((s) => s.gender === category || s.gender === "unisex");

  useEffect(() => {
    if (category) {
      dispatch(fetchHomeSaloonsByCategory({ category, lat, lng }));
    }
  }, [dispatch, category, lat, lng]);

  return (
    <div className="px-4 md:px-8 lg:px-12 py-12 w-full mx-auto group">
      {/* Header Section */}
      <div className="flex items-end justify-between mb-8 px-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight capitalize">
            {category} <span className="text-indigo-600">Salons</span>
          </h2>
          <p className="text-slate-500 text-sm mt-1">Premium grooming services in your area</p>
        </div>
        <button
          onClick={() => navigate("/salons")}
          className="group/btn flex items-center gap-2 text-indigo-600 font-bold text-sm bg-indigo-50 px-4 py-2 rounded-full hover:bg-indigo-600 hover:text-white transition-all duration-300"
        >
          View All <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Slider Container */}
      <div className="relative">
        {/* Custom Navigation */}
        <button
          ref={prevRef}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-white shadow-xl rounded-full flex items-center justify-center text-slate-700 opacity-0 group-hover:opacity-100 transition-all hover:bg-indigo-600 hover:text-white disabled:hidden"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          ref={nextRef}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-white shadow-xl rounded-full flex items-center justify-center text-slate-700 opacity-0 group-hover:opacity-100 transition-all hover:bg-indigo-600 hover:text-white disabled:hidden"
        >
          <ChevronRight size={22} />
        </button>

        <Swiper
          modules={[Pagination, Autoplay, Navigation]}
          spaceBetween={24}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          breakpoints={{
            0: { slidesPerView: 1.1, spaceBetween: 12 },
            480: { slidesPerView: 1.3, spaceBetween: 16 },
            768: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
            1280: { slidesPerView: 3, spaceBetween: 28 },
          }}
          className="pb-10! pt-2!"
        >
          {salonsToShow.map((salon) => (
            <SwiperSlide key={salon._id}>
              <div
                onClick={() => navigate(`/salon/${salon._id}`)}
                className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer"
              >
                {/* Image Section */}
                <div className="relative h-52 sm:h-56 md:h-60 lg:h-64 overflow-hidden">
                  {salon.galleryImages?.length > 0 ? (
                    <img
                      src={salon.galleryImages[0]}
                      alt={salon.shopName}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-slate-100 text-slate-300">
                      <Star size={40} strokeWidth={1} />
                    </div>
                  )}

                  {/* Heart / Favorite Icon */}
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                  >
                    <Heart size={20} className="text-rose-400" />
                  </button>
                </div>

                {/* Body Section */}
                <div className="p-5">
                  {/* Category Label */}
                  <p className="text-xs font-bold text-teal-500 uppercase tracking-wide mb-1.5">
                    {category}
                  </p>

                  {/* Salon Name */}
                  <h3 className="font-bold text-slate-900 text-lg truncate">
                    {salon.shopName}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-slate-400 text-sm mt-1">
                    {salon.categories?.join(", ") || "No categories available"}
                  </p>

                  {/* Distance & Rating Row */}
                  <div className="flex items-center gap-5 mt-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={15} className="text-teal-500" />
                      <span>{salon.distance ? `${salon.distance} km` : "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star size={15} className="text-amber-400 fill-amber-400" />
                      <span className="font-semibold">{salon.rating || "4.8"}</span>
                      <span className="text-slate-400">({salon.reviewCount || "200"})</span>
                    </div>
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

export default HomeSaloons;