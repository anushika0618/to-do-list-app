# TaskFlow — To-Do App

A responsive, browser-based task manager built with HTML, CSS and vanilla JavaScript. TaskFlow supports priorities, due dates, editing, progress tracking and local persistence.

## Features

- Create tasks with a description, priority (high / normal / low) and optional due date.
- Edit task descriptions, priorities and due dates.
- Mark tasks complete or active, delete individual tasks, or clear all completed tasks.
- Filter the list by All, Active and Done.
- View total, active and completed counts with a completion progress bar.
- See overdue dates on unfinished tasks.
- Persist tasks in the current browser using `localStorage`.
- Keyboard-friendly controls, visible focus states, screen-reader announcements and reduced-motion support.
- Defensive storage parsing: malformed or unavailable browser storage does not crash the app.

## Run locally

The app uses JavaScript modules, so serve the folder over a local HTTP server rather than opening `index.html` directly.

With Python:

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

Or use any static development server.

## Run tests

Requires Node.js 18 or later. From the project folder:

```bash
npm test
```

The Node built-in test runner checks task creation and validation, normalization, storage failure handling, statistics, filtering and overdue-date logic.

## Project structure

- `index.html` — app layout and styles
- `app.js` — browser UI, event handling and rendering
- `task-utils.js` — reusable task and storage logic
- `task-utils.test.mjs` — automated unit tests
- `package.json` — test command

## Data and limitations

Tasks are stored only in the browser profile where they were created. There is no account system, backend, cloud sync or multi-device backup. Clearing browser site data can remove saved tasks. Due dates use the browser's local calendar date. Google Fonts are loaded externally; system fallback fonts are used if unavailable.
