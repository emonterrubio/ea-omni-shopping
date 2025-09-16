import React from 'react';

export function SupportBanner() {
  return (
    <div className="bg-white ounded-lg shadow-sm hover:shadow-lg transition-shadow p-6 flex flex-col items-center mt-8">
      <div className="text-2xl lg:text-3xl text-center font-semibold mb-2 text-gray-900">Need help making a choice?</div>
      <div className="mb-4 text-sm lg:text-base text-gray-600 text-center font-regular">Talk to one of our IT experts</div>
      <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium text-base">Start a Conversation</button>
    </div>
  );
} 