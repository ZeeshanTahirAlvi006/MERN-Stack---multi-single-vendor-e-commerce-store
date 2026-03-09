import React from 'react';

const Loader = ({ className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] w-full bg-white/60 backdrop-blur-sm ${className}`}>
      <div className="w-32 h-32">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* 1. The Shopping Bag Handle (Green) */}
          <path
            d="M35 30 C 35 10, 65 10, 65 30"
            stroke="#10b981" /* Custom Theme Accent */
            strokeWidth="4"
            strokeLinecap="round"
            className="animate-draw-handle"
          />

          {/* 2. The Main Hexagon (Gray) */}
          <path
            d="M50 25 L85 45 L85 80 L50 98 L15 80 L15 45 Z"
            stroke="#4b5563" /* Dark Gray */
            strokeWidth="3"
            strokeLinejoin="round"
            className="animate-draw-hex"
          />

          {/* 3. The Inner Floral/Geometric Detail (Simplified) */}
          <path
            d="M50 45 L50 75 M35 55 L65 65 M35 65 L65 55"
            stroke="#9ca3af"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="animate-fade-inner"
          />
        </svg>
      </div>
      <h2 className="mt-4 font-bold text-gray-600 tracking-widest animate-pulse">
        THE HIVE <span className="text-sm font-normal text-gray-400">PK</span>
      </h2>
    </div>
  );
};

export default Loader;
