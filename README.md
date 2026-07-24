# HabitLoop Frontend

HabitLoop Frontend is the React-based web client for the HabitLoop habit tracking application. It provides a clean, friendly interface for registering and signing in users, creating and managing habits, organizing them into categories, tracking completion history, and setting reminders.

This project is built with Vite, React 19, React Router, Axios, and Tailwind CSS. It communicates with the HabitLoop backend API over HTTP and uses local storage to persist authentication tokens.

## Overview

HabitLoop helps users build consistency by making habit tracking simple and motivating. The frontend focuses on:

- User registration and login
- Dashboard-based habit management
- Daily and weekly habit tracking
- Habit streak calculation
- Category organization
- Reminder creation and deletion
- Session handling with JWT-style access tokens stored locally

## Features

### Authentication

- Sign up with username, email, and password
- Log in with username and password
- Token-based authentication using `access_token` and `refresh_token`
- Automatic redirect to login on unauthorized responses

### Habit Management

- Add a new habit with name, frequency, and optional category
- Edit an existing habit name inline
- Delete a habit
- Mark a habit as completed for the current day
- Display habit history and completion logs

### Categories and Reminders

- Create new categories from the dashboard
- Assign habits to categories
- Add reminder times for habits
- Delete reminder entries when no longer needed

### UX Highlights

- Orange-themed modern interface
- Responsive centered forms and dashboard layout
- Simple navigation through landing, auth, and dashboard pages

## Tech Stack

- React 19
- Vite 8
- React Router DOM
- Axios
- Tailwind CSS 4
- ESLint for linting
- Docker + Nginx for production serving

## Project Structure

```text
src/
├── App.jsx                  # Router and shared navbar
├── api/
│   ├── auth.js              # register/login API helpers
│   ├── axios.js             # Axios instance with auth interceptor
│   └── habits.js            # Habit/category/reminder API helpers
├── pages/
│   ├── Landing.jsx          # Marketing/landing page
│   ├── Login.jsx            # Login form
│   ├── Signup.jsx           # Registration form
│   └── Dashboard.jsx        # Core habit dashboard
├── assets/                  # Static image or asset files
├── App.css                  # App-specific styling
├── index.css                # Base/global styles
└── main.jsx                 # React entry point
```

## Routing

The application uses React Router with these routes:

- `/` → landing page
- `/login` → login page
- `/signup` → sign up page
- `/dashboard` → authenticated dashboard

## Backend Dependency

This frontend expects the HabitLoop backend API to be available at:

```text
http://127.0.0.1:8000/api/
```

That base URL is configured in the Axios client located in `src/api/axios.js`.

If your backend runs on a different host or port, update the `baseURL` value before running the frontend.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js 20+
- npm
- A running HabitLoop backend API

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
habitloop-frontend
cd habitloop-frontend
```

2. Install dependencies:

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

This starts the Vite development server, usually at:

```text
http://localhost:5173
```

### Build for production

```bash
npm run build
```

The production build is output to the `dist/` directory.

### Preview production build locally

```bash
npm run preview
```

## Docker

A Dockerfile is included for containerizing the frontend.

### Build the image

```bash
docker build -t habitloop-frontend .
```

### Run the container

```bash
docker run -p 80:80 habitloop-frontend
```

The app is served using Nginx in the container and the static build is copied into the Nginx HTML directory.

## Environment and Configuration Notes

### Authentication Flow

- A user signs up through `register/`
- A user logs in through `token/`
- Access and refresh tokens are saved to `localStorage`
- Every authenticated request includes the `Authorization: Bearer <token>` header
- A `401` response clears the stored tokens and sends the user back to `/login`

### API Modules

- `src/api/auth.js` handles registration and login
- `src/api/habits.js` handles habits, categories, reminders, and completion logs
- `src/api/axios.js` centralizes the API base URL and request/response interceptors

## Development Notes

### Linting

```bash
npm run lint
```

### Notes on State

The UI is primarily driven by React state and effect hooks. It fetches initial data on mount and refreshes from the API after create, update, delete, and log actions.

## Screens and User Journey

1. Visit the landing page
2. Register or login
3. Create habits and categories
4. Mark habits complete for the day
5. Review streak/tracking behavior from the dashboard
6. Add reminders for habit follow-up

## Known Implementation Details

- The current frontend uses a hardcoded API base URL rather than environment variables.
- The dashboard loads habits, categories, and reminders in parallel via separate API calls inside `useEffect`.
- Habit completion logs are posted to a `logs/` endpoint and are used to derive streak information.

## Future Improvements

Potential next enhancements include:

- Environment variable support for API configuration
- Protected route guards for authenticated pages
- Better error handling and toast notifications
- Habit filtering and search
- Improved streak visualization
- Draggable UI or calendar-based planning

## License

This project is currently unlicensed unless you add a license file in the repository.

## Contributing

If you are working on this frontend alongside the backend API, keep the following in mind:

- Match API payload fields exactly with backend expectations
- Verify login and token behavior before editing auth logic
- Keep UI and API layer responsibilities separated for easier debugging

## Summary

HabitLoop Frontend is a lightweight React application focused on helping users manage habits with a clear and motivating user experience. It is designed to work alongside a Django-style REST backend and is ready for local development, production build, and container-based deployment.
