# Changelog

All notable changes to Job Tracker will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[1.0.0]: https://github.com/XhovaniM8/job-tracker/releases/tag/v1.0.0
