import React from 'react';
import Link from 'next/link';

export function SupportBanner() {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow p-6 flex flex-col items-center mt-8">
      <div className="text-2xl font-medium mb-1">Need help?</div>
      <div className="mb-3 text-gray-600 text-center text-base">Talk to one of our IT experts</div>
      <Link
        href="/support"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Start a Conversation
      </Link>
    </div>
  );
}
