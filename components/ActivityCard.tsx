import type { Activity } from '../types';
import { useRouter } from 'next/router';
// Import bundled images from src to use as sensible defaults when activity data lacks images
import basketballImg from '../src/basketball_image.png';
import footballImg from '../src/Football_image.png';
import archeryImg from '../src/Archery_image.png';
// Small 1x1 transparent GIF data URL used as a lightweight placeholder when no image is provided
const PLACEHOLDER_DATA_URL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';


// Small inline SVG icons (use className to size/color them via Tailwind)
function CalendarSmall({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 2v4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 2v4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function TimeSmall({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.3" />
      <path d="M12 7v6l4 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlaceSmall({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21s-7-4.5-7-10a7 7 0 1 1 14 0c0 5.5-7 10-7 10z" stroke="currentColor" strokeWidth="1.3" fill="none" />
      <circle cx="12" cy="11" r="2" fill="currentColor" />
    </svg>
  );
}

interface ActivityCardProps {
  activity: Activity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const router = useRouter();
  const status = activity.status ?? '';
  const statusText =
    status === 'registered' ? 'Registered' : status === 'open' ? 'Open for Registration' : status === 'completed' ? 'Completed' : String(status);

  const statusBg =
    status === 'registered' ? 'bg-[#b53231] text-white' : status === 'open' ? 'bg-[#33ad49] text-white' : status === 'completed' ? 'bg-[#ffcd42] text-black' : 'bg-gray-300 text-black';

  // Resolve image source:
  // 1) activity.image can be a string path
  // 2) or an imported image module (with .src)
  // 3) otherwise pick a default based on the activity title
  const resolvedFromActivity = typeof activity.image === 'string' ? activity.image : activity.image?.src;

  const defaultByTitle: Record<string, { src?: string } | undefined> = {
    'Annual Basketball Tournament': basketballImg,
    'Football Tournament': footballImg,
    'Archery activity': archeryImg,
    'Archery activity first tournament': archeryImg,
  };

  const mainImageSrc = resolvedFromActivity ?? defaultByTitle[activity.title]?.src ?? PLACEHOLDER_DATA_URL;

  return (
    <article
      className="bg-white rounded-lg shadow overflow-hidden relative cursor-pointer"
      onClick={() => router.push(`/activity/${activity.id}`)}
      role="button"
      aria-label={`Open details for ${activity.title}`}
    >
      <div className="relative">
        <img
          src={mainImageSrc}
          alt={activity.title}
          className="w-full h-40 object-cover"
        />

        {/* Status badge */}
        <span className={`absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full ${statusBg}`}>
          {statusText}
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-sm font-semibold text-black mb-1">{activity.title}</h3>

        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-1">
          <div className="flex items-center gap-2">
            <CalendarSmall className="w-3 h-3 opacity-60 text-gray-500" />
            <span>{activity.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <TimeSmall className="w-3 h-3 opacity-60 text-gray-500" />
            <span>{activity.time}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <PlaceSmall className="w-3 h-3 opacity-60 text-gray-500" />
          <span>{activity.location}</span>
        </div>
      </div>
    </article>
  );
}
