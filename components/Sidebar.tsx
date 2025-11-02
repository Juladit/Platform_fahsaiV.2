import svgPaths from "../pages/svg-pfzv1oe4vh";
const placeholder = "/img/logo-mfu-v2.png";
const imgCalendar = placeholder;
const imgQrCode = placeholder;
const imgLogout = placeholder;

const X = ({ size = 24 }: { size?: number }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

function StashFeed() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g>
          <path d={svgPaths.pfcec980} fill="white" />
          <path d={svgPaths.p1fd52880} fill="white" />
        </g>
      </svg>
    </div>
  );
}

function IxUserProfileFilled() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g>
          <path clipRule="evenodd" d={svgPaths.p3ab38a80} fill="white" fillRule="evenodd" />
        </g>
      </svg>
    </div>
  );
}

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function MenuItem({ icon, label, active = false, onClick }: MenuItemProps) {
  return (
    <div 
      className="relative flex gap-[10px] items-center cursor-pointer hover:opacity-80 transition-opacity px-4 py-2" 
      onClick={onClick}
    >
      {active && (
        <div className="absolute bg-[#ffcc42] -left-2 rounded-full size-[42px] -z-10" />
      )}
      {icon}
      <p 
        className={`font-['SF_Pro:Regular',sans-serif] leading-[18px] text-[15px] text-nowrap text-white tracking-[-0.08px] ${
          active ? "font-semibold font-['Inter:Semi_Bold',sans-serif]" : "font-normal"
        }`}
        style={{ fontVariationSettings: "'wdth' 100" }}
      >
        {label}
      </p>
    </div>
  );
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed md:relative top-0 left-0 h-full bg-[#b53231] w-[240px] z-50 transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Close button (mobile only) */}
        <button
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 text-white hover:opacity-80 transition-opacity"
        >
          <X size={24} />
        </button>

        {/* Menu Items */}
        <div className="flex flex-col gap-[30px] mt-8 px-4">
          <MenuItem icon={<StashFeed />} label="Feed" active />
          <MenuItem 
            icon={<img alt="" className="size-[24px]" src={imgCalendar} />} 
            label="Calendar" 
          />
          <MenuItem 
            icon={<IxUserProfileFilled />} 
            label="My Activities" 
          />
          <MenuItem 
            icon={<img alt="" className="size-[24px]" src={imgQrCode} />} 
            label="Scan QR code" 
          />
        </div>

        {/* Logout - at bottom */}
        <div className="mt-auto mb-8 px-4">
          <div className="flex gap-[15px] items-center cursor-pointer hover:opacity-80 transition-opacity">
            <img alt="" className="size-[24px]" src={imgLogout} />
            <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[18px] text-[15px] text-nowrap text-white tracking-[-0.08px]" style={{ fontVariationSettings: "'wdth' 100" }}>
              Log out
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
