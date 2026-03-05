import React from 'react';

const Loader = ({ className = "text-[var(--accent)] w-12 h-12" }) => {
  return (
    <div className="flex items-center justify-center p-4">
      <div 
        className={`relative flex items-center justify-center animate-spin ${className}`} 
        style={{ animationDuration: '3s' }}
      >
        <svg viewBox="-5 -5 130 148.56" className="w-full h-full animate-pulse">
          <g stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Hexagon Base */}
            <path d="M60 0 L120 34.64 L120 103.92 L60 138.56 L0 103.92 L0 34.64 Z" />
            {/* Internal Intersecting Lines (Floral effect) */}
            <path d="M0 34.64 L120 103.92 M120 34.64 L0 103.92 M60 0 L60 138.56" />
            {/* Small detailed petals/leaves */}
            <path d="M60 69.28 Q 75 86.6 90 69.28 Q 75 51.96 60 69.28 Z" />
            <path d="M60 69.28 Q 45 86.6 30 69.28 Q 45 51.96 60 69.28 Z" />
            <path d="M60 138.56 Q 75 121.24 90 138.56 Q 75 155.88 60 138.56 Z" />
            <path d="M60 138.56 Q 45 121.24 30 138.56 Q 45 155.88 60 138.56 Z" />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Loader;
