import React from 'react';

interface LogoProps {
  className?: string;
  theme?: 'dark' | 'light';
}

export const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10", theme = "dark" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={`transition-all duration-700 ${className}`}
    >
      <defs>
        <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00E5FF" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Hexagon Frame */}
      <path 
        d="M50 5L89 27.5V72.5L50 95L11 72.5V27.5L50 5Z" 
        className={`${theme === 'dark' ? 'fill-white/[0.03] stroke-white/10' : 'fill-slate-100/50 stroke-slate-200'}`}
        strokeWidth="2"
      />

      {/* The Interlock Symbol */}
      <g fill="url(#logo-grad)" style={theme === 'dark' ? { filter: 'url(#logo-glow)' } : {}}>
        <rect x="28" y="30" width="10" height="40" rx="2" />
        <rect x="38" y="45" width="24" height="10" rx="2" />
        <rect x="62" y="30" width="10" height="40" rx="2" />
        <rect x="62" y="30" width="16" height="10" rx="2" />
        <rect x="62" y="60" width="16" height="10" rx="2" />
      </g>

      {/* The Pulsing Core */}
      <rect x="45" y="45" width="10" height="10" rx="2" fill="#00E5FF">
        <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
      </rect>
    </svg>
  );
};
