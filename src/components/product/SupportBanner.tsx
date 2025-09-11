import React from 'react';

export function SupportBanner() {
  return (
    <div className="bg-white ounded-lg shadow-sm hover:shadow-lg transition-shadow p-6 flex flex-col items-center mt-8">
      <div className="text-2xl font-medium mb-1">Need help making a choice?</div>
      <div className="mb-3 text-gray-600 text-center text-base">Talk to one of our IT experts</div>
      <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium text-base">Start a Conversation</button>
    </div>
  );
} 