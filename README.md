### ByFood Assignment Monorepo

A small, multi-service library management system built as part of a ByFood assignment. This repository is a monorepo containing:

- Library Backend (Go/Fiber + PostgreSQL)
- Library Frontend (Next.js 15 + React 19)
- URL Cleanup Backend (Go/Fiber)

Each subproject has its own detailed README. This root README provides a concise overview and a quick-start guide.

## Repository Structure

```
byfood-assignment/
├── library-backend/        # Go REST API for library books (CRUD, Swagger, migrations)
├── library-frontend/       # Next.js application for managing books (CRUD UI)
└── url-cleanup-backend/    # Go microservice for URL processing/cleanup
```

## Tech Highlights

- Go 1.23, Fiber, sqlx/pgx, Squirrel query builder, Viper config, validator, Swagger
- Next.js 15, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, TanStack Query/Table
- Clean architecture, interface-first design, DI, unit tests with mocks

## Live Apps

- Library Backend: [Swagger](https://library-backend-utm48.ondigitalocean.app/swagger/index.html)
- Library Frontend: [Dashboard](https://byfood-assignment.vercel.app/books)
- URL Cleanup Backend: [Swagger](https://url-cleanup-sg3s9.ondigitalocean.app/swagger/index.html)

## Prerequisites

- Go 1.23+
- Node.js 18+
- PostgreSQL (for `library-backend`)
- Docker (optional) for `library-backend` compose workflow

## Quick Start (All Services)

Open three terminals and run each service in its own terminal:

1. Library Backend (API)

```bash
cd library-backend
make env           # copy .env.example → .env and adjust if needed
make dev           # start with hot reloading (Air)
# Swagger: http://localhost:8080/swagger/index.html
```

2. URL Cleanup Backend (Microservice)

```bash
cd url-cleanup-backend
make env           # if .env.example exists; otherwise set envs directly
make dev           # start with hot reloading (Air) or `make run`
# Swagger: http://localhost:8000/swagger/index.html
```

3. Library Frontend (Next.js)

```bash
cd library-frontend
npm install
cp env.example .env.local   # update values as needed
npm run dev
# App: http://localhost:3000
```

Default local ports:

- Library Backend: 8080
- URL Cleanup Backend: 8000
- Library Frontend: 3000

## Minimal Environment Configuration

- `library-frontend/.env.local`

  - `NEXT_PUBLIC_LIBRARY_API_HOST=http://localhost:8080`
  - Optional ImageKit keys if using image upload (see frontend README)

- `library-backend/.env`

  - Database URL and server config (see backend README for full list)

- `url-cleanup-backend/.env`
  - `APP_PORT` and `APP_NAME` (optional; see service README)

## Development Workflow (At a Glance)

Library Backend (Go):

- `make run` — Run directly
- `make dev` — Dev mode with Air hot reloading
- `make build` — Build binary
- `make test` / `make test-coverage-html` — Run tests and coverage
- `make swagger` — Generate/update Swagger docs

URL Cleanup Backend (Go):

- `make run` / `make dev` / `make build`
- `make test` / `make test-coverage-html`
- `make swagger`

Library Frontend (Next.js):

- `npm run dev` — Dev server with Turbopack
- `npm run lint` — ESLint
- `npm run build` / `npm start` — Production

## Database & Migrations

The `library-backend` uses PostgreSQL and includes migrations plus seed data. Follow its README for local DB setup and migration details. The app can run automatic migrations on startup in supported commands.

## API Documentation

- Library Backend Swagger: `http://localhost:8080/swagger/index.html`
- URL Cleanup Backend Swagger: `http://localhost:8000/swagger/index.html`

## Links to Detailed READMEs

- Library Backend: `library-backend/README.md`
- Library Frontend: `library-frontend/README.md`
- URL Cleanup Backend: `url-cleanup-backend/README.md`

## Notes

- Use the per-service READMEs for deeper configuration, API examples, and development guidance.
