# TaskFlow — To-Do List App

A lightweight, browser-based task manager built with HTML, CSS, and vanilla JavaScript. TaskFlow lets you add tasks, set a priority, track completion, and keep your task list saved in the browser.

## Features

- **Add tasks** with a maximum length of 120 characters.
- **Set task priority** to High, Normal, or Low.
- **Track progress** with total, active, and completed task counts plus a completion percentage.
- **Filter tasks** to view All, Active, or Done items.
- **Manage your list** by marking tasks complete, deleting individual tasks, or clearing all completed tasks.
- **Save tasks locally** using the browser's `localStorage`, so they remain available when you reopen the app in the same browser.

## Built with

- HTML5
- CSS3
- Vanilla JavaScript
- Browser `localStorage`

The interface uses Google Fonts (DM Sans and Space Mono), which are loaded from Google Fonts when an internet connection is available.

## Run locally

No package installation or build step is required.

1. Clone this repository:
   ```bash
   git clone https://github.com/anushika0618/to-do-list-app.git
   ```
2. Open the project folder.
3. Open `index.html` in a web browser.

Alternatively, use the VS Code **Live Server** extension to serve the page locally.

## Data and limitations

- Tasks are stored in the current browser's local storage; they are not synced to an account or across devices.
- Clearing the browser's site data may remove saved tasks.
- The project is a front-end application and does not use a backend or database.

## Project structure

```text
to-do-list-app/
├── index.html
└── README.md
```
