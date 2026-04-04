export interface Grades {
  A: number;
  B: number;
  C: number;
  D: number;
  F: number;
  P: number;
  FP: number;
  W: number;
  I: number;
}

export interface Course {
  dept: string;
  number: string;
  section: string;
  title: string;
  grades: Grades;
  instructor: string;
  honors: boolean;
  gpa: number | null;
}

export interface GradeData {
  term: string;
  label: string;
  courses: Course[];
}

export interface CourseGroup {
  dept: string;
  number: string;
  title: string;
  sections: Course[];
  avgGpa: number | null;
}
