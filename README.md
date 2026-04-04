# Clemson Grade Distribution

Tired of downloading a 137-page PDF just to see how hard a class is? This app makes Clemson's grade distribution data actually usable. Search for any course, see the grade breakdown, and compare instructors before you register.

## What it does

- Search courses by name, number, or instructor
- Filter by department
- Visual grade distribution charts
- Estimated GPA per section
- Compare all sections of a course side by side
- Honors section labels

## Running locally

```bash
npm install
npm run dev
```

## Regenerating the data

The grade data comes from Clemson's official grade distribution PDFs. If you want to re-parse or add a new semester:

```bash
pip install pdfplumber
python scripts/parse_pdf.py
```

## Stack

React, TypeScript, Tailwind CSS, Recharts

---

*Data sourced from Clemson University's publicly available grade distribution reports.*
