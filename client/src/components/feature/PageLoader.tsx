import React from 'react';

export default function PageLoader() {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="relative w-24 h-24">
        {/* Green spinning ring - thin ring */}
        <div className="absolute inset-0 border-2 border-transparent border-t-[#7fc345] rounded-full animate-spin"></div>

        {/* Refex logo in center - prefer local asset, fallback to remote */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="/assets/logos/refex-logo.png"
            alt="Refex Industries Limited"
            className="w-16 h-16 object-contain"
            onError={(e) => {
              // Fallback to remote SVG if local asset not found
              (e.target as HTMLImageElement).src = 'https://refex.co.in/wp-content/uploads/2024/07/logo-refex.svg';
            }}
          />
        </div>
      </div>
    </div>
  );
}

