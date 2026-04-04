import { useState } from 'react';
import type { Course } from '../types';
import { gpaColor, formatGpa } from '../utils/gpa';
import { GradeBar } from './GradeBar';
import { GradeChart } from './GradeChart';

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

          <span className="text-sm text-gray-800 flex-1 min-w-0 truncate">
            {course.instructor || 'Instructor TBA'}
          </span>

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
