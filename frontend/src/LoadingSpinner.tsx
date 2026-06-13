import React from 'react';

export const LoadingSpinner = ({ className = "w-5 h-5" }: { className?: string }) => {
  return (
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