import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

export default function Header() {
  return (
    <header className="w-full max-w-full">
      {/* Keep header background white so it stands out over the page bg */}
      <Link href="/" className="flex items-center gap-2 no-underline bg-white rounded-md px-3 py-4 shadow-sm">
        <div className="relative w-10 h-10 rounded-full overflow-hidden">
          {/* Place your logo file at /public/MFU_logo.png */}
          <img src="/img/logo-mfu-v2.png" alt="MFU logo" className="w-20 h-10 object-contain" />
        </div>

        <div className="text-lg font-semibold">
          <span className="text-red-600 mr-1">MFU</span>
          <span className="text-black">Activity Board</span>
        </div>
      </Link>
    </header>
  );
}
