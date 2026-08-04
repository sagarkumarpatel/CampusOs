# CampusOS — Complete Implementation Plan
> **This document is the single source of truth for the CampusOS project.**
> It is written for handoff between AI models, developers, and contributors.
> Read this before touching any code.

---

## 1. Project Overview

**CampusOS** is a unified, full-stack web platform for college students. It consolidates six core campus needs into one authenticated ecosystem:

| # | Module | Summary |
|---|--------|---------|
| 1 | **Placement Preparation** | DSA & CS syllabus tracker with categories, topics, and progress bars |
| 2 | **Mentorship** | Find, request, and manage mentor-student relationships |
| 3 | **Events Hub** | Browse, register, and track hackathons, contests, seminars |
| 4 | **Clubs Portal** | Discover, join, and manage campus clubs |
| 5 | **Academic Resources** | Share, search, and bookmark lecture notes, PYQs, roadmaps |
| 6 | **Career Tracking** | Log job/internship applications with timelines and status |

---

## 2. Tech Stack

### Backend
| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20+ |
| Framework | Express.js 5.x |
| Language | TypeScript |
| ORM | Prisma 6.x |
| Database | PostgreSQL 15 |
| Cache | Redis 7 (future) |
| Auth | JWT (Access Token 15m + Refresh Token 7d via HTTP-only cookie) |
| Hashing | bcryptjs |
| Validation | Zod |
| Architecture | Route → Controller → Service → Repository → Database |

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
| Cache | Redis (optional, for future rate limiting / session caching) |
| Local Dev | docker-compose.yml at project root |

---

## 3. Project Directory Structure

```
CampusOsProject/
├── docker-compose.yml          # Local Postgres + Redis containers
├── IMPLEMENTATION_PLAN.md      # This file
├── PROGRESS.md                 # Completed tasks + next steps
├── README.md                   # Human-readable project README
│
├── backend/
│   ├── .env                    # Environment variables (never commit)
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma/
│   │   └── schema.prisma       # Prisma DB schema (all models)
│   └── src/
│       ├── server.ts           # Entry point — binds Express to PORT
│       ├── app.ts              # Express app config, CORS, routes, health
│       ├── config/
│       │   └── prisma.ts       # PrismaClient singleton
│       ├── middleware/
│       │   └── auth.ts         # authenticate() + requireRole() middleware
│       └── modules/
│           ├── auth/
│           │   ├── types.ts        # UserPayload type + Express Request extension
│           │   ├── schema.ts       # Zod schemas (registerSchema, loginSchema)
│           │   ├── repository.ts   # DB queries (findByEmail, createUser, tokens)
│           │   ├── service.ts      # Business logic (register, login, refresh, logout)
│           │   ├── controller.ts   # Request handlers
│           │   └── routes.ts       # POST /auth/register|login|refresh|logout
│           ├── users/
│           │   ├── repository.ts   # getProfile, updateProfile
│           │   ├── service.ts
│           │   ├── controller.ts
│           │   └── routes.ts       # GET /users/profile, PUT /users/profile
│           ├── placement/          # [PHASE 2 — TO BUILD]
│           ├── mentorship/         # [PHASE 3 — TO BUILD]
│           ├── events/             # [PHASE 4 — TO BUILD]
│           ├── clubs/              # [PHASE 5 — TO BUILD]
│           ├── resources/          # [PHASE 6 — TO BUILD]
│           └── career/             # [PHASE 7 — TO BUILD]
│
└── frontend/
    ├── .env.local              # NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
    ├── package.json
    ├── next.config.ts
    ├── tsconfig.json
    └── src/
        ├── lib/
        │   └── api.ts          # apiFetch() with auto token refresh on 401
        ├── providers/
        │   ├── QueryProvider.tsx    # TanStack Query client wrapper
        │   └── AuthProvider.tsx     # Auth context: user, login, logout, refresh
        └── app/
            ├── layout.tsx          # Root layout: QueryProvider + AuthProvider
            ├── page.tsx            # / Landing page (public)
            ├── auth/
            │   ├── login/
            │   │   └── page.tsx    # /auth/login — Login form
            │   └── register/
            │       └── page.tsx    # /auth/register — Registration form with role select
            └── dashboard/
                ├── layout.tsx      # Protected sidebar layout (all modules)
                ├── page.tsx        # /dashboard — Summary overview of all modules
                ├── profile/
                │   └── page.tsx    # /dashboard/profile — Edit profile, skills, college
                ├── placement/      # [PHASE 2 — TO BUILD]
                ├── mentorship/     # [PHASE 3 — TO BUILD]
                ├── events/         # [PHASE 4 — TO BUILD]
                ├── clubs/          # [PHASE 5 — TO BUILD]
                ├── resources/      # [PHASE 6 — TO BUILD]
                └── career/         # [PHASE 7 — TO BUILD]
```

