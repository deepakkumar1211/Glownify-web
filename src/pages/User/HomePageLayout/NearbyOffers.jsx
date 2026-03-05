import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import salonImg from "../../../assets/salon.png";
import waxingImg from "../../../assets/waxing.png";
import facialImg from "../../../assets/facial.png";

const DUMMY_OFFERS = [
    { _id: "placeholder-o1", name: "Maroon's Luxury Salon", address: "Kukatpally, Hyderabad", tags: "HAIR • FACIAL", rating: "4.8", reviews: "3.7k", discount: "15%", image: salonImg, chips: ["Hair Trim", "Shave", "Facial"], distance: "2.5" },
    { _id: "placeholder-o2", name: "Maroon's Luxury Salon", address: "Kukatpally, Hyderabad", tags: "HAIR • FACIAL", rating: "4.8", reviews: "3.7k", discount: "15%", image: waxingImg, chips: ["Hair Trim", "Shave", "Facial"], distance: "2.5" },
    { _id: "placeholder-o3", name: "Glamour Beauty Lounge", address: "Banjara Hills, Hyderabad", tags: "SPA • NAILS", rating: "4.6", reviews: "2.1k", discount: "20%", image: facialImg, chips: ["Facial", "Waxing", "Spa"], distance: "5.0" },
];

/**
 * OfferCard — horizontal-scroll card matching the reference design.
 */
function OfferCard({ offer, onClick }) {
    const [fav, setFav] = useState(false);

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-2xl overflow-hidden cursor-pointer shrink-0"
            style={{ width: 210, boxShadow: "0 2px 10px rgba(0,0,0,0.09)" }}
        >
            {/* Image section */}
            <div className="relative w-full" style={{ height: 150 }}>
                <img src={offer.image} alt={offer.name} className="w-full h-full object-cover" />

                {/* Discount badge — top left */}
                {offer.discount && (
                    <div className="absolute top-2.5 left-2.5 bg-red-500 rounded-lg px-2 py-0.5">
                        <span className="text-white text-[11px] font-bold">{offer.discount} Off</span>
                    </div>
                )}

                {/* Heart button — top right */}
                <button
                    onClick={(e) => { e.stopPropagation(); setFav(p => !p); }}
                    className="absolute top-2.5 right-2.5 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center"
                    style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }}
                >
                    <span className="text-sm leading-none">{fav ? "❤️" : "🤍"}</span>
                </button>

                {/* Bottom overlay: distance + rating pills */}
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-2 py-1.5"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.60) 0%, transparent 100%)" }}>
                    {/* Distance pill */}
                    <span
                        className="flex items-center gap-1 text-white text-[11px] font-semibold rounded-full px-2 py-0.5"
                        style={{ backgroundColor: "rgba(50,50,50,0.65)" }}
                    >
                        📍 {offer.distance ? `${offer.distance} km` : "N/A"}
                    </span>
                    {/* Rating pill */}
                    <span
                        className="flex items-center gap-1 text-white text-[11px] font-semibold rounded-full px-2 py-0.5"
                        style={{ backgroundColor: "rgba(50,50,50,0.65)" }}
                    >
                        ⭐ {offer.rating} ({offer.reviews})
                    </span>
                </div>
            </div>

            {/* Info section */}
            <div className="px-3 pt-2.5 pb-3">
                {/* Tags row — teal uppercase */}
                <p className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: "#0d9488" }}>
                    {offer.tags}
                </p>
                {/* Salon name */}
                <p className="font-bold text-[14px] text-gray-900 leading-tight truncate">{offer.name}</p>
                {/* Address */}
                <p className="text-[11px] text-gray-400 mt-0.5 mb-2 truncate">{offer.address}</p>
                {/* Category chips */}
                <div className="flex flex-wrap gap-1">
                    {(offer.chips || []).slice(0, 3).map((chip, i) => (
                        <span key={i} className="text-[11px] text-gray-600 bg-gray-100 rounded-full px-2 py-0.5 font-medium">
                            {chip}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

/**
 * NearbyOffers — horizontal scroll, mobile only.
 */
const NearbyOffers = ({ offers = [] }) => {
    const navigate = useNavigate();
    const displayOffers = offers.length > 0 ? offers : DUMMY_OFFERS;

    return (
        <div className="bg-white pb-5">
            {/* Section header */}
            <div className="flex items-center justify-between px-4 pt-5 pb-3">
                <h2 className="text-[15px] font-extrabold text-gray-900 uppercase tracking-wide">Nearby Offers</h2>
                <button className="text-[13px] font-semibold" style={{ color: "#0d9488" }} onClick={() => navigate("/salons")}>
                    View all
                </button>
            </div>

            {/* Horizontal scroll row */}
            <div
                className="flex gap-3 px-4 overflow-x-auto"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {displayOffers.map((offer) => (
                    <OfferCard key={offer._id} offer={offer} onClick={() => navigate(`/salon/${offer._id}`)} />
                ))}
            </div>
        </div>
    );
};

export default NearbyOffers;
