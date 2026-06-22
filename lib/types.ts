export interface Run {
  id: string;
  date: string;
  distance: number;
  duration: number;
  notes: string;
  created_at: string;
}

export interface Goal {
  id: string;
  weekly_distance: number | null;
  monthly_distance: number | null;
  target_race: string | null;
  target_race_time: number | null;
  target_race_date: string | null;
  created_at: string;
  updated_at: string;
}

export function formatPace(distance: number, duration: number): string {
  if (!distance || !duration) return '-';
  const paceSeconds = duration / distance;
  const minutes = Math.floor(paceSeconds / 60);
  const seconds = Math.round(paceSeconds % 60);
  return `${minutes}'${seconds.toString().padStart(2, '0')}"`;
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function parseDuration(hours: number, minutes: number, seconds: number): number {
  return hours * 3600 + minutes * 60 + seconds;
}

export function getRaceLabel(race: string): string {
  const labels: Record<string, string> = {
    '5k': '5km',
    '10k': '10km',
    'half': '하프마라톤 (21.1km)',
    'marathon': '풀마라톤 (42.195km)',
  };
  return labels[race] ?? race;
}

export function getRaceDistance(race: string): number {
  const distances: Record<string, number> = {
    '5k': 5,
    '10k': 10,
    'half': 21.0975,
    'marathon': 42.195,
  };
  return distances[race] ?? 0;
}
