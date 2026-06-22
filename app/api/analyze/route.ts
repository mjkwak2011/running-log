import { NextRequest, NextResponse } from 'next/server';
import { Run, Goal, formatPace, formatDuration, getRaceLabel } from '../../../lib/types';

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY가 설정되지 않았습니다.' }, { status: 500 });
  }

  const { runs, goal }: { runs: Run[]; goal: Goal | null } = await req.json();

  const runsText = runs.length === 0
    ? '아직 기록된 러닝이 없습니다.'
    : runs.slice(0, 30).map(r =>
        `- ${r.date}: ${r.distance}km, ${formatDuration(r.duration)}, 페이스 ${formatPace(r.distance, r.duration)}${r.notes ? `, 메모: ${r.notes}` : ''}`
      ).join('\n');

  const goalText = !goal
    ? '설정된 목표 없음'
    : [
        goal.weekly_distance ? `주간 목표: ${goal.weekly_distance}km` : '',
        goal.monthly_distance ? `월간 목표: ${goal.monthly_distance}km` : '',
        goal.target_race ? `목표 대회: ${getRaceLabel(goal.target_race)}${goal.target_race_time ? `, 목표 시간: ${formatDuration(goal.target_race_time)}` : ''}${goal.target_race_date ? `, 날짜: ${goal.target_race_date}` : ''}` : '',
      ].filter(Boolean).join(' / ');

  const prompt = `당신은 친절한 러닝 코치입니다. 아래 러닝 데이터를 분석해 주세요.

## 최근 러닝 기록
${runsText}

## 목표
${goalText}

다음 항목을 분석해주세요:
1. **현재 상태 분석** - 페이스 추이, 거리 변화, 일관성
2. **목표 달성 가능성** - 현재 수준과 목표 간의 차이
3. **구체적인 훈련 조언** - 이번 주 권장 훈련 계획 (요일별로 간단히)
4. **주의사항** - 부상 예방, 회복 등

한국어로 친근하게 답변해주세요. 마크다운 형식으로 작성해주세요.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    return NextResponse.json({ error: `AI 분석 실패: ${err}` }, { status: 500 });
  }

  const data = await response.json();
  return NextResponse.json({ result: data.content[0].text });
}
