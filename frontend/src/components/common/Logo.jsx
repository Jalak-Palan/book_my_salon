import React from 'react';

const Logo = ({ className = "", size = "md" }) => {
  const isLarge = size === "lg";

  return (
    <div className={`flex items-center gap-2 select-none group cursor-pointer ${className}`}>
      {/* Icon Mark: Stylized Scissor-V */}
      <div className={`relative flex items-center justify-center ${isLarge ? 'w-14 h-14' : 'w-10 h-10'} bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl rotate-6 group-hover:rotate-0 transition-all duration-500 shadow-xl shadow-orange-200`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${isLarge ? 'w-8 h-8' : 'w-6 h-6'} -rotate-6 group-hover:rotate-0 transition-transform duration-500`}
        >
          {/* Stylized Scissors that form a V */}
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="18" r="3" />
          <path d="M20 4L8.12 15.88" />
          <path d="M4 4l11.88 11.88" />
        </svg>
      </div>

      {/* Text Branding */}
      <div className="flex flex-col -space-y-1.5">
        <div className={`flex items-center font-[900] italic leading-none ${isLarge ? 'gap-0.5' : 'gap-0'}`}>
          <span className={`${isLarge ? 'text-4xl' : 'text-2xl'} text-slate-800 tracking-tighter`}>B</span>

          {/* First O */}
          <span className={`${isLarge ? 'text-4xl' : 'text-2xl'} text-orange-500 tracking-tighter`}>O</span>

          {/* Second O */}
          <span className={`${isLarge ? 'text-4xl' : 'text-2xl'} text-orange-500 tracking-tighter`}>O</span>

          <span className={`${isLarge ? 'text-4xl' : 'text-2xl'} text-slate-800 tracking-tighter`}>K</span>
          <span className={`${isLarge ? 'text-4xl ml-1' : 'text-2xl ml-0.5'} text-orange-500 tracking-tighter`}>MY</span>
        </div>

        <div className="flex items-center gap-1.5 pl-0.5">
          <span className={`${isLarge ? 'text-[11px]' : 'text-[9px]'} font-extrabold text-slate-400 uppercase tracking-[0.4em]`}>SALON</span>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-slate-200 to-transparent rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default Logo;
