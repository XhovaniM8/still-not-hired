# Changelog

All notable changes to Job Tracker will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-07-06

### Added
- **Mass Delete** — Checkbox selection and bulk action bar on the Applications list, backed by a transactional delete so a batch is all-or-nothing
- **Auto-Ghosting** — Applications stuck at "Applied" for 28+ days are automatically marked as ghosted
- **Keyword Corpus Trending** — Keyword matcher cross-references all saved job descriptions to surface trending keywords missing from the best-matching resume
- **Duplicate Detection** — Non-blocking warning when creating an application that matches an existing company + title, plus a retroactive flag for existing duplicates
- **Pipeline Integrity Flags** — Applications with a backwards status progression are flagged in red in the list view
- **Interview Rate Benchmark** — Added the 1:40–1:100 interview rate industry benchmark to Analytics

### Changed
- Status distribution chart redesigned as a doughnut with a center total, count + percentage legend, and status ordering shared with the Sankey diagram
- Resume Performance now ranks by interview rate instead of offer rate (most candidates only ever accept one offer, so offer count barely differentiates resumes)
- Analytics rates now round to 1 decimal place instead of whole numbers, so low-sample-size events (e.g. 1 offer / 263 applications) no longer round down to 0%
- Onsite Interview funnel bar now computes its rate directly instead of a differently-combined rate than the count shown next to it

### Fixed
- **Dark mode bug** — Charts could render with the wrong theme baked in permanently due to a component mount-order race; introduced a shared reactive `useDarkMode()` composable used by all charts
- **Keyword extraction** — City names and other bare Title-Case words no longer leak into extracted resume keywords; expanded the default keyword dictionary (concurrency, message queues, observability, CAD/EE tools, CI/version control, process terms)
- **Data integrity** — Rapid status changes could resolve to the wrong "latest" status due to SQLite's 1-second timestamp resolution; added a tie-breaker
- Sankey diagram no longer crashes on out-of-order status history
- N+1 query in the resume editor's keyword-corpus loading (was one IPC call per application; now a single batched query)
- Auto-ghost sweep now runs once per session instead of on every mutation
- Removed two unused Vue components with zero references

[1.0.1]: https://github.com/XhovaniM8/still-not-hired/releases/tag/v1.0.1

## [1.0.0] - 2026-02-23

### Added
- **Application Tracking** — Create, edit, and delete job applications with fields for company, title, location, salary, URL, and notes
- **Status Timeline** — Track application progress through Applied, Phone Screen, Interview, Technical, Offer, and Rejected stages with timestamps
- **Resume Manager** — Store multiple resumes with version tracking and keyword profiles
- **Keyword Matching** — Paste a job description and instantly see how well your resume keywords match; highlights missing keywords
- **Analytics Dashboard** — Full analytics suite including:
  - Sankey diagram showing application flow through stages
  - Pie chart for application status breakdown
  - Time series chart for application activity over time
  - Metrics for response rate, interview rate, offer rate, and average time-to-response
- **Contact Management** — Add contacts and link them to specific applications
- **Data Export** — Export your application data
- **Dark Mode** — Full dark mode support throughout the UI
- **Local SQLite Storage** — All data stored locally using better-sqlite3; no accounts, no cloud sync
- **Cross-platform** — Builds available for macOS, Windows, and Linux

[1.0.0]: https://github.com/XhovaniM8/still-not-hired/releases/tag/v1.0.0