---

## 4. Database Schema (Current — Prisma)

Located at `backend/prisma/schema.prisma`

```prisma
enum Role {
  STUDENT | MENTOR | CLUB_MANAGER | EVENT_ORGANIZER
}

model User {
  id, email (unique), passwordHash, role, createdAt, updatedAt
  → has one Profile
  → has many RefreshTokens
}

model RefreshToken {
  id, token (unique), userId (FK), expiresAt, createdAt
}

model Profile {
  id, userId (unique FK), firstName, lastName,
  avatarUrl?, bio?, skills (String[]),
  college?, graduationYear?, resumeUrl?,
  createdAt, updatedAt
}
```

### Future Models to Add (per phase)
- **Phase 2**: `PreparationCategory`, `PreparationTopic`, `PreparationProgress`
- **Phase 3**: `MentorProfile`, `MentorshipRequest`, `Mentorship`
- **Phase 4**: `Event`, `EventRegistration`
- **Phase 5**: `Club`, `ClubMembership`
- **Phase 6**: `Resource`, `ResourceBookmark`
- **Phase 7**: `CareerApplication`

---

## 5. Authentication Flow

```
REGISTER: POST /api/v1/auth/register
  Body: { email, password, firstName, lastName, role }
  → Hash password with bcryptjs
  → Create User + Profile in a Prisma transaction
  → Sign accessToken (JWT, 15m) + refreshToken (JWT, 7d)
  → Save refreshToken to DB (RefreshToken table)
  → Set refreshToken in HTTP-only cookie
  → Return { user, accessToken }

LOGIN: POST /api/v1/auth/login
  Body: { email, password }
  → Find user, compare password
  → Generate and store new token pair
  → Same cookie + response pattern

REFRESH: POST /api/v1/auth/refresh
  → Read refreshToken from HTTP-only cookie
  → Validate in DB + check expiry
  → Delete old token (rotation), create new pair
  → Return { accessToken, refreshToken (new cookie), user }

LOGOUT: POST /api/v1/auth/logout
  → Delete refreshToken from DB
  → Clear cookie

FRONTEND AUTO-REFRESH:
  apiFetch() in src/lib/api.ts:
    → On 401, calls /auth/refresh silently
    → Retries original request with new accessToken
    → On refresh failure, fires 'auth-logout' event → AuthProvider clears state
```

---

## 6. API Endpoints (Current)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/auth/register` | ❌ | Register a new user |
| POST | `/api/v1/auth/login` | ❌ | Login |
| POST | `/api/v1/auth/refresh` | ❌ (cookie) | Refresh access token |
| POST | `/api/v1/auth/logout` | ❌ (cookie) | Logout, clear token |
| GET | `/api/v1/users/profile` | ✅ Bearer | Get own profile |
| PUT | `/api/v1/users/profile` | ✅ Bearer | Update own profile |
| GET | `/health` | ❌ | DB health check |

---

## 7. Phase Roadmap

### ✅ Phase 1: Foundation (COMPLETE)
Backend skeleton, Auth, Profile, Dashboard layout, Frontend pages.

