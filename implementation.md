# CampusOS — Complete Implementation Plan
> **This document is the single source of truth for the CampusOS project.**
> It is written for handoff between AI models, developers, and contributors.
> Read this before touching any code.

---

## 1. Project Overview

**CampusOS** is a unified, full-stack web platform for college students. It consolidates five core campus needs into one authenticated ecosystem:

| # | Module | Summary | Status |
|---|--------|---------|--------|
| 1 | **Placement Preparation** | DSA Practice Tracker (17 topics), Private Core Subject Notes manager, and Personal Resume Link Manager | ? Complete |
| 2 | **Mentorship** | Find, request, and manage mentor-student guidance | ? Complete |
| 3 | **Events Hub** | Browse, filter, publish, and delete events with banner image uploads to Cloudinary | ? Complete |
| 4 | **Resources Module** | Shared academic resources — Core Subject Notes, PYQs, Interview Notes, Cheat Sheets — managed exclusively by the Placement Coordinator | ? Complete |
| 5 | **Career Tracking** | Discover and track Internships, Full-Time Jobs, and Freelance Opportunities published by the Placement Coordinator. Students register interest; coordinator downloads CSV of registered emails. | ? Complete |

---

## 2. Tech Stack

### Backend
| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20+ (tested on Node 24) |
| Framework | Express.js 5.x |
| Language | TypeScript |
| ORM | Prisma 6.x |
| Database | PostgreSQL 15 |
| Cache | Redis 7 (future) |
| Auth | JWT (Access Token 5h + Refresh Token 7d via HTTP-only cookie) |
| Hashing | bcryptjs |
| Validation | Zod |
| Image Storage | Cloudinary (campusos/events/ for events; campusos/resources/ for cheat sheets; campusos/career/ for opportunity banners) |
| Architecture | Route ? Controller ? Service ? Repository ? Database |

### Frontend
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State | TanStack Query (React Query) |
| Forms | React Hook Form + @hookform/resolvers + Zod |
| Icons | Lucide React |
| Auth State | Custom React Context (AuthProvider) |

### Infrastructure
| Service | Technology |
|---------|-----------|
| Database | PostgreSQL (local via Docker / cloud via Supabase / Railway) |
| Cache | Redis (optional, for future phases) |
| Image Storage | Cloudinary (events + cheat sheets + career banners) |
| Local Dev | docker-compose.yml at project root |

---

## 3. Role System

```
enum Role {
  STUDENT             // Default. Full read access. Private placement data.
  MENTOR              // Can create a mentor profile and accept session requests.
  PLACEMENT_COORDINATOR  // Manages Events Hub + Resources Module + Career Tracking.
                         // CONSTRAINT: Only ONE Placement Coordinator may register in the system.
}
```

**PLACEMENT_COORDINATOR rules:**
- Replaced the old `EVENT_ORGANIZER` role (migrated via `npx prisma db push`).
- Only one coordinator allowed — `AuthService.register()` returns HTTP 409 if a second attempts to register.
- Has authority over: **Events Hub** (create/delete events), **Resources Module** (all CRUD + Cloudinary upload), and **Career Tracking** (publish/edit/delete opportunities + download registered student CSVs).
- Does **not** have access to other users' private placement data (DSA, personal notes, resume).

---

## 4. Project Directory Structure

```
CampusOsProject/
+-- docker-compose.yml          # Local Postgres + Redis containers
+-- IMPLEMENTATION_PLAN.md      # This file
+-- PROGRESS.md                 # Completed tasks + next steps
+-- README.md                   # Human-readable project README
¦
+-- backend/
¦   +-- .env                    # Environment variables (never commit)
¦   +-- package.json
¦   +-- tsconfig.json
¦   +-- prisma/
¦   ¦   +-- schema.prisma       # Prisma DB schema (all models)
¦   ¦   +-- seed.js             # Compiled JS database seeds
¦   ¦   +-- seed.ts             # Source TS database seeds (DSA Categories)
¦   ¦   +-- clean-db.js         # Transactional database reset helper script
¦   +-- src/
¦       +-- server.ts           # Entry point — binds Express to PORT
¦       +-- app.ts              # Express app config, CORS, routes, health
¦       +-- config/
¦       ¦   +-- prisma.ts       # PrismaClient singleton (default export)
¦       ¦   +-- cloudinary.ts   # Cloudinary SDK singleton (lazy init from env)
¦       +-- middleware/
¦       ¦   +-- auth.ts         # authenticate() + requireRole() middleware
¦       +-- modules/
¦           +-- auth/           # types.ts, schema.ts, repository.ts, service.ts, controller.ts, routes.ts
¦           +-- users/          # getProfile, updateProfile
¦           +-- dsa/            # ? Phase 2 — DSA Tracker Module
¦           +-- subject-notes/  # ? Phase 2 — Private Core Subject Notes (per user)
¦           +-- personal-resume/ # ? Phase 2 — Personal Resume Link Manager
¦           +-- mentorship/     # ? Phase 3 — Mentorship Module
¦           +-- events/         # ? Phase 4 — Events Hub (PLACEMENT_COORDINATOR guard)
¦           +-- resources/      # ? Phase 5 — Shared Resources Module
¦           +-- career/         # ? Phase 6 — Career Tracking Module
¦               +-- types.ts    # CreateOpportunityInput, UpdateOpportunityInput
¦               +-- schema.ts   # Zod schemas
¦               +-- repository.ts  # Prisma queries (list, getById, CRUD, register, getRegisteredStudents)
¦               +-- service.ts  # Business logic + CSV generation
¦               +-- controller.ts  # HTTP handlers + Cloudinary upload + CSV download
¦               +-- routes.ts   # REST endpoints with RBAC middleware
¦
+-- frontend/
    +-- .env.local              # NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
    +-- package.json
    +-- next.config.ts          # IPv4 proxy rewrite to backend
    +-- tsconfig.json
    +-- src/
        +-- lib/
        ¦   +-- api.ts          # apiFetch() + getAccessToken() with token auto refresh
        +-- providers/
        ¦   +-- QueryProvider.tsx
        ¦   +-- AuthProvider.tsx
        +-- app/
            +-- layout.tsx
            +-- page.tsx        # Landing page
            +-- auth/
            ¦   +-- login/page.tsx
            ¦   +-- register/page.tsx
            +-- dashboard/
                +-- layout.tsx      # Sidebar (6 nav items incl. Career Tracking)
                +-- page.tsx        # Dashboard overview
                +-- profile/page.tsx
                +-- placement/
                ¦   +-- page.tsx
                ¦   +-- dsa/page.tsx
                +-- mentorship/
                ¦   +-- page.tsx
                ¦   +-- requests/page.tsx
                +-- events/page.tsx
                +-- resources/page.tsx
                +-- career/page.tsx     # ? Career opportunities board
```

