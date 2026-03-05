import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ─── Time slots available each day ────────────────────────────────────────────
const ALL_TIME_SLOTS = [
  { time: "09:00 AM", booked: false },
  { time: "10:00 AM", booked: false },
  { time: "11:00 AM", booked: false },
  { time: "12:00 PM", booked: false },
  { time: "01:00 PM", booked: false },
  { time: "02:00 PM", booked: false },
  { time: "03:00 PM", booked: false },
  { time: "04:00 PM", booked: false },
  { time: "05:00 PM", booked: true },   // example booked slot
  { time: "06:00 PM", booked: false },
  { time: "07:00 PM", booked: false },
  { time: "08:00 PM", booked: false },
];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ─── Main Component ────────────────────────────────────────────────────────────

/**
 * DateTimePicker
 * Full-page modal (bottom-sheet style) matching the mobile mockup:
 *   - Salon name + location at top
 *   - Mode toggle (Visit Salon / Salon at Home) driven by `mode` prop
 *   - Monthly calendar with pink selected-day circle
 *   - 3-column time-slot grid
 *   - Legend: Available / Selected / Booked
 *   - Confirm Booking button (enabled only when date + time selected)
 *
 * Props:
 *   isOpen    {boolean}  – whether the picker is visible
 *   onClose   {fn}       – called when user taps back / close
 *   onConfirm {fn}       – called with { day, month, year, time } on confirm
 *   mode      {string}   – "home" | "salon"  (controls which toggle pill is active)
 *   salonName {string}   – salon name to display in the header
 *   salonLocation {string} – e.g. "Gomti Nagar, Lucknow"
 */
const DateTimePicker = ({
  isOpen,
  onClose,
  onConfirm,
  mode = "salon",
  salonName = "",
  salonLocation = "",
}) => {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [selectedTime, setSelectedTime] = useState(null);

  if (!isOpen) return null;

  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  // Calendar starts on Sunday (getDay() === 0)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () =>
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  const handleNextMonth = () =>
    setViewDate(new Date(currentYear, currentMonth + 1, 1));

  const handleConfirm = () => {
    if (!selectedDay || !selectedTime) return;
    onConfirm({
      day: selectedDay,
      month: MONTH_NAMES[currentMonth],
      year: currentYear,
      time: selectedTime,
    });
  };

  // Label for "Select Time" heading (e.g. "Tue, February 24")
  const selectedDateLabel = selectedDay
    ? `${new Date(currentYear, currentMonth, selectedDay).toLocaleDateString("en-US", {
      weekday: "short",
    })}, ${MONTH_NAMES[currentMonth]} ${selectedDay}`
    : "";

  const canConfirm = !!selectedDay && !!selectedTime;

  // Mode-based labels — matches the React Native app toggle
  const isHome = mode === "home";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
      {/* Modal panel */}
      <div className="bg-pink-50 w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl max-h-[95vh] flex flex-col">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 bg-pink-50">
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-pink-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h2 className="text-lg font-bold text-gray-900">Choose Date &amp; Time</h2>
          <div className="w-9" /> {/* spacer */}
        </div>

        {/* ── Scrollable Body ── */}
        <div className="overflow-y-auto flex-1 px-4 pb-4 space-y-4">

          {/* ── Salon name + city under the header ── */}
          {salonName && (
            <div className="text-center -mt-1 mb-1">
              <p className="text-base font-bold text-gray-900">{salonName}</p>
              {salonLocation && (
                <p className="text-xs text-gray-500 mt-0.5">{salonLocation}</p>
              )}
            </div>
          )}

          {/* ── Mode Toggle — Visit Salon / Salon at Home ── */}
          <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm space-y-2">
            <div className="flex gap-2">
              {/* Visit Salon pill */}
              <div
                className={`flex-1 py-2.5 rounded-2xl text-xs font-bold text-center transition-all ${!isHome
                  ? "bg-[#EA8491] text-white shadow"
                  : "bg-white text-gray-400 border border-gray-100"
                  }`}
              >
                Visit Salon
              </div>
              {/* Salon at Home pill */}
              <div
                className={`flex-1 py-2.5 rounded-2xl text-xs font-bold text-center transition-all ${isHome
                  ? "bg-[#EA8491] text-white shadow"
                  : "bg-white text-gray-400 border border-gray-100"
                  }`}
              >
                Service at Home
              </div>
            </div>
            <p className="text-center text-xs text-gray-400">
              {isHome
                ? "A professional will visit you at your home."
                : "You will visit the salon at selected time."}
            </p>
          </div>

          {/* ── Select Date ── */}
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-3">Select Date</h3>

            {/* Calendar card */}
            <div className="bg-white rounded-2xl p-4">
              {/* Month nav */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={handlePrevMonth}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-pink-50 text-rose-400 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-bold text-gray-900">
                  {MONTH_NAMES[currentMonth]} {currentYear}
                </span>
                <button
                  onClick={handleNextMonth}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-pink-50 text-rose-400 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Day-of-week headers */}
              <div className="grid grid-cols-7 mb-2">
                {DAY_LABELS.map((d) => (
                  <div key={d} className="text-center text-[11px] text-gray-400 font-medium py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7">
                {/* Leading empty cells */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`pad-${i}`} />
                ))}

                {/* Day buttons */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const isSelected = day === selectedDay;
                  const isToday =
                    day === today.getDate() &&
                    currentMonth === today.getMonth() &&
                    currentYear === today.getFullYear();
                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`aspect-square flex items-center justify-center text-sm rounded-full transition-all mx-auto w-9 h-9 ${isSelected
                        ? "bg-[#EA8491] text-white font-bold shadow-sm"
                        : isToday
                          ? "text-[#EA8491] font-bold"
                          : "text-gray-700 hover:bg-pink-50"
                        }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Select Time ── */}
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-3">
              Select Time{" "}
              {selectedDateLabel && (
                <span className="text-sm font-medium text-gray-400">
                  ({selectedDateLabel})
                </span>
              )}
            </h3>

            {/* 3-column time grid */}
            <div className="grid grid-cols-3 gap-2.5">
              {ALL_TIME_SLOTS.map((slot) => {
                const isSelected = selectedTime === slot.time;
                return (
                  <button
                    key={slot.time}
                    disabled={slot.booked}
                    onClick={() => setSelectedTime(slot.time)}
                    className={`py-3 rounded-xl text-xs font-semibold border text-center transition-all ${slot.booked
                      ? "text-gray-300 border-gray-100 bg-white cursor-not-allowed"
                      : isSelected
                        ? "text-[#EA8491] border-[#EA8491] bg-white font-bold"
                        : "text-gray-700 border-gray-200 bg-white hover:border-pink-200"
                      }`}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full border border-gray-300 inline-block" />
                <span className="text-[11px] text-gray-400">Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full border-2 border-[#EA8491] inline-block" />
                <span className="text-[11px] text-gray-400">Selected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full border border-gray-200 bg-gray-100 inline-block" />
                <span className="text-[11px] text-gray-400">Booked</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Sticky Confirm Button ── */}
        <div className="px-4 pt-3 pb-24 sm:pb-5 bg-pink-50 border-t border-pink-100/60">
          <button
            disabled={!canConfirm}
            onClick={handleConfirm}
            className={`w-full py-4 rounded-2xl text-base font-bold transition-all ${canConfirm
              ? "bg-[#EA8491] text-white shadow-lg active:scale-95"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateTimePicker;