# Contributing to Job Tracker

Thanks for your interest in contributing! Here's how to get started.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/still-not-hired.git
   cd still-not-hired
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development

```bash
# Run in development mode
npm run electron:dev
```

The app runs on Electron with a Vite dev server at `http://localhost:5173`. Hot module replacement is active for the Vue frontend.

## Project Structure

```
electron/         # Electron main process, IPC handlers, SQLite database
src/
  components/     # Vue components
  views/          # Page-level views (Dashboard, Applications, Resumes, etc.)
  stores/         # Pinia state management
  utils/          # Utility functions (keyword analysis, metrics)
```

## Making Changes

- **Frontend changes** live in `src/` — Vue 3 components with Tailwind CSS
- **Database/IPC changes** live in `electron/` — add new handlers in `database.js` and expose them in `preload.js`
- Keep changes focused and minimal

## Submitting a Pull Request

1. Make sure the app builds without errors: `npm run electron:build`
2. Push your branch and open a PR against `main`
3. Describe what you changed and why
4. Link any related issues

## Reporting Bugs

Use the [bug report template](https://github.com/XhovaniM8/still-not-hired/issues/new?template=bug_report.md).

## Requesting Features

Use the [feature request template](https://github.com/XhovaniM8/still-not-hired/issues/new?template=feature_request.md).

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
