import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { TopNavbar } from '../components/TopNavbar';
import { ActivityCard } from '../components/ActivityCard';
import { activities } from '../data/activities';
import { Pagination } from '../components/Pagination';

export default function FeedPage() {
  // EDITED: Sidebar default state set to closed (false) so sidebar is hidden on initial load
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* EDITED: TopNavbar is fixed and placed above the Sidebar so it remains visible at the top */}
      <TopNavbar onMenuClick={() => setSidebarOpen((s) => !s)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* EDITED: push content below fixed topbar by adding pt-14; md:pl-[240px] keeps content offset for sidebar on larger screens */}
      <div className="pt-14 md:pl-[240px]">
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Feed</h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((a) => (
              <ActivityCard key={a.id} activity={a} />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Pagination />
          </div>
        </main>
      </div>
    </div>
  );
}