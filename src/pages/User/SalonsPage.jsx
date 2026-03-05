import { useSelector, useDispatch } from "react-redux";
import { fetchAllSalonsByCategory } from "../../redux/slice/userSlice";
import { useEffect } from "react";
import { MapPin, Pin, Route, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SalonsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { salons, selectedCategory, loading } = useSelector(
    (state) => state.user
  );
  const lat = localStorage.getItem("lat");
  const lng = localStorage.getItem("lng");

  const handleSalonClick = (salonId) => {
    navigate(`/salon/${salonId}`);
  };

  useEffect(() => {
    if (!selectedCategory || !lat || !lng) return;

    const fetchSalons = async () => {
      try {
        const fetchPromise = dispatch(
          fetchAllSalonsByCategory({
            category: selectedCategory,
            lat,
            lng,
          })
        ).unwrap();

        await toast.promise(fetchPromise, {
          loading: "Finding nearby salons...",
          success: (res) =>
            res?.length
              ? "Salons loaded successfully ✨"
              : "No salons found nearby",
          error: (err) =>
            err?.message || "Failed to load nearby salons",
        });
      } catch (error) {
        console.error("Fetch salons failed:", error);
      }
    };

    fetchSalons();
  }, [selectedCategory, lat, lng, dispatch]);


  const formatDistance = (meters) => {
    if (!meters) return "";
    return meters < 1000
      ? `${Math.round(meters)} m away`
      : `${(meters / 1000).toFixed(1)} km away`;
  };

  const mockServices = [
    { name: "Haircut", price: 299 },
    { name: "Facial", price: 599 },
    { name: "Hair Spa", price: 899 },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8F1] py-12 px-4">
      <div className="w-full mx-auto px-4 md:px-8 lg:px-12">
        {/* Header Section */}

        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Nearby{" "}
              <span className="text-indigo-600 capitalize">
                {selectedCategory || "Salon"}s
              </span>
            </h1>

            <p className="mt-2 text-slate-500 font-medium">
              Showing {salons?.length || 0} top-rated spots near your location
            </p>
          </div>

          <div className="flex items-center space-x-2 text-sm text-slate-400">
            <MapPin size={16} />

            <span>Based on your current location</span>
          </div>
        </div>

        {/* Modern Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {salons?.map((salon) => (
            <div
              key={salon._id}
              className="group bg-white rounded-4xl overflow-hidden shadow-xl shadow-gray-200/50 border border-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              {/* Top Section: Image Placeholder */}
              <div className="relative h-64 bg-[#F0F5FF] flex items-center justify-center">
                <span className="text-gray-400 font-medium italic">
                  No Image Available
                </span>

                {/* Floating Gender Category */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm flex items-center gap-1 border border-gray-100">
                  <span className="inline-block px-2 rounded-lg text-[14px] font-black text-indigo-600 uppercase tracking-widest">
                    {salon.salonCategory || "UNISEX"}
                  </span>
                </div>

                {/* Floating Rating Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm flex items-center gap-1 border border-gray-100">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-gray-700">4.8</span>
                </div>
              </div>

              {/* Bottom Section: Content */}
              <div className="p-4">
                <div className="mb-2">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2 truncate">
                    {salon.shopName}
                  </h2>
                </div>

                {/* Address + Distance */}
                <div className="mb-2">
                  {/* <div className="flex items-start text-gray-500">
                    <MapPin size={18} className="mr-2 shrink-0" />
                    <p className="text-sm font-medium leading-tight">
                      {salon.location.address}, {salon.location.city}
                    </p>
                  </div> */}

                  <p className="mt-1 text-xs font-semibold text-indigo-600">
                    <MapPin size={14} className="inline-block mr-1" />
                    {formatDistance(salon.distanceInMeters)}
                  </p>
                </div>

                {/* Services */}
                <div className="mb-4">
                  <div className="space-y-2">
                    {mockServices.map((service, index) => (
                      <div
                        key={index}
                        className="flex justify-between text-sm font-medium text-gray-700"
                      >
                        <span>{service.name}</span>
                        <span className="font-bold text-gray-900">
                          ₹{service.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end items-center border-t border-gray-50">
                  {/* <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
                    Available Now
                  </span> */}
                  <button
                    onClick={() => handleSalonClick(salon._id)}
                    className="text-indigo-600 font-extrabold text-lg hover:text-indigo-800 transition-colors">
                    Book Visit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {!loading && salons?.length === 0 && (
          <div className="text-center py-20 text-gray-400 font-medium">
            No salons found in this category near you.
          </div>
        )}
      </div>
    </div>
  );
};

export default SalonsPage;
