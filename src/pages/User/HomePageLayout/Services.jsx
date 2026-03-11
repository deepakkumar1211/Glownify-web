import React, { memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import img1 from "../../../assets/salon.png";
import img2 from "../../../assets/salon_service.png";
import img3 from "../../../assets/haircut.png";
import img4 from "../../../assets/facial.png";
import img5 from "../../../assets/waxing.png";
import img6 from "../../../assets/makeup.png";

const services = [
  { icon: img1, title: "Salon Appointment", desc: "Instantly book nearby top-rated men's & women's salons." },
  { icon: img2, title: "Home Services", desc: "Professional grooming and beauty care in your own space." },
  { icon: img3, title: "Haircut & Grooming", desc: "Expert styling tailored for men, women, and children." },
  { icon: img4, title: "Facial & Skincare", desc: "Revitalizing treatments for a natural, healthy glow." },
  { icon: img5, title: "Waxing & Threading", desc: "Precise and hygienic hair removal by specialists." },
  { icon: img6, title: "Makeup & Styling", desc: "Exquisite bridal and party transformations." },
];

export const Services = memo(() => {
  return (
    <section id="services" className="w-full bg-[#FCF9F7] py-16 px-4 md:px-10 lg:px-16">
      <div className="w-full mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F7A97E] mb-3 block">
            Premium Care
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#3D1E14] mb-4">
            Our Services
          </h2>
          <div className="w-16 h-[3px] bg-[#F7A97E] mx-auto" />
        </div>

        {/* Cards — 3 on desktop, scrollable carousel on smaller */}
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={24}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          breakpoints={{
            0: { slidesPerView: 1.1, spaceBetween: 16 },
            480: { slidesPerView: 1.4, spaceBetween: 20 },
            768: { slidesPerView: 2.2, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
          }}
        >
          {services.map((item, i) => (
            <SwiperSlide key={i}>
              <div className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-500">

                {/* Image — fixed height */}
                <div className="h-52 md:h-56 overflow-hidden relative">
                  <img
                    src={item.icon}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col gap-2">
                  <h3 className="text-lg font-bold text-[#3D1E14] group-hover:text-[#F7A97E] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                  <button className="mt-3 text-[11px] font-bold uppercase tracking-widest text-[#F7A97E] flex items-center gap-1.5 group/btn w-fit">
                    Explore More
                    <span className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
                  </button>
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
});

export default Services;