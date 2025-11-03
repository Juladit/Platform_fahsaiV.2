import React, { useMemo, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { TopNavbar } from '../components/TopNavbar';
import { ActivityCard } from '../components/ActivityCard';
import { activities } from '../data/activities';

export default function MyActivitiesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'registered' | 'completed'>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return activities;
    if (filter === 'registered') return activities.filter(a => (a.status ?? '').toLowerCase() === 'registered');
    return activities.filter(a => (a.status ?? '').toLowerCase() === 'completed');
  }, [filter]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <TopNavbar onMenuClick={() => setSidebarOpen(s => !s)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="pt-14 md:pl-[240px]">
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">My Activities</h1>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full ${filter === 'all' ? 'bg-black text-white' : 'bg-white/60 border border-gray-300'}`}
            >
              All Activity
            </button>
            <button
              onClick={() => setFilter('registered')}
              className={`px-4 py-2 rounded-full ${filter === 'registered' ? 'bg-[#b53231] text-white' : 'bg-white border'} border-gray-300`}
            >
              Registered
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-full ${filter === 'completed' ? 'bg-yellow-300' : 'bg-white border'} border-gray-300`}
            >
              Completed
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(a => (
              <ActivityCard key={a.id} activity={a} />
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}
