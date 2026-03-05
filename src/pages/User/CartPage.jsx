import React, { useEffect, useState } from "react";
import {
  Trash2,
  ChevronRight,
  ShoppingBag,
  Clock,
  Home,
  Store,
  Scissors,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createBooking } from "../../redux/slice/userSlice";
import DateTimePicker from "../../utils/DateTimePicker";
import toast from "react-hot-toast";
import { calculateTimeSlot } from "../../utils/TimeSlot";

const getCartKey = (userId) => `@user_cart_${userId}`;

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const userId = user?._id;

  const [cart, setCart] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSlotInfo, setActiveSlotInfo] = useState(null);
  const [bookings, setBookings] = useState({});

  useEffect(() => {
    if (!userId) return;
    const data = localStorage.getItem(getCartKey(userId));
    setCart(data ? JSON.parse(data) : []);
  }, [userId]);

  const removeService = (salonId, serviceId) => {
    const updated = cart
      .map((salon) =>
        salon.salonId === salonId
          ? {
              ...salon,
              services: salon.services.filter((s) => s._id !== serviceId),
            }
          : salon,
      )
      .filter((salon) => salon.services.length > 0);

    setCart(updated);
    localStorage.setItem(getCartKey(userId), JSON.stringify(updated));
  };

  const handleConfirmDateTime = (data) => {
    if (activeSlotInfo) {
      const key = `${activeSlotInfo.salonId}-${activeSlotInfo.mode}`;
      setBookings({ ...bookings, [key]: data });
    }
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    const bookingsPayload = [];

    cart.forEach((salon) => {
      const salonServicesByMode = {};

      salon.services.forEach((service) => {
        const mode = service.bookedMode || "salon";

        if (!salonServicesByMode[mode]) {
          salonServicesByMode[mode] = [];
        }

        salonServicesByMode[mode].push(service);
      });

      Object.entries(salonServicesByMode).forEach(([mode, services]) => {
        const slotKey = `${salon.salonId}-${mode}`;
        const slotData = bookings[slotKey];

        if (!slotData) return;

        const timeSlot = calculateTimeSlot(slotData.time, services);

        bookingsPayload.push({
          providerId: salon.salonId,
          services: services.map((s) => s._id),
          bookingDate: new Date(
  `${slotData.year}-${String(
    new Date(`${slotData.month} 1`).getMonth() + 1
  ).padStart(2, "0")}-${slotData.day}T00:00:00`
),

          timeSlot, // "10:00 AM - 11:00 AM"
          bookingType: mode === "home" ? "home_service" : "in_salon",
          serviceLocation:
  mode === "home"
    ? {
        address: slotData.address || "User Address",
        coordinates: {
          type: "Point",
          coordinates: [
            Number(slotData.lng) || 0,
            Number(slotData.lat) || 0,
          ],
        },
      }
    : undefined,

        });
      });
    });
    if (!bookingsPayload.length) {
      toast.error("Please schedule all slots");
      return;
    }

    try {
      await toast.promise(
        dispatch(createBooking({ bookings: bookingsPayload })).unwrap(),
        {
          loading: "Processing booking...",
          success: "Confirmed!",
          error: "Failed to book.",
        },
      );

      setCart([]);
      localStorage.removeItem(getCartKey(userId));
      navigate("/bookings");
    } catch (err) {
      console.error(err);
    }
  };

  const calculateTotals = () => {
    let salonTotal = 0;
    let homeTotal = 0;
    cart.forEach((salon) => {
      salon.services.forEach((s) => {
        const price = Number(s.price) || 0;
        const charge =
          s.bookedMode === "home" ? Number(s.homeServiceCharge) || 40 : 0;
        if (s.bookedMode === "home") homeTotal += price + charge;
        else salonTotal += price;
      });
    });
    return { salonTotal, homeTotal, grandTotal: salonTotal + homeTotal };
  };

  const { salonTotal, homeTotal, grandTotal } = calculateTotals();
  const requiredSlotsCount = cart.reduce(
    (acc, salon) =>
      acc + new Set(salon.services.map((s) => s.bookedMode || "salon")).size,
    0,
  );
  const scheduledSlotsCount = Object.keys(bookings).length;

  if (!cart.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FE] p-6">
        <div className="bg-white p-12 rounded-[40px] shadow-sm text-center max-w-md border border-slate-100">
          <div className="bg-pink-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={48} className="text-pink-400" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">
            Your cart is empty
          </h2>
          <p className="text-slate-500 mt-4 mb-8 text-lg">
            Time to add some sparkle! Browse our top-rated salons.
          </p>
          <button
            onClick={() => navigate("/salons")}
            className="w-full py-4 bg-pink-500 text-white rounded-2xl font-bold hover:bg-pink-600 transition-all shadow-lg shadow-pink-200"
          >
            Explore Salons
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FE] py-8 lg:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Brand Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center text-white font-bold italic text-xl shadow-lg shadow-pink-200">
                G
              </div>
              <span className="text-2xl font-black text-slate-800 tracking-tight">
                Glownify
              </span>
            </div>
            <h1 className="text-4xl font-black text-slate-900">
              Checkout <span className="text-pink-500">Summary</span>
            </h1>
          </div>
          <p className="text-slate-500 font-medium">
            {cart.length} Salon{cart.length > 1 ? "s" : ""} in your bag
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Services List */}
          <div className="lg:col-span-2 space-y-8">
            {cart.map((salon) => {
              const groups = [
                {
                  mode: "salon",
                  label: "At Salon",
                  icon: <Store size={18} />,
                  services: salon.services.filter(
                    (s) => s.bookedMode !== "home",
                  ),
                },
                {
                  mode: "home",
                  label: "At Home",
                  icon: <Home size={18} />,
                  services: salon.services.filter(
                    (s) => s.bookedMode === "home",
                  ),
                },
              ].filter((g) => g.services.length > 0);

              return (
                <div key={salon.salonId} className="space-y-4">
                  <div className="flex items-center gap-3 px-2">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Store size={22} className="text-pink-500" />
                    </div>
                    <h2 className="text-xl font-bold text-indigo-950 uppercase tracking-wide">
                      {salon.salonName}
                    </h2>
                  </div>

                  {groups.map((group) => {
                    const slotKey = `${salon.salonId}-${group.mode}`;
                    const timeData = bookings[slotKey];

                    return (
                      <div
                        key={group.mode}
                        className="bg-white rounded-4xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md"
                      >
                        {/* Group Header */}
                        <div className="px-8 py-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                          <div className="flex items-center gap-2 text-slate-600 font-semibold">
                            {group.icon}
                            <span>{group.label} Services</span>
                          </div>
                          <button
                            onClick={() => {
                              setActiveSlotInfo({
                                salonId: salon.salonId,
                                mode: group.mode,
                              });
                              setIsModalOpen(true);
                            }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                              timeData
                                ? "bg-green-50 text-green-600"
                                : "bg-pink-50 text-pink-500 hover:bg-pink-100"
                            }`}
                          >
                            <Clock size={16} />
                            {timeData
                              ? `${timeData.day} ${timeData.month}, ${timeData.time}`
                              : "Schedule Slot"}
                          </button>
                        </div>

                        {/* Services List */}
                        <div className="p-8 space-y-8">
                          {group.services.map((service) => (
                            <div
                              key={service._id}
                              className="flex justify-between items-center group"
                            >
                              <div className="flex gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform">
                                  {service.name
                                    .toLowerCase()
                                    .includes("hair") ? (
                                    <Scissors size={32} />
                                  ) : (
                                    <Sparkles size={32} />
                                  )}
                                </div>
                                <div>
                                  <h3 className="font-bold text-slate-800 text-xl">
                                    {service.name}
                                  </h3>
                                  <div className="flex items-center gap-4 mt-2">
                                    <p className="text-slate-500 font-medium">
                                      ₹{service.price}
                                    </p>
                                    {group.mode === "home" && (
                                      <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold uppercase">
                                        + ₹{service.homeServiceCharge || 40}{" "}
                                        Home Fee
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() =>
                                  removeService(salon.salonId, service._id)
                                }
                                className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Right Column: Sticky Price Summary */}
          <div className="lg:sticky lg:top-8 space-y-6">
            <div className="bg-white rounded-[40px] shadow-xl shadow-pink-100/20 border border-slate-100 overflow-hidden">
              <div className="p-8">
                <h3 className="text-xl font-black text-slate-800 mb-6">
                  Order Total
                </h3>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-slate-500 font-medium">
                    <span>Pay at Salons</span>
                    <span className="text-slate-800">₹{salonTotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 font-medium">
                    <span>Pay at Home</span>
                    <span className="text-slate-800">₹{homeTotal}</span>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Grand Total
                      </p>
                      <p className="text-3xl font-black text-pink-500">
                        ₹{grandTotal}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 mb-8">
                  <div className="flex gap-3 items-start">
                    <ShieldCheck
                      className="text-green-500 shrink-0"
                      size={20}
                    />
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Safe & Secure Bookings. You only pay after your service is
                      completed.
                    </p>
                  </div>
                </div>

                <button
                  disabled={scheduledSlotsCount < requiredSlotsCount}
                  onClick={handleSubmit}
                  className={`w-full py-5 rounded-2xl text-lg font-black transition-all shadow-lg ${
                    scheduledSlotsCount < requiredSlotsCount
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                      : "bg-pink-500 text-white hover:bg-pink-600 shadow-pink-200 active:scale-[0.98]"
                  }`}
                >
                  {scheduledSlotsCount < requiredSlotsCount
                    ? `Set ${requiredSlotsCount - scheduledSlotsCount} More Slot(s)`
                    : "Confirm Booking"}
                </button>
              </div>
            </div>

            {/* Support Box */}
            <div className="bg-indigo-950 rounded-4xl p-8 text-white">
              <h4 className="font-bold mb-2">Need Help?</h4>
              <p className="text-indigo-200 text-sm mb-4">
                Our beauty experts are here to assist you with your booking.
              </p>
              <button className="text-pink-400 font-bold text-sm hover:underline">
                Chat with Support
              </button>
            </div>
          </div>
        </div>
      </div>

      <DateTimePicker
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDateTime}
      />
    </div>
  );
};

export default CartPage;
