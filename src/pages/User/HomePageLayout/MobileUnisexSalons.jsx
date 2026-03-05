import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUnisexSalonServices } from "../../../redux/slice/userSlice";
import { useNavigate } from "react-router-dom";
import salonImg from "../../../assets/salon.png";
import haircutImg from "../../../assets/haircut.png";
import facialImg from "../../../assets/facial.png";

const PLACEHOLDER_UNISEX = [
    { _id: "placeholder-u1", shopName: "Evita Beauty Parlour", galleryImages: [salonImg], distance: "321.7", rating: "4.8", reviewCount: "200", categories: ["Haircut", "Massage", "Facial"] },
    { _id: "placeholder-u2", shopName: "Refine Glo Salon", galleryImages: [haircutImg], distance: "321.7", rating: "4.6", reviewCount: "150", categories: ["Haircut", "Massage", "Facial"] },
    { _id: "placeholder-u3", shopName: "Glamour Studio", galleryImages: [facialImg], distance: "500.0", rating: "4.7", reviewCount: "320", categories: ["Haircut", "Massage", "Facial"] },
];

/**
 * UnisexSalonCard — same card design as MobileHomeSaloons.
 */
function UnisexSalonCard({ salon, onClick }) {
    const [fav, setFav] = useState(false);
    const img = salon.galleryImages?.[0] || salonImg;
    const distance = salon.distance ? `${salon.distance} km` : "N/A";
    const rating = salon.rating || "4.8";
    const reviews = salon.reviewCount || "200";
    const tags = salon.categories?.length > 0 ? salon.categories : ["Haircut", "Massage", "Facial"];

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-2xl overflow-hidden cursor-pointer shrink-0"
            style={{ width: 190, boxShadow: "0 2px 10px rgba(0,0,0,0.09)" }}
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

                {/* Dark gradient overlay with distance + rating */}
                <div
                    className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-2 py-1.5"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.70) 0%, transparent 100%)" }}
                >
                    <span className="text-white text-[11px] font-semibold flex items-center gap-1">
                        📍 {distance}
                    </span>
                    <span className="text-white text-[11px] font-semibold flex items-center gap-1">
                        ⭐ {rating} ({reviews})
                    </span>
                </div>
            </div>

            {/* Info section */}
            <div className="px-3 pt-2.5 pb-3">
                <p className="font-bold text-[14px] text-gray-900 leading-tight truncate">{salon.shopName}</p>
                <p className="text-[11px] text-gray-400 mt-0.5 mb-2">
                    {salon.salonCategory || "No categories available"}
                </p>
                <div className="flex flex-wrap gap-1">
                    {tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-[11px] text-gray-600 bg-gray-100 rounded-full px-2 py-0.5 font-medium">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

/**
 * MobileUnisexSalons — mobile-only horizontal scroll section.
 * Desktop keeps UnisexSalon.jsx (Swiper carousel).
 */
const MobileUnisexSalons = ({ lat, lng }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { unisexSalonServices = [], loading } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(fetchAllUnisexSalonServices({ lat, lng }));
    }, [dispatch, lat, lng]);

    const salonsToShow = unisexSalonServices?.length > 0 ? unisexSalonServices : PLACEHOLDER_UNISEX;

    if (loading) return null;

    return (
        <div className="bg-white pb-5">
            {/* Section header */}
            <div className="flex items-center justify-between px-4 pt-5 pb-3">
                <h2 className="text-[15px] font-extrabold text-gray-900 uppercase tracking-wide">Unisex</h2>
                <button
                    onClick={() => navigate("/salons")}
                    className="text-[13px] font-semibold"
                    style={{ color: "#0d9488" }}
                >
                    View all
                </button>
            </div>

            {/* Horizontal scroll */}
            <div
                className="flex gap-3 px-4 overflow-x-auto"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {salonsToShow.map((salon) => (
                    <UnisexSalonCard
                        key={salon._id}
                        salon={salon}
                        onClick={() => navigate(`/salon/${salon._id}`)}
                    />
                ))}
            </div>
        </div>
    );
};

export default MobileUnisexSalons;
