import React from 'react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';

interface MapPlaceholderProps {
  address: string;
  className?: string;
}

export function MapPlaceholder({ address, className = "" }: MapPlaceholderProps) {
  return (
    <div className={`relative bg-gray-100 rounded-lg overflow-hidden ${className}`}>
      {/* Map Image */}
      <div className="relative w-full h-full">
        <Image
          src="/images/rws-google-map.png"
          alt="Delivery Location Map"
          fill
          className="object-cover"
          priority
        />
        
        {/* Overlay with address */}
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-4">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-white flex-shrink-0" />
            <p className="text-sm font-medium truncate">{address}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
