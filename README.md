# DevMetrics — GitHub Analytics Dashboard

A comprehensive GitHub analytics dashboard that transforms raw GitHub data into actionable insights. DevMetrics visualizes coding activity, contribution patterns, code quality metrics, and collaboration statistics through a modern, dark-themed web interface.

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Status](https://img.shields.io/badge/status-development-yellow)

---

## Features

- **Key Performance Metrics** — Total commits, active repositories, code contributions, and longest streak at a glance
- **Commit Activity Chart** — 30-day timeline visualized as an interactive area chart
- **Contribution Heatmap** — GitHub-style 52-week calendar showing daily contribution intensity
- **Language Breakdown** — Top languages displayed in a donut chart with percentages
- **Code Churn Analysis** — Weekly additions vs. deletions to track code stability
- **Commit Quality Score** — Evaluates message length, descriptiveness, and conventional commit format (0–100)
- **Collaboration Metrics** — Unique collaborators, PR review ratio, and team contribution percentage
- **Recent Repositories** — Last 10 updated repos with stars, forks, language, and description
- **Commit Patterns** — Hour-of-day and day-of-week distribution analysis
- **Dark Mode UI** — Modern dark theme with skeleton loaders and smooth transitions

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, React Router 7, Recharts 3, Lucide React |
| **Backend** | Node.js, Express 4 |
| **Authentication** | GitHub OAuth 2.0, Express Session |
| **Build Tool** | Vite 6 |
| **Styling** | Custom CSS with CSS variables (dark theme design system) |

---

## Prerequisites

- **Node.js** 18+ and **npm** 9+
- A **GitHub OAuth App** — create one at [github.com/settings/developers](https://github.com/settings/developers)
  - Set the **Authorization callback URL** to `http://localhost:3001/auth/github/callback`

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/DevMetrics.git
cd DevMetrics
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
GITHUB_ID=your_github_oauth_client_id
GITHUB_SECRET=your_github_oauth_client_secret
SESSION_SECRET=a_random_secret_string
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### 4. Start the development server

```bash
npm run dev
```

This starts both the Vite dev server (port **5173**) and the Express backend (port **3001**) concurrently.

Open **http://localhost:5173** in your browser and sign in with GitHub.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend (Vite) and backend (Express) concurrently |
| `npm run build` | Build the frontend for production |
| `npm run preview` | Preview the production build locally |
| `npm run server` | Start only the Express backend |

---

## Project Structure

```
DevMetrics/
├── public/                     # Static assets
├── server/
│   ├── index.js                # Express entry point (middleware, routes, static serving)
│   └── routes/
│       ├── auth.js             # OAuth flow (/auth/github, /auth/me, /auth/logout)
│       └── github.js           # GitHub data API (/api/github/stats) + analytics engine
├── src/
│   ├── main.jsx                # React entry point
│   ├── App.jsx                 # Router, AuthProvider, protected/public routes
│   ├── app/
│   │   └── globals.css         # Design system & component styles
│   ├── components/
│   │   ├── Dashboard.jsx       # Main data orchestrator & grid layout
│   │   ├── Navbar.jsx          # Top navigation bar
│   │   ├── Sidebar.jsx         # Side navigation with user profile
│   │   ├── SkeletonLoaders.jsx # Loading placeholders
│   │   └── dashboard/          # Dashboard widget components
│   │       ├── MetricCards.jsx
│   │       ├── CommitActivity.jsx
│   │       ├── ContributionHeatmap.jsx
│   │       ├── TopLanguages.jsx
│   │       ├── CodeChurnChart.jsx
│   │       ├── CommitQuality.jsx
│   │       ├── CollaborationCard.jsx
│   │       ├── RecentRepos.jsx
│   │       ├── CommitPatterns.jsx
│   │       ├── OverviewStats.jsx
│   │       └── ...
│   ├── context/
│   │   └── AuthContext.jsx     # Global auth state (user, loading, login/logout)
│   └── pages/
│       ├── LandingPage.jsx
│       ├── SignInPage.jsx
│       └── DashboardPage.jsx
├── .env.local                  # Environment variables (not committed)
├── package.json
└── vite.config.js              # Vite config with API proxy to Express
```

---

## Architecture Overview

```
Browser (React SPA)  ──HTTP──▸  Vite Dev Server (proxy)  ──▸  Express Server  ──▸  GitHub API
        ◂── JSON ───────────────────────────────────────────────────┘
```

- **Frontend** — React 19 SPA with React Router for client-side routing. Auth state is managed via Context API; chart data is fetched from the Express backend.
- **Backend** — Express server handles GitHub OAuth 2.0, session management, and a `/api/github/stats` endpoint that fetches data from the GitHub REST & GraphQL APIs in parallel, runs an analytics engine (language stats, code churn, commit quality scoring, collaboration metrics), and caches results in memory with a 5-minute TTL.
- **Proxy** — Vite proxies `/api/*` and `/auth/*` requests to the backend during development.

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/github` | Initiate GitHub OAuth flow |
| GET | `/auth/github/callback` | OAuth callback — exchanges code for token, creates session |
| GET | `/auth/me` | Return the authenticated user (or 401) |
| POST | `/auth/logout` | Destroy the session |

### GitHub Data

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/github/stats` | Full analytics payload (cached 5 min) |
| GET | `/api/github/stats?nocache=1` | Bypass cache and fetch fresh data |
| GET | `/api/github/clear-cache` | Clear the in-memory cache |

---

## Production Build

```bash
npm run build        # Outputs optimized frontend to dist/
npm run server       # Express serves dist/ and handles API routes
```

Set `NODE_ENV=production` and update `FRONTEND_URL` and the GitHub OAuth callback URL to your production domain.

### Recommended Hosting Platforms

- **Railway** / **Render** — full-stack Node.js deployment
- **Heroku** — Procfile-based deployment
- **DigitalOcean App Platform** — container or Node.js buildpack
- **Vercel** + separate API — frontend on Vercel, backend on a Node host

---

## Security

- GitHub OAuth 2.0 with scoped permissions (`read:user`, `user:email`, `repo`)
- Session cookies are `httpOnly`, `sameSite: lax`, and `secure` in production
- Access tokens are stored server-side in sessions — never exposed to the client
- CORS is restricted to the configured `FRONTEND_URL`
- Secrets are loaded from environment variables and never committed to source control

---

## License

This project is private and not currently published under an open-source license.
