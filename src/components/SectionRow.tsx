import { useState } from 'react';
import type { Course } from '../types';
import { gpaColor, formatGpa } from '../utils/gpa';
import { GradeBar } from './GradeBar';
import { GradeChart } from './GradeChart';

/** Converts "Last, First Middle" → RMP search URL using only first and last name. */
function rmpUrl(instructor: string): string {
  const [last, rest] = instructor.split(',').map((s) => s.trim());
  const first = rest?.split(' ')[0];
  const name = first ? `${first} ${last}` : last;
  return `https://www.ratemyprofessors.com/search/professors/242?q=${encodeURIComponent(name)}`;
}

interface Props {
  course: Course;
}

export function SectionRow({ course }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-t border-gray-100 first:border-t-0">
      <button
        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-mono text-sm text-gray-500 w-12 shrink-0">
            §{course.section}
          </span>

          {course.instructor ? (
            <a
              href={rmpUrl(course.instructor)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="group flex items-center gap-1.5 flex-1 min-w-0"
            >
              <span className="text-sm text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                {course.instructor}
              </span>
              <span
                title="View on Rate My Professors"
                className="shrink-0 text-xs font-semibold px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors"
              >
                RMP ↗
              </span>
            </a>
          ) : (
            <span className="text-sm text-gray-400 flex-1">Instructor TBA</span>
          )}

          {course.honors && (
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-clemson-purple text-white shrink-0">
              HON
            </span>
          )}

          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${gpaColor(course.gpa)}`}
          >
            {formatGpa(course.gpa)}
          </span>

          <span className="text-gray-400 text-xs shrink-0">
            {expanded ? '▲' : '▼'}
          </span>
        </div>

        <div className="mt-2 px-0">
          <GradeBar grades={course.grades} />
        </div>

        <div className="flex gap-3 mt-1.5 text-xs text-gray-400">
          <span>A: {course.grades.A}%</span>
          <span>B: {course.grades.B}%</span>
          <span>C: {course.grades.C}%</span>
          <span>D: {course.grades.D}%</span>
          <span>F: {course.grades.F}%</span>
          {course.grades.W > 0 && <span>W: {course.grades.W}%</span>}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 bg-gray-50">
          <GradeChart grades={course.grades} />
        </div>
      )}
    </div>
  );
}
