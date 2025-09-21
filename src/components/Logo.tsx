import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'full', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: {
      container: 'w-8 h-8',
      icon: 'w-6 h-6',
      text: 'text-lg',
      tagline: 'text-xs'
    },
    md: {
      container: 'w-10 h-10',
      icon: 'w-8 h-8',
      text: 'text-2xl',
      tagline: 'text-sm'
    },
    lg: {
      container: 'w-12 h-12',
      icon: 'w-10 h-10',
      text: 'text-3xl',
      tagline: 'text-base'
    },
    xl: {
      container: 'w-16 h-16',
      icon: 'w-14 h-14',
      text: 'text-4xl',
      tagline: 'text-lg'
    }
  };

  const currentSize = sizeClasses[size];

  const ReportIcon = () => (
    <div className={`${currentSize.icon} relative`}>
      {/* Front document with pie chart */}
      <div className="absolute inset-0 bg-white dark:bg-slate-900 border-2 border-purple-600 dark:border-purple-400 rounded-lg transform rotate-1 shadow-lg">
        {/* Pie chart */}
        <div className="absolute top-2 left-2 w-3 h-3 rounded-full border-2 border-purple-600 dark:border-purple-400">
          <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-purple-600 dark:bg-purple-400 rounded-full transform -translate-x-1/2"></div>
        </div>
        {/* Horizontal lines */}
        <div className="absolute bottom-2 left-2 right-2 space-y-0.5">
          <div className="h-0.5 bg-purple-600 dark:bg-purple-400 rounded w-3/4"></div>
          <div className="h-0.5 bg-purple-600 dark:bg-purple-400 rounded w-1/2"></div>
          <div className="h-0.5 bg-purple-600 dark:bg-purple-400 rounded w-2/3"></div>
        </div>
      </div>
      
      {/* Back document */}
      <div className="absolute inset-0 bg-white dark:bg-slate-900 border-2 border-purple-500 dark:border-purple-500 rounded-lg transform -rotate-1 -translate-x-1 -translate-y-1 opacity-80">
        <div className="absolute top-2 left-2 right-2 space-y-0.5">
          <div className="h-0.5 bg-purple-500 dark:bg-purple-500 rounded w-full"></div>
          <div className="h-0.5 bg-purple-500 dark:bg-purple-500 rounded w-3/4"></div>
          <div className="h-0.5 bg-purple-500 dark:bg-purple-500 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );

  const LogoSvg = () => (
    <svg 
      className={currentSize.icon}
      viewBox="0 0 40 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Front document */}
      <rect 
        x="4" 
        y="6" 
        width="20" 
        height="26" 
        rx="2" 
        fill="currentColor" 
        className="text-purple-600 dark:text-purple-400"
        stroke="currentColor"
        strokeWidth="1.5"
        transform="rotate(3 14 19)"
      />
      
      {/* Pie chart on front document */}
      <circle 
        cx="12" 
        cy="14" 
        r="4" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5"
        className="text-white dark:text-slate-900"
      />
      <path 
        d="M12 14 L16 14 A4 4 0 0 1 12 18 Z" 
        fill="currentColor" 
        className="text-white dark:text-slate-900"
      />
      
      {/* Horizontal lines on front document */}
      <rect x="8" y="22" width="12" height="1" rx="0.5" fill="currentColor" className="text-white dark:text-slate-900" />
      <rect x="8" y="24" width="8" height="1" rx="0.5" fill="currentColor" className="text-white dark:text-slate-900" />
      <rect x="8" y="26" width="10" height="1" rx="0.5" fill="currentColor" className="text-white dark:text-slate-900" />
      
      {/* Back document */}
      <rect 
        x="2" 
        y="4" 
        width="20" 
        height="26" 
        rx="2" 
        fill="currentColor" 
        className="text-purple-500 dark:text-purple-500"
        stroke="currentColor"
        strokeWidth="1.5"
        transform="rotate(-3 12 17)"
        opacity="0.8"
      />
      
      {/* Lines on back document */}
      <rect x="6" y="12" width="12" height="1" rx="0.5" fill="currentColor" className="text-white dark:text-slate-900" />
      <rect x="6" y="14" width="9" height="1" rx="0.5" fill="currentColor" className="text-white dark:text-slate-900" />
      <rect x="6" y="16" width="7" height="1" rx="0.5" fill="currentColor" className="text-white dark:text-slate-900" />
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <LogoSvg />
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={`flex flex-col items-start ${className}`}>
        <span className={`${currentSize.text} font-bold text-purple-600 dark:text-purple-400 tracking-wide`}>
          REPORT SONIC
        </span>
        <div className="w-full h-0.5 bg-pink-500 dark:bg-pink-400 mt-1"></div>
        <span className={`${currentSize.tagline} text-pink-500 dark:text-pink-400 font-medium mt-1`}>
          beautify your data
        </span>
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoSvg />
      <div className="flex flex-col">
        <span className={`${currentSize.text} font-bold text-purple-600 dark:text-purple-400 tracking-wide`}>
          REPORT SONIC
        </span>
        <div className="w-full h-0.5 bg-pink-500 dark:bg-pink-400 mt-1"></div>
        <span className={`${currentSize.tagline} text-pink-500 dark:text-pink-400 font-medium mt-1`}>
          beautify your data
        </span>
      </div>
    </div>
  );
};

export default Logo;
