# Job Tracker

A desktop application for tracking job applications with analytics and resume management.

## Features

- **Application Tracking** - Log and manage job applications with company, title, location, salary, and status
- **Status Timeline** - Track application progress through stages (Applied, Phone Screen, Interview, Offer, Rejected)
- **Resume Manager** - Store multiple resumes with keyword profiles
- **Keyword Matching** - Match your resume keywords against job descriptions
- **Analytics Dashboard** - Visualize your job search with charts and metrics
- **Local Storage** - All data stored locally in SQLite

## Installation

### Download

Download the latest release for your platform from the [Releases](../../releases) page:

- **macOS**: `.dmg` or `.zip`
- **Windows**: `.exe` (installer) or portable
- **Linux**: `.AppImage` or `.deb`

### Build from Source

Requirements: Node.js 18+

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/job-tracker.git
cd job-tracker

# Install dependencies
npm install

# Run in development mode
npm run electron:dev

# Build for your platform
npm run electron:build
```

## Development

```bash
# Start dev server (web only)
npm run dev

# Start Electron dev mode
npm run electron:dev

# Build for specific platforms
npm run electron:build:mac
npm run electron:build:win
npm run electron:build:linux
```

## Tech Stack

- **Frontend**: Vue 3, Pinia, Vue Router, Tailwind CSS
- **Backend**: Electron, better-sqlite3
- **Charts**: Chart.js, D3.js
- **Build**: Vite, electron-builder

## License

MIT
