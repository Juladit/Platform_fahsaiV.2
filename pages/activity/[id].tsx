import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Sidebar } from '../../components/Sidebar';
import { TopNavbar } from '../../components/TopNavbar';
import { activities } from '../../data/activities';
// default images (same mapping as ActivityCard)
import basketballImg from '../../src/basketball_image.png';
import footballImg from '../../src/Football_image.png';
import archeryImg from '../../src/Archery_image.png';
const PLACEHOLDER_DATA_URL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

export default function ActivityDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const activity = activities.find((a) => a.id === id);
  const [isRegistered, setIsRegistered] = useState(() => activity?.status === 'registered');

  // If no activity found, show simple message
  if (!activity) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <TopNavbar onMenuClick={() => setSidebarOpen((s) => !s)} />
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="pt-14 md:pl-[240px]">
          <main className="max-w-7xl mx-auto px-6 py-8">
            <p>Activity not found.</p>
            <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded" onClick={() => router.push('/FeedPage')}>Back to Feed</button>
          </main>
        </div>
      </div>
    );
  }

  // Resolve image the same way ActivityCard does so the detail view shows the same image
  const resolvedFromActivity = typeof activity.image === 'string' ? activity.image : activity.image?.src;

  const defaultByTitle: Record<string, { src?: string } | undefined> = {
    'Annual Basketball Tournament': basketballImg,
    'Football Tournament': footballImg,
    'Archery activity': archeryImg,
    'Archery activity first tournament': archeryImg,
  };

  const imageSrc = resolvedFromActivity ?? defaultByTitle[activity.title]?.src ?? PLACEHOLDER_DATA_URL;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <TopNavbar onMenuClick={() => setSidebarOpen((s) => !s)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="pt-14 md:pl-[240px]">
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button onClick={() => router.push('/FeedPage')} className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-sm">Back</span>
              </button>

              <h1 className="text-2xl font-bold flex items-center gap-3">
                <span>{activity.title}</span>
                <span className={
                  `text-sm font-medium px-3 py-1 rounded-full ${isRegistered ? 'bg-emerald-100 text-emerald-800' : activity.status === 'open' ? 'bg-yellow-100 text-yellow-800' : activity.status === 'completed' ? 'bg-gray-100 text-gray-700' : 'bg-gray-100 text-gray-700'}`
                }>{isRegistered ? 'Registered' : (activity.status ? activity.status.charAt(0).toUpperCase() + activity.status.slice(1) : '')}</span>
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {isRegistered ? (
                <>
                  <div className="px-4 py-2 bg-emerald-500 text-white rounded-full text-sm">Registered</div>
                  <button onClick={() => setIsRegistered(false)} className="px-4 py-2 border border-red-500 text-red-600 rounded">Cancel</button>
                </>
              ) : (
                <button onClick={() => setIsRegistered(true)} className="px-4 py-2 bg-emerald-500 text-white rounded-full">Click for register</button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-9">
              <p className="mb-4 text-gray-700">Description: "Lunt in culpa qui officia deserunt mollit anim id est laborum."</p>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 8h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7 3v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M17 3v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div>
                    <div className="text-xs text-gray-500">Date:</div>
                    <div className="font-semibold">{activity.date}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.3" />
                  </svg>
                  <div>
                    <div className="text-xs text-gray-500">Time:</div>
                    <div className="font-semibold">{activity.time}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21s-7-4.5-7-10a7 7 0 1 1 14 0c0 5.5-7 10-7 10z" stroke="currentColor" strokeWidth="1.3" fill="none" />
                    <circle cx="12" cy="11" r="2" fill="currentColor" />
                  </svg>
                  <div>
                    <div className="text-xs text-gray-500">Place:</div>
                    <div className="font-semibold">{activity.location}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div>
                    <div className="text-xs text-gray-500">Registered:</div>
                    <div className="font-semibold">15 / 150</div>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-md">
                {/* Larger hero image: responsive heights for small->large screens */}
                <img
                  src={imageSrc}
                  alt={activity.title}
                  className="w-full h-96 md:h-[28rem] lg:h-[36rem] object-cover rounded-lg"
                />
              </div>
            </div>

            <div className="lg:col-span-3">
              {/* placeholder for right column if desired */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
