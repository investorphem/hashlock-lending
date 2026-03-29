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
      className={`transition-all duration-500 ${className}`}
    >
      {/* The Background Hexagon (Blockchain Block)
        Reacts to theme toggle: Soft White/10 (Dark) or Soft Slate/100 (Light)
      */}
      <path 
        d="M50 5L89 27.5V72.5L50 95L11 72.5V27.5L50 5Z" 
        className={`${
          theme === 'dark' 
            ? 'fill-white/[0.03] stroke-white/10' 
            : 'fill-slate-100/50 stroke-slate-200'
        }`}
        strokeWidth="2"
      />

      {/* The "H" & "B" Interlock (HashLock + Bitcoin)
        Uses a strong gradient to represent the flow of secure code.
      */}
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00E5FF" /> {/* Electric Cyan */}
          <stop offset="100%" stopColor="#2563EB" /> {/* Blue 600 */}
        </linearGradient>
        
        {/* Glow effect for Dark Mode */}
        <filter id="glow" x="-20%" y="-20%" width="140%" h="140%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Interlocking 'Data Blocks' */}
      <g 
        fill="url(#logo-gradient)" 
        className={theme === 'dark' ? 'opacity-100' : 'opacity-90'}
        style={theme === 'dark' ? { filter: 'url(#glow)' } : {}}
      >
        {/* Left Side (H-Bar) */}
        <rect x="28" y="30" width="10" height="40" rx="2" />
        {/* Connection Bar */}
        <rect x="38" y="45" width="24" height="10" rx="2" />
        {/* Right Side (B-Bar forming lock) */}
        <rect x="62" y="30" width="10" height="40" rx="2" />
        <rect x="62" y="30" width="16" height="10" rx="2" />
        <rect x="62" y="60" width="16" height="10" rx="2" />
      </g>

      {/* The Centered "Verification Bit" (The Pulsing Heart)
        This bit is pure Electric Cyan, representing the immutable hash verification.
      */}
      <rect 
        x="45" 
        y="45" 
        width="10" 
        height="10" 
        rx="2" 
        fill="#00E5FF" 
        className="animate-pulse shadow-cyan-glow"
      />
    </svg>
  );
};
