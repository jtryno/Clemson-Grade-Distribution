import type { Grades } from '../types';

const GRADE_COLORS: Partial<Record<keyof Grades, string>> = {
  A: '#22c55e',
  B: '#3b82f6',
  C: '#eab308',
  D: '#f97316',
  F: '#ef4444',
};

const GRADE_KEYS = ['A', 'B', 'C', 'D', 'F'] as const;

interface Props {
  grades: Grades;
}

export function GradeBar({ grades }: Props) {
  return (
    <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
      {GRADE_KEYS.map((g) => {
        const pct = grades[g];
        if (pct === 0) return null;
        return (
          <div
            key={g}
            style={{ width: `${pct}%`, backgroundColor: GRADE_COLORS[g] }}
            title={`${g}: ${pct}%`}
          />
        );
      })}
    </div>
  );
}
