import React, { useState } from "react";
import { ArrowRight } from 'lucide-react';

const BasicInfoRegistrationForm = ({ onNext, data, onChange, theme }) => {
  const isPurple = theme === "purple";

  // Themed styles
  const inputStyle = isPurple
    ? "w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all bg-gray-50/50 hover:bg-white"
    : "mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500";

  const btnPrimary = isPurple
    ? "flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-purple-200 active:scale-95"
    : "w-full sm:w-40 py-2 rounded-md text-white font-medium text-sm bg-linear-to-r from-[#5F3DC4] via-[#6D4BCF] to-[#7B5DE8] shadow-lg hover:opacity-90 transition active:scale-95 tracking-wide";

  if (isPurple) {
    return (
      <div className="w-full">
        {/* Section header */}
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Basic Salon Information</h2>
          <p className="text-gray-400 text-sm">Enter your salon details to get started</p>
        </div>

        {/* Form card with grey bg + border */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Salon Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 ml-1 uppercase">Salon Name</label>
              <input
                name="salonname"
                value={data.salonname}
                onChange={(e) => onChange(e.target.name, e.target.value)}
                type="text"
                placeholder="Enter Salon Name"
                className={inputStyle}
              />
            </div>

            {/* Salon Type */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 ml-1 uppercase">Salon Type</label>
              <select
                name="salonType"
                value={data.salonType}
                onChange={(e) => onChange(e.target.name, e.target.value)}
                className={inputStyle}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>

            {/* Mobile Number */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 ml-1 uppercase">Mobile Number</label>
              <input
                name="mobileno"
                value={data.mobileno}
                onChange={(e) => onChange(e.target.name, e.target.value)}
                type="text"
                placeholder="Enter Mobile Number"
                className={inputStyle}
              />
            </div>

            {/* WhatsApp Number */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 ml-1 uppercase">WhatsApp Number</label>
              <input
                name="watsupno"
                value={data.watsupno}
                onChange={(e) => onChange(e.target.name, e.target.value)}
                type="text"
                placeholder="Enter WhatsApp Number"
                className={inputStyle}
              />
            </div>

            {/* Email */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-gray-500 ml-1 uppercase">
                Email <span className="text-gray-400 normal-case">(Optional)</span>
              </label>
              <input
                name="email"
                value={data.email}
                onChange={(e) => onChange(e.target.name, e.target.value)}
                type="email"
                placeholder="Enter Email Address"
                className={inputStyle}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={() => onNext(data)}
            className={btnPrimary}
          >
            Continue <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // ── Original (non-themed) layout ──
  return (
    <div className="w-full max-w-md sm:max-w-lg bg-white rounded-lg shadow-md px-4 sm:px-6 py-6">

      {/* Form Header */}
      <div className="mt-6 sm:mt-8 mb-4">
        <p className="text-center text-xs sm:text-sm text-gray-500 mt-2 mb-6">
          Enter your salon details to get started.
        </p>
      </div>

      {/* Form */}
      <div className="pt-6 sm:pt-8 py-6">
        {/* Salon Name */}
        <div className="mb-4">
          <label className="text-sm text-gray-700 font-medium">Salon Name</label>
          <input
            name="salonname"
            value={data.salonname}
            onChange={(e) => onChange(e.target.name, e.target.value)}
            type="text"
            placeholder="Enter Salon Name"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Salon Type */}
        <div className="mb-4">
          <label className="text-sm text-gray-700 font-medium block mb-2">
            Salon Type
          </label>
          <div className="flex flex-wrap gap-4 sm:gap-6 text-sm text-gray-700">
            {["Male", "Female", "Unisex"].map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="salonType"
                  value={type}
                  checked={data.salonType === type}
                  onChange={(e) => onChange(e.target.name, e.target.value)}
                  className="accent-purple-600"
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* Mobile Number */}
        <div className="mb-4">
          <label className="text-sm text-gray-700 font-medium">Mobile Number</label>
          <div className="mt-1 flex w-full">
            <select className="border border-gray-300 rounded-l-md px-2 text-sm focus:outline-none bg-gray-50">
              <option>+91</option>
            </select>
            <input
              name="mobileno"
              value={data.mobileno}
              onChange={(e) => onChange(e.target.name, e.target.value)}
              type="text"
              placeholder="Enter Mobile Number"
              className="w-full border border-gray-300 rounded-r-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Used for Contact & WhatsApp</p>
        </div>

        {/* Whatsapp Number */}
        <div className="mb-4">
          <label className="text-sm text-gray-700 font-medium">Whatsapp Number</label>
          <div className="mt-1 flex w-full">
            <select className="border border-gray-300 rounded-l-md px-2 text-sm focus:outline-none bg-gray-50">
              <option>+91</option>
            </select>
            <input
              name="watsupno"
              value={data.watsupno}
              onChange={(e) => onChange(e.target.name, e.target.value)}
              type="text"
              placeholder="Enter Whatsapp Number"
              className="w-full border border-gray-300 rounded-r-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Same as Mobile or Enter Different Number</p>
        </div>

        {/* Email */}
        <div className="mb-6">
          <label className="text-sm text-gray-700 font-medium">
            Email <span className="text-gray-400">(Optional)</span>
          </label>
          <input
            name="email"
            value={data.email}
            onChange={(e) => onChange(e.target.name, e.target.value)}
            type="email"
            placeholder="Enter Email Address"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            onClick={() => onNext(data)}
            className={btnPrimary}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoRegistrationForm;