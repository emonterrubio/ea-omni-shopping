import React from 'react';
import Link from 'next/link';

export function RequestHardwareBanner() {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow p-6 flex flex-col items-center mt-8">
      <div className="text-2xl lg:text-3xl text-center font-semibold mb-2 text-gray-900">Can't find what you're looking for?</div>
      <div className="mb-4 text-sm lg:text-base text-gray-600 text-center font-regular">Your local IT team can assist with fulfilling a custom hardware request.</div>
      <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium text-base">Reach Out to Your Local IT Team</button>
    </div>
  );
} 