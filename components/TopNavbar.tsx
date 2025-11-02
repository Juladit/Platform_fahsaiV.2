import svgPaths from "../pages/svg-pfzv1oe4vh";
const placeholder = "/img/logo-mfu-v2.png";
const imgImage5 = placeholder;
const img = placeholder;
const imgMenuIcon = placeholder;

function SearchIcon() {
  return (
    <div className="size-[24px] ml-[6px] mt-px relative overflow-clip">
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
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-6 w-full shadow-sm">
      {/* Menu Icon */}
      <button 
        onClick={onMenuClick}
        className="size-[28px] cursor-pointer hover:opacity-80 transition-opacity shrink-0"
      >
  <img alt="Menu" className="size-full object-contain" src={imgMenuIcon} />
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="h-[36px] w-[39px]">
          <img alt="" className="size-full object-cover" src={imgImage5} />
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
            placeholder="Find activities,clubs organizer..."
            className="w-full h-full bg-transparent font-['SF_Pro:Regular',sans-serif] font-normal text-[#898989] text-[12px] outline-none border-none pl-10 pr-4"
            style={{ fontVariationSettings: "'wdth' 100" }}
          />
        </div>
      </div>

      {/* Profile */}
      <div className="flex items-center gap-3 ml-auto shrink-0">
        <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[20px] text-[15px] text-black text-nowrap tracking-[-0.23px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Miss Jane Doe
        </p>
        <div className="overflow-clip rounded-full size-[36px]">
          <img alt="" className="size-full object-cover" src={img} />
        </div>
      </div>
    </div>
  );
}
