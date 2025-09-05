import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

interface PlatformInfoBannerProps {
  className?: string;
  onDismiss?: () => void;
}

export function PlatformInfoBanner({ className = '', onDismiss }: PlatformInfoBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 relative ${className}`}>
      {/* Close Button */}
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
        aria-label="Close banner"
      >
        <X className="w-4 h-4" />
      </button>
      
      <div className="flex items-start gap-3 pr-8">
        <div className="flex-shrink-0 mt-1">
          <Info className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-medium text-blue-600">
            About ordering hardware
          </h3>
          <p className="text-sm text-gray-800 leading-normal">
          To expedite order fulfillment and manage high demand, employees are limited to one workstation and up to four monitors.
          </p>
        </div>
      </div>
    </div>
  );
}
