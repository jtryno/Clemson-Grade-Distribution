export function gpaColor(gpa: number | null): string {
  if (gpa === null) return 'bg-gray-100 text-gray-500';
  if (gpa >= 3.5) return 'bg-green-100 text-green-800';
  if (gpa >= 3.0) return 'bg-blue-100 text-blue-800';
  if (gpa >= 2.5) return 'bg-yellow-100 text-yellow-800';
  if (gpa >= 2.0) return 'bg-orange-100 text-orange-800';
  return 'bg-red-100 text-red-800';
}

export function formatGpa(gpa: number | null): string {
  return gpa !== null ? gpa.toFixed(2) : 'N/A';
}
