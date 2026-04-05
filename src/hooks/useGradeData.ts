import { useEffect, useMemo, useState } from 'react';
import type { Course, CourseGroup, GradeData } from '../types';

export const TERMS = [
  { term: '202508', label: 'Fall 2025' },
  { term: '202501', label: 'Spring 2025' },
  { term: '202408', label: 'Fall 2024' },
  { term: '202401', label: 'Spring 2024' },
  { term: '202308', label: 'Fall 2023' },
  { term: '202301', label: 'Spring 2023' },
  { term: '202208', label: 'Fall 2022' },
  { term: '202201', label: 'Spring 2022' },
] as const;

export type Term = (typeof TERMS)[number]['term'];

/** Converts "Last, First Middle" → "first last" for search matching. */
function instructorSearchString(instructor: string): string {
  const [last, rest] = instructor.split(',').map((s) => s.trim());
  const first = rest?.split(' ')[0];
  return first ? `${first} ${last}`.toLowerCase() : last.toLowerCase();
}

function groupCourses(courses: Course[]): CourseGroup[] {
  const map = new Map<string, CourseGroup>();

  for (const course of courses) {
    const key = `${course.dept}-${course.number}`;
    if (!map.has(key)) {
      map.set(key, {
        dept: course.dept,
        number: course.number,
        title: course.title,
        sections: [],
        avgGpa: null,
      });
    }
    map.get(key)!.sections.push(course);
  }

  for (const group of map.values()) {
    const gpas = group.sections
      .map((s) => s.gpa)
      .filter((g): g is number => g !== null);
    group.avgGpa =
      gpas.length > 0
        ? Math.round((gpas.reduce((a, b) => a + b, 0) / gpas.length) * 100) / 100
        : null;
  }

  return Array.from(map.values());
}

export type SortOption = 'course' | 'gpa-desc' | 'gpa-asc' | 'a-pct-desc';

export function useGradeData(
  query: string,
  dept: string,
  sort: SortOption,
  term: Term,
) {
  const [data, setData] = useState<GradeData | null>(null);

  useEffect(() => {
    setData(null);
    import(`../data/${term}.json`).then((mod) => {
      setData(mod.default as unknown as GradeData);
    });
  }, [term]);

  const allDepts = useMemo(
    () => (data ? Array.from(new Set(data.courses.map((c) => c.dept))).sort() : []),
    [data],
  );

  const groups = useMemo(() => {
    if (!data) return [];

    const q = query.toLowerCase().trim();

    if (!q && !dept) return [];

    let filtered = data.courses;

    if (dept) {
      filtered = filtered.filter((c) => c.dept === dept);
    }

    if (q) {
      filtered = filtered.filter(
        (c) =>
          `${c.dept} ${c.number}`.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.instructor.toLowerCase().includes(q) ||
          instructorSearchString(c.instructor).includes(q),
      );
    }

    const grouped = groupCourses(filtered);

    switch (sort) {
      case 'gpa-desc':
        grouped.sort((a, b) => (b.avgGpa ?? -1) - (a.avgGpa ?? -1));
        break;
      case 'gpa-asc':
        grouped.sort((a, b) => (a.avgGpa ?? 5) - (b.avgGpa ?? 5));
        break;
      case 'a-pct-desc':
        grouped.sort((a, b) => {
          const avgA = (g: CourseGroup) =>
            g.sections.reduce((sum, s) => sum + s.grades.A, 0) / g.sections.length;
          return avgA(b) - avgA(a);
        });
        break;
      default:
        grouped.sort((a, b) =>
          `${a.dept} ${a.number}`.localeCompare(`${b.dept} ${b.number}`),
        );
    }

    return grouped;
  }, [data, query, dept, sort]);

  return { groups, allDepts, label: data?.label ?? '...', loading: data === null };
}
