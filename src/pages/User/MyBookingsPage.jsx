import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBookings } from "../../redux/slice/userSlice";
import { Calendar, Clock, MapPin, Scissors, CreditCard, Filter } from "lucide-react";

const MyBookingsPage = () => {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.user);
  
  // State for the active filter tab
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    dispatch(fetchUserBookings());
  }, [dispatch]);

  // Filter logic
  const filteredBookings = useMemo(() => {
    if (!bookings) return [];
    if (activeTab === "all") return bookings;
    return bookings.filter(b => b.status?.toLowerCase() === activeTab.toLowerCase());
  }, [bookings, activeTab]);

  const tabs = [
    { id: "all", label: "All Bookings" },
    { id: "pending", label: "Upcoming" },
    { id: "completed", label: "Completed" },
    { id: "cancelled", label: "Cancelled" },
  ];

  const getStatusStyle = (status) => {
    const base = "px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize";
    switch (status?.toLowerCase()) {
      case "completed": return `${base} bg-emerald-100 text-emerald-700`;
      case "pending": return `${base} bg-amber-100 text-amber-700`;
      case "cancelled": return `${base} bg-rose-100 text-rose-700`;
      default: return `${base} bg-slate-100 text-slate-700`;
    }
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-96 text-gray-400 space-y-4">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="font-medium">Fetching your appointments...</p>
    </div>
  );

  return (
    <div className="max-w-full mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Bookings</h2>
        <p className="text-gray-500 mt-1">Track and manage your salon appointments</p>
      </header>

      {/* Modern Filter Tabs */}
      <div className="flex items-center space-x-1 bg-gray-200/50 p-1 rounded-xl mb-8 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-6">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Header */}
              <div className="p-5 flex justify-between items-start border-b border-gray-50">
                <div className="flex gap-4">
                   {/* Placeholder for Shop Image/Avatar */}
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                    <Scissors size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 leading-none mb-2">
                      {booking.providerId?.shopName}
                    </h3>
                    <div className="flex items-center text-gray-500 text-xs">
                      <MapPin size={12} className="mr-1" />
                      {booking.providerId?.location?.address}
                    </div>
                  </div>
                </div>
                <span className={getStatusStyle(booking.status)}>
                  {booking.status}
                </span>
              </div>

              {/* Appointment Stats */}
              <div className="px-5 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50/50">
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-widest">Date</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {new Date(booking.bookingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-widest">Time Slot</p>
                  <p className="text-sm font-semibold text-gray-700">{booking.timeSlot?.start}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-widest">Payment</p>
                  <p className="text-sm font-semibold text-gray-700 capitalize">{booking.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-widest">Amount</p>
                  <p className="text-sm font-bold text-blue-600">₹{booking.totalAmount}</p>
                </div>
              </div>

              {/* Services Toggle or List */}
              <div className="p-5">
                <p className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-widest">Services Included</p>
                <div className="flex flex-wrap gap-2">
                  {booking.serviceItems.map((item, idx) => (
                    <span key={idx} className="bg-white border border-gray-200 px-3 py-1 rounded-full text-xs text-gray-600 shadow-sm">
                      {item.service?.name} • ₹{item.service?.price}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">No {activeTab} bookings</h3>
            <p className="text-gray-500 text-sm">Try changing your filter or book a new service.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;