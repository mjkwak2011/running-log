'use client';
import { useState } from 'react';
import { Run, Goal, formatDuration, getRaceLabel, getRaceDistance } from '../../lib/types';

const RACES = [
  { value: '5k', label: '5km' },
  { value: '10k', label: '10km' },
  { value: 'half', label: '하프마라톤 (21.1km)' },
  { value: 'marathon', label: '풀마라톤 (42.195km)' },
];

function ProgressBar({ label, current, target, unit }: { label: string; current: number; target: number; unit: string }) {
  const pct = Math.min((current / target) * 100, 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-500">
        <span>{label}</span>
        <span>{current.toFixed(1)} / {target}{unit}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-orange-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function GoalPanel({ goal, runs, onSave }: { goal: Goal | null; runs: Run[]; onSave: (g: Partial<Goal>) => void }) {
  const [editing, setEditing] = useState(false);
  const [weekly, setWeekly] = useState(goal?.weekly_distance?.toString() ?? '');
  const [monthly, setMonthly] = useState(goal?.monthly_distance?.toString() ?? '');
  const [race, setRace] = useState(goal?.target_race ?? '');
  const [raceHours, setRaceHours] = useState(goal?.target_race_time ? Math.floor(goal.target_race_time / 3600).toString() : '');
  const [raceMins, setRaceMins] = useState(goal?.target_race_time ? Math.floor((goal.target_race_time % 3600) / 60).toString() : '');
  const [raceSecs, setRaceSecs] = useState(goal?.target_race_time ? (goal.target_race_time % 60).toString() : '');
  const [raceDate, setRaceDate] = useState(goal?.target_race_date ?? '');

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + 1);
  const weekStr = startOfWeek.toISOString().slice(0, 10);
  const startOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  const weekDist = runs.filter(r => r.date >= weekStr).reduce((s, r) => s + r.distance, 0);
  const monthDist = runs.filter(r => r.date >= startOfMonth).reduce((s, r) => s + r.distance, 0);

  const handleSave = () => {
    const raceTime = raceHours || raceMins || raceSecs
      ? (parseInt(raceHours || '0') * 3600 + parseInt(raceMins || '0') * 60 + parseInt(raceSecs || '0'))
      : null;
    onSave({
      weekly_distance: weekly ? parseFloat(weekly) : null,
      monthly_distance: monthly ? parseFloat(monthly) : null,
      target_race: race || null,
      target_race_time: raceTime,
      target_race_date: raceDate || null,
    });
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold text-gray-500">목표 설정</h2>
        <div>
          <label className="text-xs text-gray-500">주간 목표 거리 (km)</label>
          <input type="number" value={weekly} onChange={e => setWeekly(e.target.value)} placeholder="예: 30"
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
        </div>
        <div>
          <label className="text-xs text-gray-500">월간 목표 거리 (km)</label>
          <input type="number" value={monthly} onChange={e => setMonthly(e.target.value)} placeholder="예: 100"
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
        </div>
        <div>
          <label className="text-xs text-gray-500">목표 대회</label>
          <select value={race} onChange={e => setRace(e.target.value)}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300">
            <option value="">없음</option>
            {RACES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
        {race && (
          <>
            <div>
              <label className="text-xs text-gray-500">목표 완주 시간</label>
              <div className="flex gap-2 mt-1">
                <input type="number" value={raceHours} onChange={e => setRaceHours(e.target.value)} placeholder="시"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                <input type="number" value={raceMins} onChange={e => setRaceMins(e.target.value)} placeholder="분"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                <input type="number" value={raceSecs} onChange={e => setRaceSecs(e.target.value)} placeholder="초"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500">대회 날짜</label>
              <input type="date" value={raceDate} onChange={e => setRaceDate(e.target.value)}
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
            </div>
          </>
        )}
        <div className="flex gap-2">
          <button onClick={handleSave} className="flex-1 bg-orange-500 text-white rounded-lg py-2 text-sm font-semibold hover:bg-orange-600 transition-colors">저장</button>
          <button onClick={() => setEditing(false)} className="flex-1 border border-gray-200 rounded-lg py-2 text-sm text-gray-500 hover:bg-gray-50 transition-colors">취소</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-semibold text-gray-500">목표</h2>
        <button onClick={() => setEditing(true)} className="text-xs text-orange-500 hover:text-orange-600 font-medium">
          {goal ? '수정' : '+ 설정'}
        </button>
      </div>

      {!goal ? (
        <p className="text-sm text-gray-400 text-center py-4">목표를 설정해보세요!</p>
      ) : (
        <div className="space-y-3">
          {goal.weekly_distance && (
            <ProgressBar label="이번 주" current={weekDist} target={goal.weekly_distance} unit="km" />
          )}
          {goal.monthly_distance && (
            <ProgressBar label="이번 달" current={monthDist} target={goal.monthly_distance} unit="km" />
          )}
          {goal.target_race && (
            <div className="bg-orange-50 rounded-xl p-3 space-y-1">
              <p className="text-xs font-semibold text-orange-600">🏅 목표 대회</p>
              <p className="text-sm text-gray-700">{getRaceLabel(goal.target_race)}</p>
              {goal.target_race_time && (
                <p className="text-xs text-gray-500">목표 시간: {formatDuration(goal.target_race_time)}</p>
              )}
              {goal.target_race_date && (
                <p className="text-xs text-gray-500">날짜: {goal.target_race_date}</p>
              )}
              {goal.target_race && goal.target_race_time && (() => {
                const raceDist = getRaceDistance(goal.target_race!);
                const targetPaceSeconds = goal.target_race_time! / raceDist;
                const m = Math.floor(targetPaceSeconds / 60);
                const s = Math.round(targetPaceSeconds % 60);
                return <p className="text-xs text-gray-500">필요 페이스: {m}'{s.toString().padStart(2,'0')}"/km</p>;
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