---

## 5. Database Schema (Current — Prisma)

Located at `backend/prisma/schema.prisma`

### Enums
- `Role`: STUDENT | MENTOR | PLACEMENT_COORDINATOR
- `Difficulty`: EASY | MEDIUM | HARD
- `RequestStatus`: PENDING | ACCEPTED | REJECTED | CANCELLED
- `EventCategory`: HACKATHON | WORKSHOP | TECHNICAL_EVENT | CODING_CONTEST
- `OpportunityType`: INTERNSHIP | FULL_TIME_JOB | FREELANCE_OPPORTUNITY

### Models
- **User** — with relations to: Profile, RefreshToken, MentorProfile, MentorshipRequest, DsaProblem, UserDsaProblem, CoreSubjectNote, PersonalResume, Event, CareerOpportunity, CareerRegistration
- **RefreshToken**, **Profile**
- **DsaCategory**, **DsaProblem**, **UserDsaProblem** — DSA tracker (Phase 2)
- **CoreSubjectNote** — private per-user subject notes (Phase 2)
- **PersonalResume** — one per user (Phase 2)
- **MentorProfile**, **MentorshipRequest** — mentorship (Phase 3)
- **Event** — events hub (Phase 4); fields: title, description, bannerImageUrl, category, organizer, date, startTime, endTime, location, registrationDeadline, maximumParticipants, registrationLink, createdBy
- **ResourceCoreSubjectNote**, **ResourcePreviousYearQuestion**, **ResourceInterviewNote**, **ResourceCheatSheet** — resources (Phase 5)
- **CareerOpportunity** — (Phase 6); fields: companyName, role, jobType (OpportunityType), location, stipendPerMonth, applicationLink, bannerImageUrl, createdById
- **CareerRegistration** — (Phase 6); fields: opportunityId, userId, email; constraint: @@unique([opportunityId, userId])

---

## 6. Authentication Flow

```
REGISTER: POST /api/v1/auth/register
  Body: { email, password, firstName, lastName, role }
  ? If role == PLACEMENT_COORDINATOR: check findPlacementCoordinator() ? reject with 409 if exists
  ? Hash password, transaction setup User + Profile
  ? AccessToken (JWT, 5h) + RefreshToken (JWT, 7d)
  ? Set HttpOnly Cookie, return { accessToken }

LOGIN / LOGOUT / SWAP:
  ? Clearing QueryClient cache via queryClient.clear() inside AuthProvider
  ? Prevents cache bleed across user sessions.
```

---

## 7. API Endpoints

### Authentication
* `POST /api/v1/auth/register` — roles: STUDENT | MENTOR | PLACEMENT_COORDINATOR
* `POST /api/v1/auth/login`
* `POST /api/v1/auth/refresh`
* `POST /api/v1/auth/logout`

### User Profile
* `GET /api/v1/users/profile`
* `PUT /api/v1/users/profile`

### DSA Practice Tracker
* `GET /api/v1/dsa/dashboard`
* `GET /api/v1/dsa/categories`
* `GET /api/v1/dsa/categories/:id/problems`
* `POST /api/v1/dsa/problems`
* `PUT /api/v1/dsa/problems/:id`
* `DELETE /api/v1/dsa/problems/:id`
* `PATCH /api/v1/dsa/problems/:id/status`

