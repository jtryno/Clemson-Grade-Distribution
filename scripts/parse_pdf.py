"""
parse_pdf.py — Extract Clemson grade distribution data from PDF to JSON.

Usage:
    python scripts/parse_pdf.py

Reads:  distribution-data/<term>.pdf
Writes: src/data/<term>.json
"""

import json
import re
import sys
from pathlib import Path

import pdfplumber

TERM = "202508"
TERM_LABEL = "Fall 2025"
PDF_PATH = Path("distribution-data") / f"{TERM}.pdf"
OUT_PATH = Path("src/data") / f"{TERM}.json"

# Matches a grade data line:
# DEPT  COURSENUM  SECTION  Title words...  A% B% C% D% F% P% F(P)% W% I%  Instructor [H]
GRADE_LINE = re.compile(
    r"^([A-Z]+)\s+"           # dept
    r"(\d+[A-Z]?)\s+"         # course number
    r"(\d+[A-Z]*)\s+"         # section
    r"(.+?)\s+"               # course title (non-greedy)
    r"(\d+)%\s+"              # A
    r"(\d+)%\s+"              # B
    r"(\d+)%\s+"              # C
    r"(\d+)%\s+"              # D
    r"(\d+)%\s+"              # F
    r"(\d+)%\s+"              # P
    r"(\d+)%\s+"              # F(P)
    r"(\d+)%\s+"              # W
    r"(\d+)%\s+"              # I
    r"(.+?)$"                 # instructor name (rest of line)
)

SKIP_PREFIXES = (
    "Grades Report",
    "Course Numbe",
    "Course Sections",
    "students.",
    "Thursday,",
    "Friday,",
    "Monday,",
    "Tuesday,",
    "Wednesday,",
    "Saturday,",
    "Sunday,",
)

GPA_WEIGHTS = {"A": 4.0, "B": 3.0, "C": 2.0, "D": 1.0, "F": 0.0}


def calc_gpa(grades: dict) -> float | None:
    """Estimate section GPA from letter grade percentages (excludes P/W/I)."""
    graded_pct = sum(grades[g] for g in ("A", "B", "C", "D", "F"))
    if graded_pct == 0:
        return None
    weighted = sum(grades[g] * GPA_WEIGHTS[g] for g in GPA_WEIGHTS)
    return round(weighted / graded_pct, 2)


def is_skip_line(line: str) -> bool:
    return any(line.startswith(p) for p in SKIP_PREFIXES) or line.strip() == ""


def parse_pdf(pdf_path: Path) -> list[dict]:
    courses = []
    pending_record: dict | None = None

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if not text:
                continue

            for raw_line in text.split("\n"):
                line = raw_line.strip()

                if is_skip_line(line):
                    # Flush any pending record before skipping
                    if pending_record:
                        courses.append(pending_record)
                        pending_record = None
                    continue

                m = GRADE_LINE.match(line)
                if m:
                    # Flush previous record
                    if pending_record:
                        courses.append(pending_record)

                    dept, number, section = m.group(1), m.group(2), m.group(3)
                    raw_title = m.group(4).strip()
                    honors_from_title = "(HON)" in raw_title or "(Hon)" in raw_title
                    title = raw_title.replace("(HON)", "").replace("(Hon)", "").strip()
                    grades = {
                        "A":   int(m.group(5)),
                        "B":   int(m.group(6)),
                        "C":   int(m.group(7)),
                        "D":   int(m.group(8)),
                        "F":   int(m.group(9)),
                        "P":   int(m.group(10)),
                        "FP":  int(m.group(11)),
                        "W":   int(m.group(12)),
                        "I":   int(m.group(13)),
                    }
                    raw_instructor = m.group(14).strip()
                    # Strip trailing " H" honor column marker from instructor name
                    # (unreliable — "H" can be a middle initial). Use title instead.
                    instructor = re.sub(r"\s+H$", "", raw_instructor)
                    honors = honors_from_title

                    pending_record = {
                        "dept":       dept,
                        "number":     number,
                        "section":    section,
                        "title":      title,
                        "grades":     grades,
                        "instructor": instructor,
                        "honors":     honors,
                        "gpa":        calc_gpa(grades),
                    }
                else:
                    # Continuation line: instructor name wrapped to next line
                    if pending_record is not None:
                        pending_record["instructor"] += " " + line
                    # Otherwise it's an unrecognized line — ignore

    # Flush last record
    if pending_record:
        courses.append(pending_record)

    return courses


def main() -> None:
    if not PDF_PATH.exists():
        print(f"ERROR: {PDF_PATH} not found. Run from the repo root.", file=sys.stderr)
        sys.exit(1)

    print(f"Parsing {PDF_PATH} ...")
    courses = parse_pdf(PDF_PATH)
    print(f"  Parsed {len(courses)} course sections")

    output = {
        "term":    TERM,
        "label":   TERM_LABEL,
        "courses": courses,
    }

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(output, indent=2), encoding="utf-8")
    print(f"  Written to {OUT_PATH}")

    # Sanity check
    depts = {c["dept"] for c in courses}
    print(f"  Departments: {len(depts)}")
    print(f"  Sample: {courses[0]}")


if __name__ == "__main__":
    main()
