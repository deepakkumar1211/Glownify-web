import React from 'react';
import men from '../../../assets/men.png';
import woman from '../../../assets/woman.png';

export const GenderSwitch = ({ gender, setGender }) => {
  return (
    <div className="flex justify-center mt-10 mb-6 w-full px-4">
      {/* Main Container */}
      <div className="relative flex w-full max-w-md max-w-[95vw] p-1.5 bg-slate-100/80 backdrop-blur-2xl rounded-4xl border border-white shadow-inner">

        {/* Animated Sliding Background */}
        <div
          className={`absolute top-1.5 bottom-1.5 left-1.5 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] bg-white rounded-[1.7rem] shadow-[0_8px_20px_-6px_rgba(0,0,0,0.1)] ${gender === 'women'
              ? 'w-[calc(50%-6px)] translate-x-0'
              : 'w-[calc(50%-6px)] translate-x-full'
            }`}
        />

        {/* Women Tab */}
        <button
          onClick={() => setGender('women')}
          className={`relative z-10 flex flex-1 items-center justify-center gap-4 px-4 py-3 rounded-2xl transition-all duration-500 group ${gender === 'women' ? 'scale-100' : 'scale-95'
            }`}
        >
          <div className={`transition-transform duration-500 ${gender === 'women' ? 'scale-110 rotate-0' : 'scale-90 opacity-60 grayscale'}`}>
            <img className="w-12 h-12 md:w-14 md:h-14 object-contain" src={woman} alt="Women" />
          </div>
          <span className={`text-base md:text-lg font-black uppercase tracking-widest transition-colors duration-300 ${gender === 'women' ? 'text-rose-600' : 'text-slate-400'
            }`}>
            Women
          </span>
        </button>

        {/* Men Tab */}
        <button
          onClick={() => setGender('men')}
          className={`relative z-10 flex flex-1 items-center justify-center gap-4 px-4 py-3 rounded-2xl transition-all duration-500 group ${gender === 'men' ? 'scale-100' : 'scale-95'
            }`}
        >
          <div className={`transition-transform duration-500 ${gender === 'men' ? 'scale-110 rotate-0' : 'scale-90 opacity-60 grayscale'}`}>
            <img className="w-12 h-12 md:w-14 md:h-14 object-contain" src={men} alt="Men" />
          </div>
          <span className={`text-base md:text-lg font-black uppercase tracking-widest transition-colors duration-300 ${gender === 'men' ? 'text-slate-900' : 'text-slate-400'
            }`}>
            Men
          </span>
        </button>

      </div>
    </div>
  );
};