### 🔲 Phase 2: Placement Preparation
**Backend Models to add to schema.prisma:**
```prisma
model PreparationCategory {
  id, name, description?, icon?, color?
  topics PreparationTopic[]
}

model PreparationTopic {
  id, title, categoryId (FK), difficulty (EASY/MEDIUM/HARD), resourceUrl?
  progress PreparationProgress[]
}

model PreparationProgress {
  id, userId (FK), topicId (FK), status (NOT_STARTED/IN_PROGRESS/COMPLETED)
  notes?, updatedAt
  @@unique([userId, topicId])
}
```
**Backend Routes:**
- `GET /api/v1/placement/categories` — list all categories
- `GET /api/v1/placement/categories/:id/topics` — list topics in a category
- `GET /api/v1/placement/progress` — get user's topic progress
- `PUT /api/v1/placement/progress/:topicId` — mark topic status

**Frontend Pages:**
- `/dashboard/placement` — Category grid with per-category progress bars
- `/dashboard/placement/[categoryId]` — Topic list view with status toggles

---

### 🔲 Phase 3: Mentorship
**Backend Models:**
```prisma
model MentorProfile {
  id, userId (FK unique), title, company, skills (String[])
  bio?, linkedinUrl?, calendlyUrl?, isAvailable (bool)
}

model MentorshipRequest {
  id, studentId (FK), mentorId (FK)
  message, status (PENDING/ACCEPTED/REJECTED/CANCELLED)
  createdAt, updatedAt
}
```
**Backend Routes:**
- `GET /api/v1/mentors` — Browse available mentors (filter by skill)
- `POST /api/v1/mentors/profile` — Create mentor profile (MENTOR role)
- `POST /api/v1/mentors/:mentorId/request` — Send mentorship request
- `PUT /api/v1/mentors/requests/:requestId` — Accept/Reject (MENTOR)
- `GET /api/v1/mentors/requests` — List my requests (student + mentor)

**Frontend Pages:**
- `/dashboard/mentorship` — Browse mentor cards, filter by skills
- `/dashboard/mentorship/requests` — Manage sent/received requests

---

### 🔲 Phase 4: Events
**Backend Models:**
```prisma
model Event {
  id, title, description, type (HACKATHON/CONTEST/SEMINAR/WORKSHOP)
  startDate, endDate, venue?, registrationDeadline
  maxAttendees?, organizerId (FK), coverImageUrl?
  registrations EventRegistration[]
}

model EventRegistration {
  id, userId (FK), eventId (FK), registeredAt
  @@unique([userId, eventId])
}
```
**Backend Routes:**
- `GET /api/v1/events` — Browse events (filter by type, date)
- `POST /api/v1/events` — Create event (EVENT_ORGANIZER role)
- `POST /api/v1/events/:eventId/register` — Register for an event
- `DELETE /api/v1/events/:eventId/register` — Cancel registration
- `GET /api/v1/events/my` — Get my registered events

**Frontend Pages:**
- `/dashboard/events` — Event cards grid with registration status
- `/dashboard/events/[eventId]` — Event detail + register button

---

### 🔲 Phase 5: Clubs
**Backend Models:**
```prisma
model Club {
  id, name, description, logoUrl?, category?
  managerId (FK), createdAt
  members ClubMembership[]
  events Event[]   // optional FK link
}

model ClubMembership {
  id, userId (FK), clubId (FK), role (MEMBER/ADMIN)
  joinedAt
  @@unique([userId, clubId])
}
```
**Backend Routes:**
- `GET /api/v1/clubs` — Browse all clubs
- `POST /api/v1/clubs` — Create club (CLUB_MANAGER role)
- `POST /api/v1/clubs/:clubId/join` — Join a club
- `DELETE /api/v1/clubs/:clubId/leave` — Leave a club
- `GET /api/v1/clubs/my` — Get my clubs

