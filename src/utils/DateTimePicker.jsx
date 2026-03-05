import React, { useState, useRef, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon, ChevronDown, RotateCcw } from "lucide-react";

const DateTimePicker = ({ isOpen, onClose, onConfirm }) => {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [selectedTime, setSelectedTime] = useState(null);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const yearListRef = useRef(null);

  useEffect(() => {
    if (showYearPicker && yearListRef.current) {
      const selectedYearElem = yearListRef.current.querySelector('[data-selected="true"]');
      if (selectedYearElem) {
        selectedYearElem.scrollIntoView({ block: 'center' });
      }
    }
  }, [showYearPicker]);

  if (!isOpen) return null;

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();

  // Calendar Logic
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const startingPadding = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  // Year Selection Logic (Range: 1950 to 2050)
  const years = Array.from({ length: 101 }, (_, i) => 1950 + i);

  const handlePrevMonth = () => setViewDate(new Date(currentYear, currentMonth - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(currentYear, currentMonth + 1, 1));
  const handleYearSelect = (year) => {
    setViewDate(new Date(year, currentMonth, 1));
    setShowYearPicker(false);
  };

  const handleGoToToday = () => {
    const today = new Date();
    setViewDate(today);
    setSelectedDate(today.getDate());
  };

  const timeSlots = [
    { time: "9:00 AM", status: "available" }, { time: "10:00 AM", status: "available" },
    { time: "11:00 AM", status: "available" }, { time: "12:00 PM", status: "available" },
    { time: "2:00 PM", status: "available" }, { time: "3:00 PM", status: "available" },
    { time: "4:00 PM", status: "available" }, { time: "5:00 PM", status: "available" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-gray-50 bg-white">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ChevronLeft size={24} className="text-gray-600" />
            </button>
            <h2 className="text-xl font-bold text-gray-800">Select Date & Time</h2>
          </div>
          <button onClick={handleGoToToday} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-[#3EB4C1] hover:bg-[#3EB4C1]/10 transition-colors">
            <RotateCcw size={14} /> Today
          </button>
        </div>

        <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100 h-full max-h-[80vh] overflow-y-auto md:overflow-visible">
          
          {/* Left Column: Calendar */}
          <div className="flex-1 p-6 lg:p-8 relative">
            <div className="flex justify-between items-center mb-6">
              <div className="relative">
                <button 
                  onClick={() => setShowYearPicker(!showYearPicker)}
                  className="flex items-center gap-2 group p-2 rounded-xl hover:bg-gray-50 transition-all"
                >
                  <CalendarIcon size={18} className="text-[#3EB4C1]" />
                  <span className="font-bold text-gray-800 text-lg">
                    {monthNames[currentMonth]} {currentYear}
                  </span>
                  <ChevronDown size={18} className={`text-gray-400 transition-transform ${showYearPicker ? 'rotate-180' : ''}`} />
                </button>

                {/* SCROLLABLE YEAR PICKER POPUP */}
                {showYearPicker && (
                  <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-gray-100 rounded-2xl shadow-xl z-10">
                    <div 
                      ref={yearListRef}
                      className="max-h-60 overflow-y-auto p-2 space-y-1 custom-scrollbar"
                    >
                      {years.map(year => (
                        <button
                          key={year}
                          data-selected={year === currentYear}
                          onClick={() => handleYearSelect(year)}
                          className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                            year === currentYear 
                            ? "bg-[#3EB4C1] text-white" 
                            : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-1">
                <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"><ChevronLeft size={22} /></button>
                <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"><ChevronRight size={22} /></button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-gray-400 mb-4 uppercase tracking-widest">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: startingPadding }).map((_, i) => <div key={`pad-${i}`} className="aspect-square" />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(day)}
                    className={`aspect-square flex items-center justify-center rounded-full text-sm transition-all ${
                      selectedDate === day 
                      ? "bg-[#3EB4C1] text-white font-bold shadow-lg shadow-[#3eb4c144] scale-110" 
                      : "hover:bg-gray-50 text-gray-600 font-medium"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Time Selection */}
          <div className="flex-1 p-6 lg:p-8 bg-gray-50/30">
            <div className="flex items-center gap-2 text-gray-800 font-bold mb-6 px-1">
              <Clock size={20} className="text-purple-500" />
              <span className="text-lg">Select Time</span>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
              {timeSlots.map((slot) => (
                <button
                  key={slot.time}
                  disabled={slot.status === "unavailable"}
                  onClick={() => setSelectedTime(slot.time)}
                  className={`py-4 px-2 rounded-2xl text-[11px] font-bold border transition-all ${
                    selectedTime === slot.time
                      ? "border-purple-600 bg-purple-50 text-purple-700 ring-2 ring-purple-100"
                      : slot.status === "unavailable"
                      ? "bg-gray-100 text-gray-300 border-transparent cursor-not-allowed line-through opacity-60"
                      : slot.status === "few"
                      ? "bg-orange-50 text-orange-700 border-orange-100 hover:border-orange-300"
                      : "bg-green-50 text-green-700 border-green-100 hover:border-green-300"
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>

            {/* Availability Legend */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Availability</p>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div> Available
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-400"></div> Few Left
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div> Unavailable
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-50 bg-white">
          <div className="text-center sm:text-left">
            {selectedTime ? (
              <p className="text-sm text-gray-500">
                Booking for: <span className="font-black text-[#8B5CF6] block sm:inline">
                  {monthNames[currentMonth]} {selectedDate}, {currentYear} @ {selectedTime}
                </span>
              </p>
            ) : (
              <p className="text-sm text-gray-400 font-medium italic">Please select a time slot...</p>
            )}
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button onClick={onClose} className="flex-1 sm:flex-none px-8 py-3.5 rounded-xl text-gray-500 font-bold hover:bg-gray-100 transition-colors uppercase text-[10px] tracking-widest">
              cancel
            </button>
            <button 
              disabled={!selectedTime}
              onClick={() => onConfirm({ day: selectedDate, month: monthNames[currentMonth], year: currentYear, time: selectedTime })}
              className={`flex-1 sm:flex-none px-12 py-3.5 rounded-xl font-bold transition-all shadow-lg active:scale-95 uppercase text-[10px] tracking-widest ${
                selectedTime ? "bg-[#8B5CF6] text-white hover:bg-[#7C3AED] shadow-purple-100" : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              confirm booking
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
      `}</style>
    </div>
  );
};

export default DateTimePicker;