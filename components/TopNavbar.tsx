import svgPaths from "../lib/svg-pfzv1oe4vh";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// Logo image imported from src — this ensures the asset is bundled and provides a .src URL
import logoImg from "../src/logo-mfu-v2.png";
// Use a small inline placeholder data URL for logo/avatar to avoid requiring external PNG files
const PLACEHOLDER_DATA_URL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

// Small hamburger icon used for the menu button (inline SVG so we don't rely on an external image)
function HamburgerIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? 'w-6 h-6'} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6h18" stroke="#1E1E1E" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M3 12h18" stroke="#1E1E1E" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M3 18h18" stroke="#1E1E1E" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <div className="size-[26px] ml-[6px] mt-px relative overflow-clip">
      <div className="absolute bottom-[20.88%] left-1/4 right-[25.05%] top-[29.17%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
          <g>
            <path 
              clipRule="evenodd" 
              d={svgPaths.pe4dc0} 
              fill="#898989" 
              fillOpacity="0.75" 
              fillRule="evenodd" 
            />
            <path 
              clipRule="evenodd" 
              d={svgPaths.p3b2fc00} 
              fill="#898989" 
              fillOpacity="0.75" 
              fillRule="evenodd" 
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

interface TopNavbarProps {
  onMenuClick: () => void;
}

export function TopNavbar({ onMenuClick }: TopNavbarProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');

  // keep input in sync with query param when on FeedPage
  useEffect(() => {
    const q = typeof router.query.q === 'string' ? router.query.q : '';
    setSearch(q);
  }, [router.query.q]);

  function submitSearch() {
    const q = (search || '').trim();
    router.push(`/FeedPage${q ? `?q=${encodeURIComponent(q)}` : ''}`);
  }
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      {/* EDITED: Fixed topbar wrapper - this is the container that keeps the top bar pinned to the top */}
      <div className="h-14 px-4 flex items-center gap-6 w-full">
      {/* Menu Icon */}
      <button 
        onClick={onMenuClick}
        className="size-[28px] cursor-pointer hover:opacity-80 transition-opacity shrink-0"
        aria-label="Toggle menu"
      >
        {/* EDITED: use inline SVG hamburger icon instead of external image */}
        <HamburgerIcon className="w-6 h-6" />
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="h-[50px] w-[36px] flex items-center justify-center  rounded-md">
          {/* Inline SVG symbol }
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#c80a0a" />
            <text x="12" y="16" textAnchor="middle" fontSize="9" fill="#fff" fontFamily="Arial, Helvetica, sans-serif">MFU</text>
          </svg>*/}
          {/* Use imported image module's .src so Next/webpack resolves it even when not in public/ */}
          <img src={logoImg?.src ?? PLACEHOLDER_DATA_URL} alt="Mae Fah Luang" />
        </div>
        <p className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[28px] text-[#c80a0a] text-[22px] text-nowrap tracking-[-0.26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          <span>{`MFU `}</span>
          <span className="text-black">Activity Board</span>
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-[400px] relative">
          <div className="bg-white h-[28px] relative rounded-[50px] border border-[rgba(0,0,0,0.25)]">
          <div className="absolute left-2 top-1/2 -translate-y-1/2">
            <SearchIcon />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); submitSearch(); } }}
            placeholder="Find activities,clubs organizer..."
            className="w-full h-full bg-transparent font-['SF_Pro:Regular',sans-serif] font-normal text-[#898989] text-[12px] outline-none border-none pl-10 pr-4"
            style={{ fontVariationSettings: "'wdth' 100" }}
          />
          {/* clicking the search icon should also submit */}
          <button aria-label="search" onClick={submitSearch} className="absolute right-1 top-0 bottom-0 px-2">
            <SearchIcon />
          </button>
        </div>
      </div>

      {/* Profile */}
      <div className="flex items-center gap-3 ml-auto shrink-0">
        <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[20px] text-[15px] text-black text-nowrap tracking-[-0.23px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Miss Jane Doe
        </p>
        <div className="overflow-clip rounded-full size-[36px] bg-gray-100 flex items-center justify-center">
          {/* small avatar circle */}
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="8" r="3" fill="#c80a0a" />
            <path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="#e5e7eb" />
          </svg>
        </div>
      </div>
      </div>
      {/* EDITED: End of fixed topbar wrapper */}
    </div>
  );
}
