'use client';
import { Run } from '../../lib/types';

function getWeeks(count: number) {
  const weeks = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - d.getDay() + 1 - i * 7);
    const start = d.toISOString().slice(0, 10);
    const end = new Date(d);
    end.setDate(d.getDate() + 6);
    const endStr = end.toISOString().slice(0, 10);
    const label = `${d.getMonth() + 1}/${d.getDate()}`;
    weeks.push({ start, end: endStr, label });
  }
  return weeks;
}

export default function WeeklyChart({ runs }: { runs: Run[] }) {
  const weeks = getWeeks(8);
  const weeklyDistances = weeks.map(w =>
    runs.filter(r => r.date >= w.start && r.date <= w.end).reduce((s, r) => s + r.distance, 0)
  );
  const max = Math.max(...weeklyDistances, 1);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-500 mb-4">주간 누적 거리</h2>
      <div className="flex items-end gap-2 h-40">
        {weeklyDistances.map((dist, i) => {
          const heightPct = (dist / max) * 100;
          const isCurrentWeek = i === weeks.length - 1;
          return (
            <div key={weeks[i].start} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-gray-400">
                {dist > 0 ? `${dist.toFixed(1)}` : ''}
              </span>
              <div className="w-full relative" style={{ height: '120px' }}>
                <div
                  className={`absolute bottom-0 w-full rounded-t-lg transition-all ${isCurrentWeek ? 'bg-orange-500' : 'bg-orange-200'}`}
                  style={{ height: `${Math.max(heightPct, dist > 0 ? 4 : 0)}%` }}
                />
              </div>
              <span className="text-xs text-gray-400">{weeks[i].label}</span>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-300 mt-2 text-right">단위: km</p>
    </div>
  );
}