### Core Subject Notes (Private)
* `GET /api/v1/core-subject-notes`
* `POST /api/v1/core-subject-notes`
* `PUT /api/v1/core-subject-notes/:id`
* `DELETE /api/v1/core-subject-notes/:id`

### Personal Resume
* `GET /api/v1/personal-resume`
* `POST /api/v1/personal-resume`
* `PUT /api/v1/personal-resume/:id`
* `DELETE /api/v1/personal-resume/:id`

### Mentorship
* `GET /api/v1/mentors`
* `GET /api/v1/mentors/profile`
* `POST /api/v1/mentors/profile`
* `POST /api/v1/mentors/:mentorId/request`
* `GET /api/v1/mentors/requests`
* `PUT /api/v1/mentors/requests/:requestId`

### Events Hub
* `GET /api/v1/events`
* `GET /api/v1/events/upcoming`
* `GET /api/v1/events/past`
* `GET /api/v1/events/:id`
* `POST /api/v1/events` — PLACEMENT_COORDINATOR only
* `DELETE /api/v1/events/:id` — PLACEMENT_COORDINATOR only
* `POST /api/v1/events/upload` — PLACEMENT_COORDINATOR only

### Resources Module
* `GET /api/v1/resources`
* `POST /api/v1/resources/subject-notes` — PLACEMENT_COORDINATOR only
* `PUT /api/v1/resources/subject-notes/:id` — PLACEMENT_COORDINATOR only
* `DELETE /api/v1/resources/subject-notes/:id` — PLACEMENT_COORDINATOR only
* `POST /api/v1/resources/previous-year-questions` — PLACEMENT_COORDINATOR only
* `PUT /api/v1/resources/previous-year-questions/:id` — PLACEMENT_COORDINATOR only
* `DELETE /api/v1/resources/previous-year-questions/:id` — PLACEMENT_COORDINATOR only
* `POST /api/v1/resources/interview-notes` — PLACEMENT_COORDINATOR only
* `PUT /api/v1/resources/interview-notes/:id` — PLACEMENT_COORDINATOR only
* `DELETE /api/v1/resources/interview-notes/:id` — PLACEMENT_COORDINATOR only
* `POST /api/v1/resources/cheat-sheets` — PLACEMENT_COORDINATOR only
* `POST /api/v1/resources/cheat-sheets/upload` — PLACEMENT_COORDINATOR only (Cloudinary)
* `PUT /api/v1/resources/cheat-sheets/:id` — PLACEMENT_COORDINATOR only
* `DELETE /api/v1/resources/cheat-sheets/:id` — PLACEMENT_COORDINATOR only

### Career Tracking
* `GET /api/v1/career` — list all opportunities with hasRegistered + registrationCount (all authenticated)
* `POST /api/v1/career` — publish new opportunity (PLACEMENT_COORDINATOR only)
* `POST /api/v1/career/upload` — upload opportunity banner to Cloudinary (PLACEMENT_COORDINATOR only)
* `PUT /api/v1/career/:id` — update opportunity (PLACEMENT_COORDINATOR only)
* `DELETE /api/v1/career/:id` — delete opportunity (PLACEMENT_COORDINATOR only)
* `GET /api/v1/career/:id/download` — download registered student emails as CSV (PLACEMENT_COORDINATOR only)
* `POST /api/v1/career/:id/register` — register interest in opportunity (any authenticated user)
* `DELETE /api/v1/career/:id/register` — unregister from opportunity (any authenticated user)

---

## 8. Remaining Phases

### Phase 7: Production Engineering
- Add proper Prisma migrations (replace `db push` with `migrate deploy`)
- Rate limiting (express-rate-limit + Redis)
- Error monitoring (Sentry)
- CI/CD pipeline (GitHub Actions)
- Containerization (Dockerfile + docker-compose.prod.yml)
- Environment secrets management

---

## 9. Key Engineering Rules

1. **Module pattern**: `types.ts ? schema.ts ? repository.ts ? service.ts ? controller.ts ? routes.ts`
2. **All request bodies** validated with Zod schemas before entering service layer
3. **Ownership guards**: Any user-scoped resource must verify `record.userId === req.user.id` in the service layer
4. **Role guards**: Use `requireRole([...])` middleware on all write operations
5. **Express param typing**: `req.params['id'] as string` — required in Express 5 (typed as `string | string[]`)
6. **Route ordering**: Static routes (e.g. `/upload`) must be declared before parameterized routes (e.g. `/:id`) to avoid swallowing
7. **Cloudinary**: Use `multer({ storage: multer.memoryStorage() })` ? convert buffer to base64 ? upload; never stream disk files
8. **Raw fetch auth**: When using raw `fetch()` for multipart uploads or blob downloads, always pass `Authorization: Bearer ${getAccessToken()}` explicitly — the browser will NOT auto-attach the Bearer token for raw fetch calls
9. **Never commit** `.env` or `.env.local`
10. **Session**: `queryClient.clear()` on every login/logout to prevent cross-user cache bleed
11. **Build check**: `npx tsc --noEmit` on both backend and frontend before every commit
