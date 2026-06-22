'use client';
import { useState } from 'react';
import { Run, Goal } from '../../lib/types';

export default function AIAnalysis({ runs, goal }: { runs: Run[]; goal: Goal | null }) {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyze = async () => {
    setLoading(true);
    setError('');
    setResult('');
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ runs, goal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data.result);
    } catch (e) {
      setError(e instanceof Error ? e.message : '분석 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-semibold text-gray-500">🤖 AI 러닝 코치</h2>
      </div>

      {!result && !loading && (
        <div className="text-center py-4 space-y-3">
          <p className="text-xs text-gray-400">AI가 내 러닝 기록을 분석하고<br/>맞춤 훈련 계획을 제안해드려요</p>
          <button
            onClick={analyze}
            disabled={runs.length === 0}
            className="w-full bg-orange-500 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-orange-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            분석 시작
          </button>
          {runs.length === 0 && <p className="text-xs text-gray-300">러닝 기록을 먼저 추가해주세요</p>}
        </div>
      )}

      {loading && (
        <div className="text-center py-6 space-y-2">
          <div className="w-8 h-8 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto" />
          <p className="text-xs text-gray-400">AI가 분석 중이에요...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-500 text-xs p-3 rounded-lg">
          {error}
          <button onClick={analyze} className="block mt-2 underline">다시 시도</button>
        </div>
      )}

      {result && (
        <div className="space-y-3">
          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap prose prose-sm max-w-none">
            {result.split('\n').map((line, i) => {
              if (line.startsWith('## ')) return <h3 key={i} className="font-bold text-gray-800 mt-3 mb-1">{line.replace('## ', '')}</h3>;
              if (line.startsWith('### ')) return <h4 key={i} className="font-semibold text-gray-700 mt-2 mb-1">{line.replace('### ', '')}</h4>;
              if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-semibold text-gray-700">{line.replace(/\*\*/g, '')}</p>;
              if (line.startsWith('- ')) return <li key={i} className="ml-3 list-disc text-gray-600">{line.replace('- ', '')}</li>;
              if (line === '') return <br key={i} />;
              return <p key={i} className="text-gray-600">{line}</p>;
            })}
          </div>
          <button onClick={analyze} className="w-full border border-orange-200 text-orange-500 rounded-lg py-2 text-xs hover:bg-orange-50 transition-colors">
            다시 분석
          </button>
        </div>
      )}
    </div>
  );
}
