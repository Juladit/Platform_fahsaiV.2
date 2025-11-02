import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { TopNavbar } from '../components/TopNavbar';
import { ActivityCard } from '../components/ActivityCard';
import { activities } from '../data/activities';
import { Pagination } from '../components/Pagination';

export default function FeedPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="md:pl-[240px]">
        <TopNavbar onMenuClick={() => setSidebarOpen((s) => !s)} />

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