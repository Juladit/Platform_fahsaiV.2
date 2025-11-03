import React, { useMemo, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { TopNavbar } from '../components/TopNavbar';
import { activities } from '../data/activities';

function parseActivityDate(d?: string) {
  if (!d) return null;
  // expected format: D/M/YY or DD/MM/YY
  const parts = d.split('/').map((p) => parseInt(p, 10));
  if (parts.length < 3 || parts.some(isNaN)) return null;
  const [day, month, year2] = parts;
  const year = year2 < 100 ? 2000 + year2 : year2;
  return new Date(year, month - 1, day);
}

function MonthCalendar({ year, month, eventsByDay }: { year: number; month: number; eventsByDay: Record<number, any[]> }) {
  // month: 0-based
  const first = new Date(year, month, 1);
  const startDay = first.getDay(); // 0 Sun .. 6 Sat

  // number of days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // build grid array (weeks x 7)
  const cells: Array<{ dayNum: number | null; events: any[] }> = [];
  // pad leading empty cells (convert to Mon-first display by shifting)
  // We'll display Sun..Sat as headings to keep it simple
  for (let i = 0; i < startDay; i++) cells.push({ dayNum: null, events: [] });
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ dayNum: d, events: eventsByDay[d] ?? [] });
  }

  // pad trailing
  while (cells.length % 7 !== 0) cells.push({ dayNum: null, events: [] });

  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <div className="grid grid-cols-7 gap-2 text-xs text-gray-500 mb-2">
        <div className="text-center">Sun</div>
        <div className="text-center">Mon</div>
        <div className="text-center">Tue</div>
        <div className="text-center">Wed</div>
        <div className="text-center">Thu</div>
        <div className="text-center">Fri</div>
        <div className="text-center">Sat</div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {cells.map((c, idx) => (
          <div key={idx} className="min-h-[80px] border rounded p-2 bg-gray-50">
            {c.dayNum ? (
              <div>
                <div className="text-sm font-semibold mb-1">{c.dayNum}</div>
                {c.events.map((ev: any) => (
                  <div key={ev.id} className={`text-xs px-2 py-1 rounded mb-1 inline-block ${ev.status === 'registered' ? 'bg-[#b53231] text-white' : ev.status === 'open' ? 'bg-[#33ad49] text-white' : 'bg-[#ffcd42] text-black'}`}>
                    {ev.title}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CalendarPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // parse activities into Date objects and group by day for the displayed month
  const today = new Date();
  const parsed = useMemo(() => {
    return activities
      .map((a) => ({ ...a, _date: parseActivityDate(a.date) }))
      .filter((a) => a._date !== null);
  }, []);

  // Find earliest event date (if any) and default calendar view to that month
  const earliestDate = useMemo(() => {
    if (!parsed.length) return null;
    let earliest: Date | null = null;
    for (const p of parsed) {
      if (!p._date) continue;
      if (earliest === null || p._date < earliest) earliest = p._date;
    }
    return earliest;
  }, [parsed]);

  const [viewYear, setViewYear] = useState(() => (earliestDate ? earliestDate.getFullYear() : today.getFullYear()));
  const [viewMonth, setViewMonth] = useState(() => (earliestDate ? earliestDate.getMonth() : today.getMonth()));

  const eventsByDay = useMemo(() => {
    const map: Record<number, any[]> = {};
    parsed.forEach((p) => {
      if (!p._date) return;
      if (p._date.getFullYear() === viewYear && p._date.getMonth() === viewMonth) {
        const day = p._date.getDate();
        map[day] = map[day] || [];
        map[day].push(p);
      }
    });
    return map;
  }, [parsed, viewYear, viewMonth]);

  function prevMonth() {
    const m = viewMonth - 1;
    if (m < 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth(m);
  }
  function nextMonth() {
    const m = viewMonth + 1;
    if (m > 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth(m);
  }

  const monthName = new Date(viewYear, viewMonth, 1).toLocaleString(undefined, { month: 'long' });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <TopNavbar onMenuClick={() => setSidebarOpen((s) => !s)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="pt-14 md:pl-[240px]">
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Calendar</h1>
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="px-3 py-1 bg-white rounded shadow">Prev</button>
              <div className="px-4 py-1 font-semibold">{monthName} {viewYear}</div>
              <button onClick={nextMonth} className="px-3 py-1 bg-white rounded shadow">Next</button>
            </div>
          </div>

          <MonthCalendar year={viewYear} month={viewMonth} eventsByDay={eventsByDay} />
        </main>
      </div>
    </div>
  );
}
