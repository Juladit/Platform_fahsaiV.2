import svgPaths from "../lib/svg-pfzv1oe4vh";
import { useRouter } from 'next/router';

// SVG icon components used in the sidebar menu

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

function CalendarIcon() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="block size-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="5" width="18" height="16" rx="2" stroke="white" strokeWidth="1.5" />
        <path d="M3 10h18" stroke="white" strokeWidth="1.5" />
        <path d="M8 2v4" stroke="white" strokeWidth="1.5" />
        <path d="M16 2v4" stroke="white" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

function QrCodeIcon() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="block size-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="6" height="6" fill="white" />
        <rect x="15" y="3" width="6" height="6" fill="white" />
        <rect x="3" y="15" width="6" height="6" fill="white" />
        <rect x="11" y="11" width="2" height="2" fill="white" />
        <rect x="14" y="14" width="2" height="2" fill="white" />
      </svg>
    </div>
  );
}

function LogoutIcon() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="block size-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 17l5-5-5-5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 12H9" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13 19H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h7" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
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
        <div className="absolute bg-[#ffcc42] left-1.5 rounded-full size-[42px] -z-10 " />
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
  const router = useRouter();
  return (
    <>
      {/* Backdrop */}
      {/* EDITED: Backdrop now covers only the area below the topbar (top-14 -> bottom-0) so the topbar stays visible */}
      {isOpen && (
        <div
          className="fixed left-0 right-0 top-14 bottom-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* EDITED: Sidebar positioning - make the sidebar fixed and span from below the topbar to the bottom of the viewport on all sizes so it appears 'longer'.
          We use `top-14` and `bottom-0` to stretch full height under the topbar. On md+ sizes it remains fixed too so it won't be cut off. */}
      <div
        className={`fixed top-14 left-0 bottom-0 bg-[#b53231] w-[240px] z-50 transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
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
            icon={<CalendarIcon />} 
            label="Calendar" 
          />
          <MenuItem 
            icon={<IxUserProfileFilled />} 
            label="My Activities" 
          />
          <MenuItem 
            icon={<QrCodeIcon />} 
            label="Scan QR code" 
          />
        </div>

        {/* Logout - at bottom */}
        <div className="mt-auto mb-8 px-4">
          <div
            className="flex gap-[15px] items-center cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => {
              try { localStorage.removeItem('isLoggedIn'); } catch (e) {}
              onClose();
              router.push('/');
            }}
          >
            <LogoutIcon />
            <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[18px] text-[15px] text-nowrap text-white tracking-[-0.08px]" style={{ fontVariationSettings: "'wdth' 100" }}>
              Log out
            </p>
          </div>
        </div>
        {/* EDITED: End of sidebar */}
      </div>
    </>
  );
}
