# Luxe Wear AI – Client App

Client-side application for Luxe Wear AI, a multi-tenant agent platform that lets fashion brands train, deploy, and monitor AI stylists. The app is built with Next.js App Router and ships with marketing pages, onboarding flows, dashboards, docs, and tenant-aware management features.

> This README is intentionally hands-on: follow the quick start, fill in environment variables, and keep the coding standards below in sync with your future changes.

---

## Tech stack

- Next.js 14 (App Router, Server Components, Route Groups)
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui + custom design tokens
- Redux Toolkit + Redux Persist for auth/tenant state
- Axios service layer with refresh-token flow
- Zod + React Hook Form (forms), Recharts (analytics), Sonner (toast)

---

## Requirements

- Node.js ≥ 18.17
- npm ≥ 10 (ships with Node 18)
- A running Luxe Wear AI backend (`server-luxe-wear-ai` in this repo) or staging URL

Check your versions quickly:

```bash
node -v
npm -v
```

---

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Create `.env.local` (see section below) and fill in values
echo "NEXT_PUBLIC_SERVER_URL=http://localhost:3001" > .env.local  # adjust as needed

# 3. Run the dev server
npm run dev

# 4. Open the app
open http://localhost:3000
```

When touching both client & server, start the API first so forward proxy routes succeed.

---

## Environment variables

Create `.env.local` in the project root and keep sensitive values out of git.

| Variable | Description | Example |
| --- | --- | --- |
| `NEXT_PUBLIC_SERVER_URL` | Base URL for the NestJS backend. Used by Axios instance and widget embeds. | `http://localhost:3001` |
| `NEXT_PUBLIC_WIDGET_ORIGIN` _(optional)_ | Allowed origin for embedded chat widget previews; falls back to `NEXT_PUBLIC_SERVER_URL`. | `https://api.luxe-wear.ai` |

When you add new variables, document them here and in your preferred env template (for local dev you can keep a private `.env.example`).

---

## Available npm scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Next.js in development mode with hot reload. |
| `npm run build` | Build the production bundle (`.next`). |
| `npm run start` | Serve the production build. |
| `npm run lint` | Run ESLint with the repo ruleset. |
| `npm run lint:fix` | ESLint with auto-fix enabled. |
| `npm run format` | Prettier write mode for the entire repo (respects `.prettierignore`). |
| `npm run format:check` | Prettier check mode (CI safe). |

Prefer running `lint` + `format:check` locally before opening a PR.

---

## Project structure

```
client-luxe-wear-ai/
├── app/                      # Next.js App Router pages + route groups
│   ├── (guest)/auth          # marketing + public auth flows
│   ├── (user)/docs           # static docs pages + MDX scaffold
│   ├── dashboard             # authenticated user dashboard + nested layouts
│   └── (admin)/admin         # admin dashboard & tools (users, tenants, agents, analytics)
├── components/
│   ├── ui/                   # shadcn-style primitives
│   ├── shared/               # cross-domain widgets (EmptyState, Toast, etc.)
│   └── dashboard/            # shell + sections for dashboard
├── services/                 # Axios services built on top of `http.ts`
├── store/                    # Redux Toolkit slices (auth, tenant)
├── lib/                      # utilities, route config, constants
├── public/                   # static assets (images, videos, widget files)
├── styles/ / globals.scss    # global styles + Tailwind directives
├── tailwind.config.ts        # design tokens and shadcn presets
└── TENANT_IMPLEMENTATION_GUIDE.md
```

Keep feature-specific components close to their domain folder and move reusable widgets into `components/shared` or `components/ui`.


---

## Coding standards

- **API communication:** Never call `fetch`/`axios` directly inside React components. Add new endpoints to the relevant file inside `services/` and re-export typed helpers if multiple features share logic.
- **State:** Use Redux Toolkit for persisted auth / tenant context. Prefer hooks (`useAuth`, `useTenant`, `usePagination`, etc.) to keep components presentational.
- **UI consistency:** Reuse primitives from `components/ui` and shared layouts to prevent Tailwind drift. When a pattern repeats twice, extract it.
- **Lint & format:** ESLint (Next + @typescript-eslint) prevents `any`, stray logs, and unused vars. Prettier + Tailwind plugin keeps class order deterministic. Run `npm run lint && npm run format:check` before pushing.
- **Docs:** Update this README, and feature guides when you add sections or environment variables.

---

## Helpful references


- `CLIENT_FEATURES.md`: canonical feature matrix for every screen
- `TENANT_IMPLEMENTATION_GUIDE.md`: UX + state expectations for multi-tenant flows
- `server-luxe-wear-ai/README.md`: backend setup, endpoints, and local dev scripts

Feel free to keep improving the checklist as you complete items—this README should remain the single source of truth for setting up and running the client.
