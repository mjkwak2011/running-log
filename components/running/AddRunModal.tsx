'use client';
import { useState } from 'react';
import { Run, parseDuration } from '../../lib/types';

type RunInput = Omit<Run, 'id' | 'created_at'>;

export default function AddRunModal({ onClose, onAdd }: { onClose: () => void; onAdd: (r: RunInput) => void }) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [distance, setDistance] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!date || !distance) { setError('날짜와 거리는 필수입니다.'); return; }
    if (!minutes && !hours) { setError('시간을 입력해주세요.'); return; }
    const duration = parseDuration(parseInt(hours || '0'), parseInt(minutes || '0'), parseInt(seconds || '0'));
    if (duration <= 0) { setError('운동 시간을 입력해주세요.'); return; }
    onAdd({ date, distance: parseFloat(distance), duration, notes });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-bold text-gray-800">러닝 기록 추가</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500">날짜</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500">거리 (km)</label>
            <input type="number" step="0.01" value={distance} onChange={e => setDistance(e.target.value)} placeholder="예: 5.32"
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500">운동 시간</label>
            <div className="flex gap-2 mt-1">
              <div className="flex-1">
                <input type="number" min="0" value={hours} onChange={e => setHours(e.target.value)} placeholder="0"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-orange-300" />
                <p className="text-xs text-center text-gray-400 mt-1">시간</p>
              </div>
              <div className="flex-1">
                <input type="number" min="0" max="59" value={minutes} onChange={e => setMinutes(e.target.value)} placeholder="0"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-orange-300" />
                <p className="text-xs text-center text-gray-400 mt-1">분</p>
              </div>
              <div className="flex-1">
                <input type="number" min="0" max="59" value={seconds} onChange={e => setSeconds(e.target.value)} placeholder="0"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-orange-300" />
                <p className="text-xs text-center text-gray-400 mt-1">초</p>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500">메모 (선택)</label>
            <input type="text" value={notes} onChange={e => setNotes(e.target.value)} placeholder="오늘 컨디션, 코스 등"
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <div className="p-5 pt-0 flex gap-2">
          <button onClick={onClose} className="flex-1 border border-gray-200 rounded-lg py-2.5 text-sm text-gray-500 hover:bg-gray-50 transition-colors">취소</button>
          <button onClick={handleSubmit} className="flex-1 bg-orange-500 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-orange-600 transition-colors">저장</button>
        </div>
      </div>
    </div>
  );
}
