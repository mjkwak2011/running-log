'use client';
import { Run, formatPace, formatDuration } from '../../lib/types';

export default function RunList({ runs, onDelete }: { runs: Run[]; onDelete: (id: string) => void }) {
  if (runs.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm text-center text-gray-400">
        <p className="text-4xl mb-2">🏃</p>
        <p className="text-sm">아직 러닝 기록이 없어요.</p>
        <p className="text-xs mt-1">+ 기록 추가 버튼을 눌러 첫 번째 러닝을 기록해보세요!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <h2 className="text-sm font-semibold text-gray-500 p-5 pb-3">최근 러닝</h2>
      <div className="divide-y divide-gray-50">
        {runs.map(run => (
          <div key={run.id} className="flex items-center px-5 py-3 hover:bg-gray-50 group">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-700">{run.distance.toFixed(2)} km</span>
                <span className="text-xs text-gray-400">{formatDuration(run.duration)}</span>
                <span className="text-xs bg-orange-50 text-orange-500 px-2 py-0.5 rounded-full font-medium">
                  {formatPace(run.distance, run.duration)}/km
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-gray-400">{run.date}</span>
                {run.notes && <span className="text-xs text-gray-400 truncate">· {run.notes}</span>}
              </div>
            </div>
            <button
              onClick={() => {
                if (confirm('이 기록을 삭제할까요?')) onDelete(run.id);
              }}
              className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all ml-2 text-lg"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
