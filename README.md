# Clemson Grade Distribution

Clemson publishes grade distributions every semester as a 137-page PDF that nobody wants to read. This turns it into an actual searchable app so you can figure out which section to take before registration opens.

Live site: https://jtryno.github.io/Clemson-Grade-Distribution/

## Features

- Search by course number, name, or professor
- Filter by department
- Grade breakdown bar + chart per section
- Estimated GPA for each section
- See all sections of a course at once to compare professors
- Rate My Professors links for each instructor
- Honors section badges

## Running it locally

```bash
npm install
npm run dev
```

## Re-parsing the data

The JSON data is generated from Clemson's official grade distribution PDFs. To regenerate or add a new semester:

```bash
pip install pdfplumber
python scripts/parse_pdf.py
```

Output goes to `src/data/202508.json`.

## Stack

React + TypeScript, Vite, Tailwind CSS, Recharts

---

*Data from Clemson University's publicly available grade distribution reports.*
