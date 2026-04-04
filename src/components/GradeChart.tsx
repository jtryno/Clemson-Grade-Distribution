import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { Grades } from '../types';

const GRADE_COLORS: Record<string, string> = {
  A: '#22c55e',
  B: '#3b82f6',
  C: '#eab308',
  D: '#f97316',
  F: '#ef4444',
  P: '#8b5cf6',
  W: '#6b7280',
};

interface Props {
  grades: Grades;
}

export function GradeChart({ grades }: Props) {
  const chartData = [
    { grade: 'A', pct: grades.A },
    { grade: 'B', pct: grades.B },
    { grade: 'C', pct: grades.C },
    { grade: 'D', pct: grades.D },
    { grade: 'F', pct: grades.F },
    { grade: 'P', pct: grades.P },
    { grade: 'W', pct: grades.W },
  ].filter((d) => d.pct > 0);

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
        <XAxis dataKey="grade" tick={{ fontSize: 12 }} />
        <YAxis
          tickFormatter={(v: number) => `${v}%`}
          tick={{ fontSize: 11 }}
          domain={[0, 100]}
        />
        <Tooltip formatter={(v) => [`${v}%`, 'Students']} />
        <Bar dataKey="pct" radius={[3, 3, 0, 0]}>
          {chartData.map((entry) => (
            <Cell
              key={entry.grade}
              fill={GRADE_COLORS[entry.grade] ?? '#6b7280'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
