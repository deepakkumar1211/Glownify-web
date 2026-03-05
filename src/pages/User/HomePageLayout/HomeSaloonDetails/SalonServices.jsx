import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchServiceItemByCategory } from "../../../../redux/slice/userSlice";
import { useOutletContext } from "react-router-dom";
import {
  Clock,
  Plus,
  Info,
  Minus,
  Home,
  Store,
  Smartphone,
  X,
} from "lucide-react";
import {
  addToCart,
  removeFromCart,
  getCart,
} from "../../../../utils/CartStorage";

const SalonServices = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state?.auth?.user?._id);
  const { saloonDetails } = useOutletContext();

  const [activeTab, setActiveTab] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  
  // 🔹 Modal State
  const [showModeModal, setShowModeModal] = useState(false);
  const [pendingService, setPendingService] = useState(null);

  const categories = saloonDetails?.serviceCategories || [];
  const selectedSalonId = saloonDetails?._id;
  const { serviceItems, loading } = useSelector((state) => state.user);

  useEffect(() => {
    if (userId) setCartItems(getCart(userId));
  }, [userId]);

  const handleTabClick = (categoryId) => {
    setActiveTab(categoryId);
    dispatch(fetchServiceItemByCategory({ salonId: selectedSalonId, categoryId }));
  };

  // 🔹 logic to handle adding with mode
  const initiateAddToCart = (service) => {
    if (service.serviceMode === "both") {
      setPendingService(service);
      setShowModeModal(true);
    } else {
      // If it's just 'home' or 'salon', use that directly
      confirmAddToCart(service, service.serviceMode);
    }
  };

  const confirmAddToCart = (service, selectedMode) => {
    const updated = addToCart(userId, saloonDetails, service, selectedMode);
    setCartItems(updated);
    setShowModeModal(false);
    setPendingService(null);
  };

  const handleRemoveFromCart = (serviceId) => {
    const updated = removeFromCart(userId, selectedSalonId, serviceId);
    setCartItems(updated);
  };

  const getServiceQuantity = (serviceId) => {
    const salon = cartItems.find((s) => s.salonId === selectedSalonId);
    const service = salon?.services.find((s) => s._id === serviceId);
    return service ? service.quantity || 1 : 0;
  };

  return (
    <div className="w-full bg-white min-h-cover relative">
      {/* 🔹 Selection Modal */}
      {showModeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModeModal(false)} />
          <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setShowModeModal(false)}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
            
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-[#5A2C1E]" />
              </div>
              <h3 className="text-xl font-black text-gray-900">Choose Service Mode</h3>
              <p className="text-gray-500 text-sm mt-2">Where would you like this service?</p>
            </div>

            <div className="grid gap-4">
              <button
                onClick={() => confirmAddToCart(pendingService, "salon")}
                className="flex items-center justify-between p-5 border-2 border-gray-100 rounded-2xl hover:border-[#5A2C1E] hover:bg-orange-50/30 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <Store className="w-6 h-6 text-[#5A2C1E]" />
                  <span className="font-bold text-gray-800">At Salon</span>
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-gray-200 group-hover:border-[#5A2C1E] flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-[#5A2C1E] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>

              <button
                onClick={() => confirmAddToCart(pendingService, "home")}
                className="flex items-center justify-between p-5 border-2 border-gray-100 rounded-2xl hover:border-[#5A2C1E] hover:bg-orange-50/30 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <Home className="w-6 h-6 text-[#5A2C1E]" />
                  <span className="font-bold text-gray-800">At Home</span>
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-gray-200 group-hover:border-[#5A2C1E] flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-[#5A2C1E] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Sticky Tabs */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b w-full px-6">
        <div className="flex overflow-x-auto no-scrollbar gap-8">
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => handleTabClick(category._id)}
              className={`relative py-5 text-xs font-black uppercase tracking-[0.15em] whitespace-nowrap transition-all
                ${activeTab === category._id ? "text-[#5A2C1E]" : "text-gray-400 hover:text-gray-600"}`}
            >
              {category.name}
              {activeTab === category._id && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#5A2C1E]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 🔹 Grid */}
      <div className="w-full p-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-60 bg-gray-50 animate-pulse rounded-3xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {serviceItems?.map((service) => {
              const qty = getServiceQuantity(service._id);
              return (
                <div key={service._id} className="flex flex-col bg-white border border-gray-100 rounded-[2rem] p-6 transition-all hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-1">
                  <div className="mb-4">
                    {service.serviceMode === "both" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-[10px] font-bold uppercase border border-purple-100">
                        <Smartphone className="w-3 h-3" /> Home & Salon
                      </span>
                    ) : service.serviceMode === "home" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase border border-blue-100">
                        <Home className="w-3 h-3" /> At Home
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-[10px] font-bold uppercase border border-orange-100">
                        <Store className="w-3 h-3" /> In Salon
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-xl font-bold text-gray-800 leading-tight">{service.name}</h4>
                    {service.discountPercent > 0 && <span className="text-green-600 font-black text-sm">{service.discountPercent}%</span>}
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-1 text-gray-400 text-xs font-medium"><Clock className="w-3.5 h-3.5" />{service.durationMins}m</div>
                    <button className="flex items-center gap-1 text-[#5A2C1E]/60 text-xs font-bold hover:underline"><Info className="w-3.5 h-3.5" /> Details</button>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wider">Price</span>
                      <p className="text-2xl font-black text-gray-900">₹{service.price}</p>
                    </div>

                    <div className="flex items-center">
                      {qty > 0 ? (
                        <button
                          onClick={() => handleRemoveFromCart(service._id)}
                          className="flex items-center gap-2 px-5 py-2.5 bg-red-50 border-2 border-red-200 text-red-600 font-black rounded-2xl hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-sm"
                        >
                          <Minus className="w-4 h-4" />
                          <span className="text-xs tracking-wider">REMOVE</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => initiateAddToCart(service)}
                          className="group/btn flex items-center gap-2 px-6 py-2.5 bg-white border-2 border-[#5A2C1E] text-[#5A2C1E] font-black rounded-2xl hover:bg-[#5A2C1E] hover:text-white transition-all active:scale-95 shadow-sm"
                        >
                          <Plus className="w-4 h-4 group-hover/btn:rotate-90 transition-transform duration-300" />
                          <span className="text-xs tracking-wider">ADD</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalonServices;