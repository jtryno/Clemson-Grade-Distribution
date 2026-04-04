import { useState } from 'react';
import type { CourseGroup as CourseGroupType } from '../types';
import { gpaColor, formatGpa } from '../utils/gpa';
import { SectionRow } from './SectionRow';

interface Props {
  group: CourseGroupType;
}

export function CourseGroup({ group }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden bg-white shadow-sm">
      <button
        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-clemson-orange text-sm">
                {group.dept} {group.number}
              </span>
              <span className="text-gray-800 text-sm font-medium truncate">
                {group.title}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-400">
                {group.sections.length} section{group.sections.length !== 1 ? 's' : ''}
              </span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${gpaColor(group.avgGpa)}`}
              >
                avg {formatGpa(group.avgGpa)}
              </span>
            </div>
          </div>
          <span className="text-gray-400 text-sm mt-0.5 shrink-0">
            {expanded ? '▲' : '▼'}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="divide-y divide-gray-100">
          {group.sections.map((section) => (
            <SectionRow
              key={`${section.dept}-${section.number}-${section.section}`}
              course={section}
            />
          ))}
        </div>
      )}
    </div>
  );
}
