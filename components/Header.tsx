import Link from 'next/link';
import React from 'react';

export default function Header() {
  return (
    <header className="w-full max-w-full">
      {/* Keep header background white so it stands out over the page bg */}
      <Link href="/" className="flex items-center gap-2 no-underline bg-white rounded-md px-3 py-4 shadow-sm">
          <div className="relative w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-red-50">
            {/* Inline SVG logo to avoid external asset dependency */}
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="#c80a0a" />
              <text x="12" y="16" textAnchor="middle" fontSize="9" fill="#fff" fontFamily="Arial, Helvetica, sans-serif">MFU</text>
            </svg>
          </div>

        <div className="text-lg font-semibold">
          <span className="text-red-600 mr-1">MFU</span>
          <span className="text-black">Activity Board</span>
        </div>
      </Link>
    </header>
  );
}
