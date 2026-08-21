import React from 'react';

interface LogoProps {
  variant?: 'full' | 'icon-only' | 'navbar' | 'splash' | 'compact';
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  theme = 'auto',
  className = '',
  onClick
}) => {
  const isDark = theme === 'dark';

  // Icon only mark
  const iconGraphic = (
    <div className="relative flex items-center justify-center">
      <svg
        width="38"
        height="38"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transform transition-transform duration-300 hover:scale-105"
      >
        <defs>
          <linearGradient id="qbGradPrimary" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF4500" />
            <stop offset="0.5" stopColor="#FF6B00" />
            <stop offset="1" stopColor="#FFA000" />
          </linearGradient>
          <linearGradient id="qbGradAccent" x1="20" y1="12" x2="44" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#10B981" />
            <stop offset="1" stopColor="#059669" />
          </linearGradient>
          <filter id="qbGlow" x="0" y="0" width="48" height="48" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#FF6B00" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Outer Circular Speed Halo */}
        <circle cx="24" cy="24" r="20" stroke="url(#qbGradPrimary)" strokeWidth="3.5" strokeDasharray="95 20" strokeLinecap="round" />
        
        {/* Dynamic 'Q' Body with Bite Cutout Geometry */}
        <path
          d="M24 10C16.268 10 10 16.268 10 24C10 31.732 16.268 38 24 38C28.18 38 31.94 36.17 34.54 33.27L39 37.73C35.34 41.59 30.13 44 24 44C12.954 44 4 35.046 4 24C4 12.954 12.954 4 24 4C31.5 4 37.9 8.1 41.2 14.3C38.2 13.6 35 15 33.5 17.5C32.1 19.8 32.5 22.8 34.3 24.6C35.8 26.1 38 26.6 40 25.8C38.6 30 35.2 33.4 30.8 34.8L27 28.5H23V34.5C18.6 33.4 15.2 29.5 15.2 24.8C15.2 19.8 19.1 15.8 24 15.8C26.4 15.8 28.6 16.8 30.1 18.3L34.2 14.2C31.6 11.6 28 10 24 10Z"
          fill="url(#qbGradPrimary)"
        />

        {/* Emerald Fresh Leaf / Velocity Fin representing dietary vitality */}
        <path
          d="M31 8C33 13 38 15 42 14C41 19 36 21 31 19C30 14 31 10 31 8Z"
          fill="url(#qbGradAccent)"
        />
        
        {/* Lightning Accent Dot */}
        <circle cx="28" cy="24" r="3" fill="#FFFFFF" />
      </svg>
    </div>
  );

  if (variant === 'icon-only') {
    return (
      <div id="quickbite-logo-icon" className={`cursor-pointer inline-flex items-center ${className}`} onClick={onClick}>
        {iconGraphic}
      </div>
    );
  }

  if (variant === 'splash') {
    return (
      <div id="quickbite-logo-splash" className={`flex flex-col items-center justify-center text-center select-none ${className}`}>
        <div className="w-20 h-20 mb-4 flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-orange-500/10 to-emerald-500/10 border border-orange-500/20 shadow-xl shadow-orange-500/10">
          <svg width="64" height="64" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="20" stroke="url(#qbGradPrimary)" strokeWidth="4" strokeDasharray="100 20" />
            <path
              d="M24 10C16.268 10 10 16.268 10 24C10 31.732 16.268 38 24 38C28.18 38 31.94 36.17 34.54 33.27L39 37.73C35.34 41.59 30.13 44 24 44C12.954 44 4 35.046 4 24C4 12.954 12.954 4 24 4C31.5 4 37.9 8.1 41.2 14.3C38.2 13.6 35 15 33.5 17.5C32.1 19.8 32.5 22.8 34.3 24.6C35.8 26.1 38 26.6 40 25.8C38.6 30 35.2 33.4 30.8 34.8L27 28.5H23V34.5C18.6 33.4 15.2 29.5 15.2 24.8C15.2 19.8 19.1 15.8 24 15.8C26.4 15.8 28.6 16.8 30.1 18.3L34.2 14.2C31.6 11.6 28 10 24 10Z"
              fill="#FF6B00"
            />
            <path d="M31 8C33 13 38 15 42 14C41 19 36 21 31 19C30 14 31 10 31 8Z" fill="#10B981" />
          </svg>
        </div>
        <div className="flex items-center gap-1.5 font-black tracking-tight text-3xl">
          <span className="text-slate-900">QUICK</span>
          <span className="text-orange-600">BITE</span>
        </div>
        <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase mt-1">
          Thiruvananthapuram Food Discovery
        </p>
      </div>
    );
  }

  return (
    <div
      id="quickbite-logo-navbar"
      className={`cursor-pointer inline-flex items-center gap-2.5 select-none ${className}`}
      onClick={onClick}
    >
      {iconGraphic}
      <div className="flex flex-col">
        <div className="flex items-center tracking-tight font-extrabold leading-none text-xl md:text-2xl font-sans">
          <span className={isDark ? 'text-white' : 'text-slate-900'}>QUICK</span>
          <span className="text-orange-600 ml-1">BITE</span>
          <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
            TVM
          </span>
        </div>
        {variant === 'full' && (
          <span className={`text-[10px] font-medium tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Personalized Discovery
          </span>
        )}
      </div>
    </div>
  );
};
