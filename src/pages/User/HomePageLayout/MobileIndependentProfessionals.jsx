import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchIndependentProfessionals } from "../../../redux/slice/userSlice";
import { useNavigate } from "react-router-dom";
import aishaImg from "../../../assets/aisha.jpg";
import gitaImg from "../../../assets/gita.jpg";
import menImg from "../../../assets/men.png";

const DUMMY_PROS = [
    { _id: "d1", user: { name: "Abhishek" }, profilePhoto: menImg, availability: "Not available", experienceYears: 4, specializations: ["Hairs"], gender: "MALE", rating: "4.5", isAvailable: false },
    { _id: "d2", user: { name: "Priya Sharma" }, profilePhoto: aishaImg, availability: "Available now", experienceYears: 6, specializations: ["Makeup"], gender: "FEMALE", rating: "4.8", isAvailable: true },
    { _id: "d3", user: { name: "Gita Rao" }, profilePhoto: gitaImg, availability: "Not available", experienceYears: 3, specializations: ["Facial"], gender: "FEMALE", rating: "4.3", isAvailable: false },
];

/**
 * ProCard — horizontal-scroll card matching the reference design.
 * Portrait photo with availability badge, rating, gender pill, then name/exp/spec + Book Now.
 */
function ProCard({ pro, onPress }) {
    const isAvail = pro.isAvailable || pro.availability?.toLowerCase().includes("available now");
    const name = pro.user?.name || "Professional";
    const exp = pro.experienceYears ? `${pro.experienceYears} yrs Exp` : "N/A";
    const spec = typeof pro.specializations?.[0] === "string"
        ? pro.specializations[0]
        : pro.specializations?.[0]?.name || "";

    return (
        <div
            className="bg-white rounded-2xl overflow-hidden shrink-0 cursor-pointer"
            style={{ width: 160, boxShadow: "0 2px 10px rgba(0,0,0,0.09)" }}
            onClick={onPress}
        >
            {/* Photo section */}
            <div className="relative w-full" style={{ height: 155 }}>
                <img src={pro.profilePhoto} alt={name} className="w-full h-full object-cover object-top" />

                {/* Availability badge — top right */}
                <div
                    className="absolute top-2 right-2 rounded-full px-2 py-0.5"
                    style={{ backgroundColor: isAvail ? "#16a34a" : "#6b7280" }}
                >
                    <span className="text-white text-[10px] font-bold">
                        {isAvail ? "● Available" : "● Busy"}
                    </span>
                </div>

                {/* Rating badge — bottom left */}
                <div
                    className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full px-2 py-0.5"
                    style={{ backgroundColor: "#16a34a" }}
                >
                    <span className="text-white text-[11px] font-bold">{pro.rating || "4.5"}</span>
                    <span className="text-[10px]">⭐</span>
                </div>

                {/* Gender pill — bottom right */}
                <div
                    className="absolute bottom-2 right-2 rounded-full px-2 py-0.5"
                    style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
                >
                    <span className="text-white text-[10px] font-bold">{pro.gender}</span>
                </div>
            </div>

            {/* Info section */}
            <div className="px-3 pt-2 pb-3">
                <p className="font-bold text-[13px] truncate" style={{ color: "#0d9488" }}>{name}</p>
                <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">🧳 {exp}</p>
                <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">✂️ {spec}</p>
                <button
                    className="mt-2.5 w-full py-1.5 rounded-full text-[12px] font-bold border"
                    style={{ borderColor: "#0d9488", color: "#0d9488" }}
                    onClick={(e) => { e.stopPropagation(); onPress(); }}
                >
                    Book Now
                </button>
            </div>
        </div>
    );
}

/**
 * MobileIndependentProfessionals — horizontal scroll, used ONLY in mobile layout.
 * Desktop keeps the Swiper carousel in IndependentProfessionals.jsx.
 */
const MobileIndependentProfessionals = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { independentProfessionals, loading } = useSelector((state) => state.user);

    useEffect(() => { dispatch(fetchIndependentProfessionals()); }, [dispatch]);

    const goToDetail = (pro) => {
        localStorage.setItem("selectedSalon", JSON.stringify(pro));
        navigate("/independentprofessionaldetailspage");
    };

    const prosToShow = independentProfessionals?.length > 0 ? independentProfessionals : DUMMY_PROS;
    if (loading) return null;

    return (
        <div className="bg-white pb-5">
            {/* Section header */}
            <div className="flex items-center justify-between px-4 pt-5 pb-1">
                <div>
                    <h2 className="text-[15px] font-extrabold text-gray-900 uppercase tracking-wide">Home Service</h2>
                    <p className="text-[11px] text-gray-400 mt-0.5">{prosToShow.length} professionals nearby</p>
                </div>
                <button
                    className="text-[13px] font-semibold border rounded-full px-3 py-1"
                    style={{ color: "#0d9488", borderColor: "#0d9488" }}
                    onClick={() => navigate("/independentprofessionaldetailspage")}
                >
                    View all &gt;
                </button>
            </div>

            {/* Horizontal scroll row */}
            <div
                className="flex gap-3 px-4 pt-3 overflow-x-auto"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {prosToShow.map((pro) => (
                    <ProCard key={pro._id} pro={pro} onPress={() => goToDetail(pro)} />
                ))}
            </div>
        </div>
    );
};

export default MobileIndependentProfessionals;
