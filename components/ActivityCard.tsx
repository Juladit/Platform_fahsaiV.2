import type { Activity } from '../types';
const placeholder = "/img/logo-mfu-v2.png";
const imgCalendar = placeholder;
const imgTimeMachine = placeholder;
const imgPlaceMarker = placeholder;

interface ActivityCardProps {
  activity: Activity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const getStatusStyles = () => {
    switch (activity.status) {
      case 'registered':
        return {
          bg: 'bg-[#b53231]',
          text: 'Registered'
        };
      case 'open':
        return {
          bg: 'bg-[#33ad49]',
          text: 'Open for Registration'
        };
      case 'completed':
        return {
          bg: 'bg-[#ffcd42]',
          text: 'Completed'
        };
    }
  };

  // Ensure we always return a valid object to satisfy TypeScript
  const getStatusStylesSafe = () => {
    const s = getStatusStyles();
    if (s) return s;
    return { bg: 'bg-gray-400', text: String(activity.status ?? '') };
  };

  const statusStyles = getStatusStylesSafe();

  return (
    <div className="relative bg-white h-[227px] rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] w-[301px]">
      {/* Image */}
      <div className="h-[142px] rounded-tl-[10px] rounded-tr-[10px] w-full overflow-hidden">
        <img 
          alt={activity.title} 
          className="w-full h-full object-cover" 
          src={activity.image} 
        />
      </div>

      {/* Status Badge */}
      <div className={`${statusStyles.bg} h-[24px] absolute top-[5px] right-[6px] rounded-[100px] px-[8px] flex items-center justify-center`}>
        <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] text-[10px] text-white tracking-[-0.08px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          {statusStyles.text}
        </p>
      </div>

      {/* Content */}
      <div className="px-[16px] py-[9px]">
        <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[20px] text-[15px] text-black tracking-[-0.23px] mb-[4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          {activity.title}
        </p>

        {/* Date and Time */}
        <div className="flex items-center gap-[58px] mb-[6px]">
          <div className="flex items-center gap-[5px]">
            <img alt="" className="opacity-50 size-[14px]" src={imgCalendar} />
            <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[16px] text-[#6f6f6f] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
              {activity.date}
            </p>
          </div>
          <div className="flex items-center gap-[5px]">
            <img alt="" className="opacity-50 size-[14px]" src={imgTimeMachine} />
            <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[16px] text-[#6f6f6f] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
              {activity.time}
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-[5px]">
          <img alt="" className="opacity-50 size-[14px]" src={imgPlaceMarker} />
          <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[16px] text-[#6f6f6f] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            {activity.location}
          </p>
        </div>
      </div>
    </div>
  );
}
