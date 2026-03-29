import React from 'react';

export const LoadingSpinner = ({ className = "w-5 h-5" }: { className?: string }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={`animate-spin ${className}`}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Hexagon Path */}
      <path 
        d="M50 5L89 27.5V72.5L50 95L11 72.5V27.5L50 5Z" 
        stroke="currentColor" 
        strokeWidth="8" 
        strokeOpacity="0.2"
      />
      {/* The "Loading" Segment */}
      <path 
        d="M50 5L89 27.5V40" 
        stroke="currentColor" 
        strokeWidth="8" 
        strokeLinecap="round"
      />
    </svg>
  );
};
