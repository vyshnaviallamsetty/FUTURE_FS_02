# NexusCRM Pro — Enterprise Pipeline Workspace

A lightweight, browser-based CRM built with vanilla HTML, CSS, and JavaScript. No backend required — all data is stored in `localStorage`.

---

## Features

- **Login Authentication** — Session-based access gate before entering the dashboard
- **Executive Dashboard** — KPI cards showing total leads and gross pipeline value, plus a Chart.js pipeline stage chart
- **Deal Pipeline Workspace** — Searchable lead table with a side panel for viewing, editing, and deleting individual records
- **Add / Edit Leads** — Modal forms to create or update lead profiles (name, company, email, value, source, status, close date, notes)
- **Analytics & Reports** — Visual breakdown of pipeline data
- **CSV Export** — One-click export of all lead records as a spreadsheet
- **Public Contact Form** (`contact.html`) — External-facing form that submits leads directly into the same localStorage database

---

## File Structure

```
├── index.html       # Login / authentication page
├── dashboard.html   # Main CRM app (dashboard, pipeline, analytics)
├── contact.html     # Public-facing lead capture form
├── style.css        # Global styles
└── script.js        # All CRM logic (data, rendering, events)
```

---

## Getting Started

No installation or build step needed. Just open the files in a browser.

1. Clone or download this repository
2. Open `index.html` in your browser
3. Log in with the sandbox credentials below

**Login credentials (sandbox):**
| Field | Value |
|-------|-------|
| Username | `nexus` |
| Password | `nexus2026` |

**Pipeline workspace passkey:** `admin123`

> ⚠️ These are demo credentials hardcoded for local testing. Do not deploy this project publicly without replacing the auth system with a real backend.

---

## How Data Works

All lead data is stored in the browser's `localStorage` under the key `nexus_pro_database` as a JSON array. Data persists across page refreshes but is local to the browser — there is no server or database.

Leads submitted via `contact.html` are automatically added to the same store and appear in the dashboard pipeline.

---

## Tech Stack

- HTML5, CSS3, Vanilla JavaScript
- [Chart.js](https://www.chartjs.org/) (via CDN) for dashboard charts

---

