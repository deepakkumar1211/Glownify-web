import React, { useEffect } from "react";
import { Link, NavLink, Outlet, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSaloonDetailsById } from "../../../redux/slice/userSlice";

const HomeSaloonsDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { saloonDetails, loading, error } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (id) {
      dispatch(getSaloonDetailsById(id));
    }
  }, [dispatch, id]);

  if (loading) return (
    <div className="flex justify-center items-center h-64 text-gray-500 font-medium">
      <div className="animate-pulse">Loading salon details...</div>
    </div>
  );
  
  if (error) return <div className="p-8 text-center text-red-500 font-medium">{error}</div>;
  if (!saloonDetails) return null;

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* MAIN CONTAINER - Set to w-full with horizontal padding */}
      <div className="w-full px-4 py-6 md:px-8 lg:px-12">
        
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* TOP SECTION: IMAGE & PRIMARY INFO */}
          <div className="relative group">
            {/* Banner Image */}
            <div className="h-72 md:h-96 w-full overflow-hidden relative">
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={
                  saloonDetails.coverImage ||
                  "https://img.freepik.com/premium-photo/hairdressers-makeup-artist-working-beauty-salon_10069-11140.jpg"
                }
                alt={saloonDetails.shopName}
              />
              {/* Overlay for better text readability if needed */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              
              {/* Book Now Button - Repositioned for full-width impact */}
              <Link to="/bookappoitment">
                <button className="px-8 py-3 font-bold text-gray-800 rounded-xl bg-white shadow-lg hover:bg-gray-100 transition-all absolute right-8 bottom-8 transform hover:-translate-y-1 active:scale-95">
                  Book Now
                </button>
              </Link>
            </div>

            {/* Salon Header Info */}
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                    {saloonDetails.shopName}
                  </h1>
                  
                  <div className="mt-2 space-y-1 text-gray-600">
                    <p className="flex items-center gap-2">
                      <span className="text-sm">{saloonDetails.location?.address}</span>
                    </p>
                    <p className="text-sm font-medium">
                      {saloonDetails.location?.city}, {saloonDetails.location?.state} {saloonDetails.location?.pincode}
                    </p>
                  </div>

                  <div className="mt-4 flex gap-3 flex-wrap">
                    {saloonDetails.homeService && (
                      <span className="px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-bold uppercase tracking-wider">
                        Home Service Available
                      </span>
                    )}
                    <span className="px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-bold uppercase tracking-wider">
                      Open Now
                    </span>
                  </div>
                </div>

                <div className="max-w-md">
                  <p className="text-gray-500 leading-relaxed italic border-l-4 border-gray-200 pl-4">
                    "Premium salon offering world-class hair and beauty services. Experience luxury and care tailored just for you."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* NAVIGATION TABS - Sticky on scroll */}
          <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-y border-gray-100">
            <div className="flex flex-wrap md:flex-nowrap justify-start md:justify-center lg:justify-start gap-2 p-2 md:px-8">
              {[
                { to: "services", label: "Services" },
                { to: "gallery", label: "Gallery" },
                { to: "map", label: "Map & Location" },
                { to: "reviews", label: "Reviews" },
                { to: "specialists", label: "Specialists" },
              ].map((tab) => (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  className={({ isActive }) =>
                    `px-6 py-3 rounded-xl transition-all duration-200 text-sm font-bold whitespace-nowrap ${
                      isActive 
                        ? "bg-gray-900 text-white shadow-md" 
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                >
                  {tab.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* TAB CONTENT AREA */}
          <div className="p-6 md:p-8 min-h-[400px]">
            <Outlet context={{ saloonDetails }} />
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default HomeSaloonsDetails;