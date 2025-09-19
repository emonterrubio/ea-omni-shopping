"use client";

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the map components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

interface MapMarker {
  position: [number, number]; // [latitude, longitude]
  title: string;
  description?: string;
}

interface InteractiveMapProps {
  center: [number, number]; // [latitude, longitude]
  zoom?: number;
  markers?: MapMarker[];
  className?: string;
  height?: string;
}

export function InteractiveMap({ 
  center, 
  zoom = 13, 
  markers = [], 
  className = "",
  height = "400px"
}: InteractiveMapProps) {
  useEffect(() => {
    // Fix for default markers in Next.js
    const L = require('leaflet');
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  // Return a placeholder during SSR and initial client render
  if (typeof window === 'undefined') {
    return (
      <div 
        className={`bg-gray-200 rounded-lg flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg overflow-hidden ${className}`} style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker, index) => (
          <Marker key={index} position={marker.position}>
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-gray-900">{marker.title}</h3>
                {marker.description && (
                  <p className="text-sm text-gray-600 mt-1">{marker.description}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
