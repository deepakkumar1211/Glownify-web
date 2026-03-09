import React, { memo } from 'react';
import { Check, Store, MapPin, FileImage } from 'lucide-react';

const SalonOwnerHeader = ({ green, icon1, green2, icon2 }) => {
    return (
        <div className="w-full bg-white">


            {/* Progress Navigation - Stepper Style */}
            <nav className="px-2 sm:px-4 py-4 sm:py-6 relative">
                {/* Progress Line Background — sits behind the icons */}
                <div className="absolute top-8 sm:top-10 left-[16.6%] right-[16.6%] h-0.5 bg-gray-100">
                    <div className="h-full bg-purple-200 transition-all duration-500" style={{ width: green2 ? '100%' : green ? '50%' : '0%' }}></div>
                </div>

                <div className="grid grid-cols-3 relative z-10">

                    {/* Step 1: Salon Info */}
                    <div className="flex flex-col items-center text-center gap-1 sm:gap-2">
                        <div className={`flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl shadow-sm transition-all duration-300 border-2 ${green ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-purple-600 text-purple-600'}`}>
                            {icon1 ? <Check size={18} strokeWidth={2.5} /> : <Store size={18} strokeWidth={2} />}
                        </div>
                        <div>
                            <p className={`text-[10px] sm:text-xs font-bold ${green ? 'text-green-600' : 'text-gray-800'}`}>Salon Info</p>
                            <p className="text-[8px] sm:text-[10px] uppercase tracking-wider text-gray-400 font-semibold hidden sm:block">Step 01</p>
                        </div>
                    </div>

                    {/* Step 2: Address */}
                    <div className="flex flex-col items-center text-center gap-1 sm:gap-2">
                        <div className={`flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl shadow-sm transition-all duration-300 border-2 ${green2 ? 'bg-green-500 border-green-500 text-white' : green ? 'bg-white border-purple-600 text-purple-600' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                            {icon2 ? <Check size={18} strokeWidth={2.5} /> : <MapPin size={18} strokeWidth={2} />}
                        </div>
                        <div>
                            <p className={`text-[10px] sm:text-xs font-bold ${green2 ? 'text-green-600' : green ? 'text-gray-800' : 'text-gray-400'}`}>Address</p>
                            <p className="text-[8px] sm:text-[10px] uppercase tracking-wider text-gray-400 font-semibold hidden sm:block">Step 02</p>
                        </div>
                    </div>

                    {/* Step 3: Documents */}
                    <div className="flex flex-col items-center text-center gap-1 sm:gap-2">
                        <div className={`flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl shadow-sm border-2 ${green2 ? 'bg-white border-purple-600 text-purple-600' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                            <FileImage size={18} strokeWidth={2} />
                        </div>
                        <div>
                            <p className={`text-[10px] sm:text-xs font-bold ${green2 ? 'text-gray-800' : 'text-gray-400'}`}>Documents</p>
                            <p className="text-[8px] sm:text-[10px] uppercase tracking-wider text-gray-400 font-semibold hidden sm:block">Step 03</p>
                        </div>
                    </div>

                </div>
            </nav>
        </div>
    );
};

export default memo(SalonOwnerHeader);
