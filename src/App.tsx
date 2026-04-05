import { useState } from 'react';
import { useGradeData, TERMS, type SortOption, type Term } from './hooks/useGradeData';
import { CourseGroup } from './components/CourseGroup';

export default function App() {
  const [query, setQuery] = useState('');
  const [dept, setDept] = useState('');
  const [sort, setSort] = useState<SortOption>('course');
  const [term, setTerm] = useState<Term>('202508');

  const { groups, allDepts, label, loading } = useGradeData(query, dept, sort, term);

  const hasSearch = query.trim() !== '' || dept !== '';

  function handleTermChange(newTerm: Term) {
    setTerm(newTerm);
    setDept(''); // reset dept since departments may differ across semesters
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-clemson-orange text-white px-4 py-5 shadow">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold tracking-tight">
            Clemson Grade Distribution
          </h1>
          <p className="text-orange-100 text-sm mt-0.5">{label}</p>
        </div>
      </header>

      {/* Controls */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm px-4 py-3">
        <div className="max-w-3xl mx-auto flex flex-col gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by course (e.g. CPSC 2120), title, or instructor..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clemson-orange focus:border-transparent"
          />
          <div className="flex gap-2">
            <select
              value={term}
              onChange={(e) => handleTermChange(e.target.value as Term)}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-clemson-orange bg-white"
            >
              {TERMS.map((t) => (
                <option key={t.term} value={t.term}>
                  {t.label}
                </option>
              ))}
            </select>
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-clemson-orange bg-white"
            >
              <option value="">All Departments</option>
              {allDepts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-clemson-orange bg-white"
            >
              <option value="course">Sort: Course #</option>
              <option value="gpa-desc">Sort: GPA (high → low)</option>
              <option value="gpa-asc">Sort: GPA (low → high)</option>
              <option value="a-pct-desc">Sort: Most A's</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <main className="max-w-3xl mx-auto px-4 py-4">
        {loading ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-sm">Loading...</p>
          </div>
        ) : !hasSearch ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-medium text-gray-500">
              Search for a course to get started
            </p>
            <p className="text-sm mt-1">
              Try searching for a course number, department, or instructor name
            </p>
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-medium text-gray-500">No courses found</p>
            <p className="text-sm mt-1">Try a different search term or department</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-3">
              {groups.length} course{groups.length !== 1 ? 's' : ''} —{' '}
              {groups.reduce((sum, g) => sum + g.sections.length, 0)} sections
            </p>
            <div className="flex flex-col gap-2">
              {groups.map((group) => (
                <CourseGroup
                  key={`${group.dept}-${group.number}`}
                  group={group}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
