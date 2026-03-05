import React, { useEffect, useState } from "react";
import salonImg from "../../../assets/salon.png";
import haircutImg from "../../../assets/haircut.png";
import facialImg from "../../../assets/facial.png";
import makeupImg from "../../../assets/makeup.png";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomeSaloonsByCategory } from "../../../redux/slice/userSlice";
import { useNavigate } from "react-router-dom";

const placeholderSalons = [
    { _id: "placeholder-1", shopName: "Evita Beauty Parlour", galleryImages: [salonImg], distance: "321.7", rating: "4.8", reviewCount: "200", gender: "women", categories: ["Haircut", "Massage", "Facial"] },
    { _id: "placeholder-2", shopName: "Refine Glo Salon", galleryImages: [haircutImg], distance: "321.7", rating: "4.6", reviewCount: "150", gender: "women", categories: ["Haircut", "Massage", "Facial"] },
    { _id: "placeholder-3", shopName: "Glamour Studio", galleryImages: [facialImg], distance: "500.0", rating: "4.7", reviewCount: "320", gender: "women", categories: ["Haircut", "Massage", "Facial"] },
    { _id: "placeholder-4", shopName: "Royal Cuts", galleryImages: [makeupImg], distance: "8.5", rating: "4.9", reviewCount: "320", gender: "men", categories: ["Haircut", "Beard", "Spa"] },
];

/**
 * MobileSalonCard — horizontal-scroll card matching the reference design.
 * Shows image with distance/rating overlay, then name + subtitle + category chips.
 */
function MobileSalonCard({ salon, onClick }) {
    const [fav, setFav] = useState(false);
    const img = salon.galleryImages?.[0] || salonImg;
    const tags = salon.categories?.length > 0 ? salon.categories : ["Haircut", "Massage", "Facial"];
    const distance = salon.distance ? `${salon.distance} km` : "N/A";
    const rating = salon.rating || "4.8";
    const reviews = salon.reviewCount || "200";

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-2xl overflow-hidden cursor-pointer shrink-0"
            style={{ width: 190, boxShadow: "0 2px 10px rgba(0,0,0,0.10)" }}
        >
            {/* Image section */}
            <div className="relative w-full" style={{ height: 160 }}>
                <img src={img} alt={salon.shopName} className="w-full h-full object-cover" />

                {/* Heart button — top right */}
                <button
                    onClick={(e) => { e.stopPropagation(); setFav(p => !p); }}
                    className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center"
                    style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.18)" }}
                >
                    <span className="text-base leading-none">{fav ? "❤️" : "🤍"}</span>
                </button>

                {/* Dark overlay strip at bottom of image */}
                <div
                    className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-2 py-1.5"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.70) 0%, transparent 100%)" }}
                >
                    {/* Distance */}
                    <span className="text-white text-[11px] font-semibold flex items-center gap-1">
                        📍 {distance}
                    </span>
                    {/* Rating */}
                    <span className="text-white text-[11px] font-semibold flex items-center gap-1">
                        ⭐ {rating} ({reviews})
                    </span>
                </div>
            </div>

            {/* Info section below image */}
            <div className="px-3 pt-2.5 pb-3">
                {/* Shop name */}
                <p className="font-bold text-[14px] text-gray-900 leading-tight truncate">{salon.shopName}</p>
                {/* Subtitle */}
                <p className="text-[11px] text-gray-400 mt-0.5 mb-2">
                    {salon.salonCategory || "No categories available"}
                </p>
                {/* Category chips */}
                <div className="flex flex-wrap gap-1">
                    {tags.slice(0, 3).map((tag, i) => (
                        <span
                            key={i}
                            className="text-[11px] text-gray-600 bg-gray-100 rounded-full px-2 py-0.5 font-medium"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

/**
 * MobileHomeSaloons — horizontal scroll, used ONLY inside the mobile layout.
 * Desktop keeps the Swiper carousel in HomeSaloons.jsx.
 */
const MobileHomeSaloons = ({ category, lat, lng, fallbackSalons = [] }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { homeSaloonsByCategory = [] } = useSelector((state) => state.user);

    const apiOrFallback = homeSaloonsByCategory?.length > 0 ? homeSaloonsByCategory : fallbackSalons;
    const salonsToShow = apiOrFallback?.length > 0
        ? apiOrFallback
        : placeholderSalons.filter((s) => s.gender === category || s.gender === "unisex");

    useEffect(() => {
        if (category) dispatch(fetchHomeSaloonsByCategory({ category, lat, lng }));
    }, [dispatch, category, lat, lng]);

    return (
        <div className="bg-white pb-5">
            {/* Section header */}
            <div className="flex items-center justify-between px-4 pt-5 pb-3">
                <h2 className="text-[15px] font-extrabold text-gray-900 uppercase tracking-wide">Nearby Salons</h2>
                <button onClick={() => navigate("/salons")} className="text-[13px] font-semibold" style={{ color: "#0d9488" }}>
                    View all
                </button>
            </div>

            {/* Horizontal scroll row */}
            <div
                className="flex gap-3 px-4 overflow-x-auto"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {salonsToShow.map((salon) => (
                    <MobileSalonCard
                        key={salon._id}
                        salon={salon}
                        onClick={() => navigate(`/salon/${salon._id}`)}
                    />
                ))}
            </div>
        </div>
    );
};

export default MobileHomeSaloons;
