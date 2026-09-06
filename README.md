# Makarios Admin

A mobile-first Progressive Web App (PWA) used to track ministerial activities for the Makarios dominion. It covers service recording, member management, attendance, campaigns, and church-administration (streams, regions, zones, bacentas, and leaders).

## Tech Stack

- **React 18** + **TypeScript**
- **Vite 4** with `vite-plugin-pwa` (auto-updating service worker)
- **React Router v6**
- **React Query** for server-state caching
- **Axios** for API calls
- **antd-mobile** + **antd-mobile-icons** for UI components
- **Recharts** for insights/charts
- **Cloudinary** for image uploads
- **@react-oauth/google** for Google sign-in

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm

### Installation

```bash
npm install
```

### Environment Variables

Copy the following into a `.env` file at the project root:

```env
VITE_BASE_URL=http://localhost:8000/api
VITE_CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
VITE_GOOGLE_CLIENT_ID=<google_oauth_client_id>
```

| Variable | Description |
|----------|-------------|
| `VITE_BASE_URL` | Base URL of the backend API (e.g. `http://localhost:8000/api`) |
| `VITE_CLOUDINARY_URL` | Cloudinary upload URL (scheme: `cloudinary://key:secret@cloud_name`) |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID for sign-in |

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check (`tsc`) then build for production |
| `npm run preview` | Preview the production build locally |

The dev server runs with `--host` enabled and sets the `Cross-Origin-Opener-Policy` header needed for Google OAuth popups.

## Project Structure

```
src/
├── api/            # Axios API layer (auth, members, streams, regions, zones, bacentas, leaders, campaigns, services, etc.)
├── assets/         # Static assets
├── components/     # Reusable components (Layout, ImageUpload, PageHeader)
├── contexts/       # React contexts (ThemeContext)
├── hooks/          # Custom hooks (useLogin, useMembers, useUpdateMember, useTheme)
└── pages/          # Route-level pages
    ├── Admin/      # Streams, regions, zones, bacentas, leaders, campaigns management
    ├── Auth/       # Login, complete profile
    ├── Campaigns/  # Campaign info, anti-brutish leaders, sheep-seeking records
    ├── Home/       # Dashboard, insights
    ├── Members/    # Member list, add/edit, attendance, profile
    ├── Services/   # Service recording and service history
    └── Settings/   # App settings
```

### API Layer

Each backend domain has a typed module in `src/api` (e.g. `streams.ts`, `members.ts`, `bacentas.ts`). The shared axios instance lives in `src/api/axios.ts` and attaches the bearer token from `localStorage` to every request.

## Features

- **Google sign-in** with profile completion flow
- **Service tracking** — record services, service selection, bacenta-level service forms and history
- **Member management** — add, edit, attendance tracking, and member profiles
- **Church administration** — manage streams, regions, zones, bacentas, and leaders, with detail pages for streams and regions
- **Campaigns** — campaign info updates, anti-brutish leaders, and sheep-seeking records
- **Insights** — charts and analytics via Recharts
- **Offline-ready PWA** — installable, with service-worker caching

## Routing

All routes live in `src/App.tsx`. The app is wrapped in `QueryClientProvider` and `ThemeProvider`, with pages nested under the `MainLayout` (`/dashboard`).

## Deployment

Build with `npm run build`, which runs the TypeScript compiler and Vite build into `dist/`. The repository includes a `Dockerfile` for containerized serving.