**Frontend Pages:**
- `/dashboard/clubs` — Club discovery grid
- `/dashboard/clubs/[clubId]` — Club detail + join/leave button

---

### 🔲 Phase 6: Academic Resources
**Backend Models:**
```prisma
model Resource {
  id, title, description, type (NOTE/PYQ/ROADMAP/CHEATSHEET)
  subject?, fileUrl?, externalUrl?, tags (String[])
  uploaderId (FK), createdAt
  bookmarks ResourceBookmark[]
}

model ResourceBookmark {
  id, userId (FK), resourceId (FK), savedAt
  @@unique([userId, resourceId])
}
```
**Backend Routes:**
- `GET /api/v1/resources` — Browse/search resources
- `POST /api/v1/resources` — Upload resource (authenticated)
- `POST /api/v1/resources/:resourceId/bookmark` — Bookmark a resource
- `DELETE /api/v1/resources/:resourceId/bookmark` — Remove bookmark
- `GET /api/v1/resources/bookmarks` — Get my bookmarks

**Frontend Pages:**
- `/dashboard/resources` — Search + browse resource cards
- `/dashboard/resources/upload` — Upload a resource form

---

### 🔲 Phase 7: Career Tracking
**Backend Models:**
```prisma
enum ApplicationStatus {
  APPLIED | ONLINE_TEST | TECHNICAL_INTERVIEW | HR_INTERVIEW | OFFERED | REJECTED | WITHDRAWN
}

model CareerApplication {
  id, userId (FK), companyName, role, jobType (INTERNSHIP/FULLTIME)
  status ApplicationStatus, appliedDate, notes?
  ctc?, location?, jobUrl?
  updatedAt, createdAt
}
```
**Backend Routes:**
- `GET /api/v1/career` — Get my applications (filter by status)
- `POST /api/v1/career` — Log a new application
- `PUT /api/v1/career/:id` — Update application status
- `DELETE /api/v1/career/:id` — Delete an application

**Frontend Pages:**
- `/dashboard/career` — Kanban-style board or timeline table
- `/dashboard/career/new` — Add application form

---

### 🔲 Phase 8: Production Engineering
- Containerize backend using `Dockerfile` + `docker-compose.override.yml`
- Deployment via Railway / Render / Vercel (frontend)
- GitHub Actions CI/CD pipeline with lint, typecheck, and test steps
- Rate limiting middleware (express-rate-limit)
- Logging with Morgan + Winston
- Centralized error handler middleware
- Vitest test suite for backend services

---

## 8. Environment Variables

### Backend `backend/.env`
```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/campusos?schema=public"
JWT_SECRET="<strong-random-secret>"
JWT_REFRESH_SECRET="<strong-random-secret>"
JWT_ACCESS_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"
CORS_ORIGIN="http://localhost:3000"
NODE_ENV="development"
```

### Frontend `frontend/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

---

## 9. Running Locally

### Prerequisites
- Node.js 20+
- Docker Desktop (for local Postgres)
- npm 10+

### Steps
```bash
# 1. Start Postgres locally
docker compose up -d postgres

# 2. Run database migrations
cd backend
npx prisma migrate dev --name init

# 3. Start backend dev server
npm run dev
# → http://localhost:5000

# 4. Start frontend dev server (new terminal)
cd frontend
npm run dev
# → http://localhost:3000
```

---

## 10. Coding Conventions

- **Naming**: camelCase for variables/functions, PascalCase for classes/types
- **Module structure**: Each backend module must have `types.ts`, `schema.ts`, `repository.ts`, `service.ts`, `controller.ts`, `routes.ts`
- **Error handling**: All controller methods must use try/catch. Services throw descriptive `Error` objects
- **Zod validation**: All request bodies must be parsed through a Zod schema in the controller
- **No raw SQL**: Always use Prisma queries. Transactions for multi-table writes
- **Types**: Never use `any` — always type `req.user` via the extended `Express.Request` interface
- **Frontend**: All pages using hooks must be `'use client'`. Providers are in `src/providers/`
