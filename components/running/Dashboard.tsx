'use client';
import { useState, useEffect } from 'react';
import { Run, Goal } from '../../lib/types';
import AddRunModal from './AddRunModal';
import RunList from './RunList';
import StatsRow from './StatsRow';
import WeeklyChart from './WeeklyChart';
import GoalPanel from './GoalPanel';
import AIAnalysis from './AIAnalysis';

type RunInput = Omit<Run, 'id' | 'created_at'>;

export default function Dashboard() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/init', { method: 'POST' }).finally(() => {
      Promise.all([
        fetch('/api/runs').then(r => r.json()),
        fetch('/api/goals').then(r => r.json()),
      ]).then(([runsData, goalData]) => {
        setRuns(Array.isArray(runsData) ? runsData : []);
        setGoal(goalData ?? null);
        setLoading(false);
      });
    });
  }, []);

  const handleAddRun = async (run: RunInput) => {
    const res = await fetch('/api/runs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(run),
    });
    const newRun = await res.json();
    setRuns(prev => [newRun, ...prev]);
    setShowModal(false);
  };

  const handleDeleteRun = async (id: string) => {
    await fetch(`/api/runs/${id}`, { method: 'DELETE' });
    setRuns(prev => prev.filter(r => r.id !== id));
  };

  const handleSaveGoal = async (goalData: Partial<Goal>) => {
    const res = await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goalData),
    });
    const saved = await res.json();
    setGoal(saved);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-orange-500 text-white py-4 px-6 shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏃</span>
            <h1 className="text-lg font-bold tracking-tight">러닝 로그</h1>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-white text-orange-500 px-4 py-1.5 rounded-full font-semibold text-sm hover:bg-orange-50 transition-colors shadow-sm"
          >
            + 기록 추가
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <StatsRow runs={runs} />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <WeeklyChart runs={runs} />
            <RunList runs={runs} onDelete={handleDeleteRun} />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <GoalPanel goal={goal} runs={runs} onSave={handleSaveGoal} />
            <AIAnalysis runs={runs} goal={goal} />
          </div>
        </div>
      </main>

      {showModal && <AddRunModal onClose={() => setShowModal(false)} onAdd={handleAddRun} />}
    </div>
  );
}
