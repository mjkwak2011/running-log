'use client';
import { Run, formatPace } from '../../lib/types';

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-1">
      <span className="text-xs text-gray-400 font-medium">{label}</span>
      <span className="text-2xl font-bold text-gray-800">{value}</span>
      {sub && <span className="text-xs text-gray-400">{sub}</span>}
    </div>
  );
}

export default function StatsRow({ runs }: { runs: Run[] }) {
  const totalDistance = runs.reduce((s, r) => s + r.distance, 0);
  const totalDuration = runs.reduce((s, r) => s + r.duration, 0);
  const avgPace = runs.length > 0 ? formatPace(totalDistance, totalDuration) : '-';

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + 1);
  const weekStr = startOfWeek.toISOString().slice(0, 10);
  const weekDistance = runs.filter(r => r.date >= weekStr).reduce((s, r) => s + r.distance, 0);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="총 러닝" value={`${runs.length}회`} />
      <StatCard label="총 거리" value={`${totalDistance.toFixed(1)}km`} />
      <StatCard label="평균 페이스" value={avgPace} sub="/km" />
      <StatCard label="이번 주" value={`${weekDistance.toFixed(1)}km`} />
    </div>
  );
}
