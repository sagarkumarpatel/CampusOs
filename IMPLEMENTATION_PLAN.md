# CampusOS — Complete Implementation Plan
> **This document is the single source of truth for the CampusOS project.**
> It is written for handoff between AI models, developers, and contributors.
> Read this before touching any code.

---

## 1. Project Overview

**CampusOS** is a unified, full-stack web platform for college students. It consolidates six core campus needs into one authenticated ecosystem:

| # | Module | Summary | Status |
|---|--------|---------|--------|
| 1 | **Placement Preparation** | DSA Practice Tracker (17 topics), Core Subject Notes manager, and Personal Resume Link Manager | ✅ Complete |
| 2 | **Mentorship** | Find, request, and manage mentor-student guidance | ✅ Complete |
| 3 | **Events Hub** | Browse, filter, publish, and delete events with banner image uploads to Cloudinary | ✅ Complete |
| 4 | **Resources Module** | Shared academic resources — Core Subject Notes, PYQs, Interview Notes, Cheat Sheets — managed exclusively by the Placement Coordinator | ✅ Complete |
| 5 | **Clubs Portal** | Discover, join, and manage campus clubs | 🔲 Phase 6 |
| 6 | **Career Tracking** | Log job/internship applications with timelines and status | 🔲 Phase 7 |

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
| Image Storage | Cloudinary (`campusos/events/` for events; `campusos/resources/` for cheat sheets) |
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
| Cache | Redis (optional, for future phases) |
| Image Storage | Cloudinary (events + cheat sheets) |
| Local Dev | docker-compose.yml at project root |

---

## 3. Role System

```
enum Role {
  STUDENT             // Default. Full read access. Private placement data.
  MENTOR              // Can create a mentor profile and accept session requests.
  CLUB_MANAGER        // Future — manages clubs portal.
  PLACEMENT_COORDINATOR  // Replaces EVENT_ORGANIZER. Manages Events Hub + Resources Module.
                         // CONSTRAINT: Only ONE Placement Coordinator may register in the system.
}
```

**PLACEMENT_COORDINATOR rules:**
- Replaces the old `EVENT_ORGANIZER` role (migrated via `npx prisma db push`).
- Only one coordinator allowed — `AuthService.register()` returns HTTP 409 if a second attempts to register.
- Has authority over: **Events Hub** (create/delete events) and **Resources Module** (all CRUD + Cloudinary upload).
- Does **not** have access to other users' private placement data (DSA, personal notes, resume).

---

## 4. Project Directory Structure

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
│   │   ├── schema.prisma       # Prisma DB schema (all models)
│   │   ├── seed.js             # Compiled JS database seeds
│   │   ├── seed.ts             # Source TS database seeds (DSA Categories)
│   │   └── clean-db.js         # Transactional database reset helper script
│   └── src/
│       ├── server.ts           # Entry point — binds Express to PORT
│       ├── app.ts              # Express app config, CORS, routes, health
│       ├── config/
│       │   ├── prisma.ts       # PrismaClient singleton
│       │   └── cloudinary.ts   # Cloudinary SDK singleton (lazy init from env)
│       ├── middleware/
│       │   └── auth.ts         # authenticate() + requireRole() middleware
│       └── modules/
│           ├── auth/
│           │   ├── types.ts        # UserPayload type + Express Request extension
│           │   ├── schema.ts       # Zod schemas (registerSchema, loginSchema)
│           │   ├── repository.ts   # DB queries (findByEmail, tokens, findPlacementCoordinator)
│           │   ├── service.ts      # Business logic (register w/ coordinator guard, login, refresh, logout)
│           │   ├── controller.ts   # Request handlers
│           │   └── routes.ts       # POST /auth/register|login|refresh|logout
│           ├── users/
│           │   ├── repository.ts   # getProfile, updateProfile
│           │   ├── service.ts
│           │   ├── controller.ts
│           │   └── routes.ts       # GET /users/profile, PUT /users/profile
│           ├── dsa/                # ✅ Phase 2 — DSA Tracker Module
│           ├── subject-notes/      # ✅ Phase 2 — Private Core Subject Notes (per user)
│           ├── personal-resume/    # ✅ Phase 2 — Personal Resume Link Manager
│           ├── mentorship/         # ✅ Phase 3 — Mentorship Module
│           ├── events/             # ✅ Phase 4 — Events Hub (PLACEMENT_COORDINATOR guard)
│           ├── resources/          # ✅ Phase 5 — Shared Resources Module
│           │   ├── types.ts        # Input type interfaces
│           │   ├── schema.ts       # Zod validation schemas
│           │   ├── repository.ts   # Prisma CRUD for all 4 resource types
│           │   ├── service.ts      # Business logic
│           │   ├── controller.ts   # HTTP handlers + Cloudinary upload
│           │   └── routes.ts       # REST endpoints with RBAC middleware
│           ├── clubs/              # 🔲 Phase 6 — Clubs Portal
│           └── career/             # 🔲 Phase 7 — Career Tracking
│
└── frontend/
    ├── .env.local              # NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
    ├── package.json
    ├── next.config.ts          # IPv4 proxy rewrite to backend
    ├── tsconfig.json
    └── src/
        ├── lib/
        │   └── api.ts          # apiFetch() with token auto refresh
        ├── providers/
        │   ├── QueryProvider.tsx    # TanStack Query client wrapper
        │   └── AuthProvider.tsx     # Context with cache cleaning + role types
        └── app/
            ├── layout.tsx          # Root layout
            ├── page.tsx            # Landing page
            ├── auth/
            │   ├── login/page.tsx  # Login Form
            │   └── register/page.tsx  # Registration (role: PLACEMENT_COORDINATOR option)
            └── dashboard/
                ├── layout.tsx      # Sidebar layout (7 nav items incl. Resources)
                ├── page.tsx        # Overview Dashboard card
                ├── profile/page.tsx
                ├── placement/
                │   ├── page.tsx    # 3-col: DSA card, Private Subject Notes, Personal Resume
                │   └── dsa/page.tsx  # ✅ Full Width Accordion DSA Tracker (17 topics)
                ├── mentorship/
                │   ├── page.tsx        # ✅ Mentor discovery + request modal
                │   └── requests/page.tsx  # ✅ Bidirectional request dashboard
                ├── events/page.tsx     # ✅ Events Hub (role-gated publish/delete)
                └── resources/page.tsx  # ✅ Shared Resources (role-gated CRUD)
```

---

## 5. Database Schema (Current — Prisma)

Located at `backend/prisma/schema.prisma`

```prisma
enum Role {
  STUDENT
  MENTOR
  CLUB_MANAGER
  PLACEMENT_COORDINATOR   // ← was EVENT_ORGANIZER before Phase 5
}

enum Difficulty {
  EASY
  MEDIUM
  HARD
}

enum RequestStatus {
  PENDING
  ACCEPTED
  REJECTED
  CANCELLED
}

enum EventCategory {
  HACKATHON
  WORKSHOP
  SEMINAR
  CULTURAL
  SPORTS
  OTHER
}

model User {
  id              String               @id @default(uuid())
  email           String               @unique
  passwordHash    String
  role            Role                 @default(STUDENT)
  createdAt       DateTime             @default(now())
  updatedAt       DateTime             @updatedAt
  profile         Profile?
  refreshTokens   RefreshToken[]
  mentorProfile   MentorProfile?
  mentorRequests  MentorshipRequest[]  @relation("MentorRequests")
  studentRequests MentorshipRequest[]  @relation("StudentRequests")
  dsaProgress     UserDsaProblem[]
  dsaProblems     DsaProblem[]
  subjectNotes    SubjectNote[]        // Private — only visible to the owner
  personalResume  PersonalResume?
  events          Event[]
}

// ─── Placement Preparation (private per user) ─────────────────────────────────

model DsaCategory {
  id          String       @id @default(uuid())
  name        String       @unique
  description String?
  problems    DsaProblem[]
  createdAt   DateTime     @default(now())
}

model DsaProblem { ... }
model UserDsaProblem { ... }
model SubjectNote { ... }       // Private per-user notes (Placement Prep section)
model PersonalResume { ... }

// ─── Mentorship ───────────────────────────────────────────────────────────────

model MentorProfile { ... }
model MentorshipRequest { ... }

// ─── Events Hub ───────────────────────────────────────────────────────────────

model Event {
  id          String        @id @default(uuid())
  title       String
  description String
  date        DateTime
  location    String
  category    EventCategory @default(OTHER)
  imageUrl    String?
  registrationLink String?
  createdById String
  createdBy   User          @relation(fields: [createdById], references: [id], onDelete: Cascade)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}

// ─── Shared Resources Module (managed by PLACEMENT_COORDINATOR) ───────────────

model ResourceCoreSubjectNote {
  id           String   @id @default(uuid())
  subjectName  String
  resourceLink String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model ResourcePreviousYearQuestion {
  id                String   @id @default(uuid())
  subjectName       String
  year              Int
  semester          String
  questionPaperLink String
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model ResourceInterviewNote {
  id                 String   @id @default(uuid())
  topicName          String
  interviewNotesLink String
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}

model ResourceCheatSheet {
  id        String   @id @default(uuid())
  name      String
  imageUrl  String   // Cloudinary secure_url (campusos/resources/ folder)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 6. Authentication Flow

```
REGISTER: POST /api/v1/auth/register
  Body: { email, password, firstName, lastName, role }
  → If role == PLACEMENT_COORDINATOR: check findPlacementCoordinator() → reject with 409 if exists
  → Hash password, transaction setup User + Profile
  → AccessToken (JWT, 5h) + RefreshToken (JWT, 7d)
  → Set HttpOnly Cookie, return { accessToken }

LOGIN / LOGOUT / SWAP:
  → Clearing QueryClient cache via queryClient.clear() inside AuthProvider
  → Prevents cache bleed across user sessions.
```

---

## 7. API Endpoints

### Authentication
* `POST /api/v1/auth/register` (Public) — roles: STUDENT | MENTOR | CLUB_MANAGER | PLACEMENT_COORDINATOR
* `POST /api/v1/auth/login` (Public)
* `POST /api/v1/auth/refresh` (Cookie check)
* `POST /api/v1/auth/logout` (Auth checks)

### User Profile
* `GET /api/v1/users/profile` (Authenticated)
* `PUT /api/v1/users/profile` (Authenticated)

### DSA Practice Tracker (Phase 2)
* `GET /api/v1/dsa/dashboard` — user overview metrics
* `GET /api/v1/dsa/categories` — list categories with user counts
* `GET /api/v1/dsa/categories/:id/problems` — get user's problems in category
* `POST /api/v1/dsa/problems` — add a user-owned problem
* `PUT /api/v1/dsa/problems/:id` — modify a user-owned problem (guard active)
* `DELETE /api/v1/dsa/problems/:id` — delete a user-owned problem (guard active)
* `PATCH /api/v1/dsa/problems/:id/status` — toggle completion status

### Core Subject Notes — Private (Phase 2)
* `GET /api/v1/core-subject-notes` — list user's notes
* `POST /api/v1/core-subject-notes` — add a note
* `PUT /api/v1/core-subject-notes/:id` — update a note (ownership guard)
* `DELETE /api/v1/core-subject-notes/:id` — delete a note (ownership guard)

### Personal Resume (Phase 2)
* `GET /api/v1/personal-resume` — get user's saved resume link
* `POST /api/v1/personal-resume` — save resume link (one per user)
* `PUT /api/v1/personal-resume/:id` — update resume link (ownership guard)
* `DELETE /api/v1/personal-resume/:id` — remove resume link (ownership guard)

### Mentorship (Phase 3)
* `GET /api/v1/mentors` — browse directory list
* `GET /api/v1/mentors/profile` — fetch mentor profile
* `POST /api/v1/mentors/profile` — create profile
* `POST /api/v1/mentors/:mentorId/request` — request guidance session
* `GET /api/v1/mentors/requests` — list bidirectional requests
* `PUT /api/v1/mentors/requests/:requestId` — accept/reject/cancel requests

### Events Hub (Phase 4)
* `GET /api/v1/events` — get all events (all authenticated)
* `GET /api/v1/events/upcoming` — get upcoming events (all authenticated)
* `GET /api/v1/events/past` — get past events (all authenticated)
* `GET /api/v1/events/:id` — get single event details (all authenticated)
* `POST /api/v1/events` — publish event (PLACEMENT_COORDINATOR only)
* `DELETE /api/v1/events/:id` — delete event (PLACEMENT_COORDINATOR only)
* `POST /api/v1/events/upload` — upload banner to Cloudinary (PLACEMENT_COORDINATOR only)

### Resources Module (Phase 5)
* `GET /api/v1/resources` — get all resources (all authenticated)
* `POST /api/v1/resources/subject-notes` — add subject note (PLACEMENT_COORDINATOR only)
* `PUT /api/v1/resources/subject-notes/:id` — update subject note (PLACEMENT_COORDINATOR only)
* `DELETE /api/v1/resources/subject-notes/:id` — delete subject note (PLACEMENT_COORDINATOR only)
* `POST /api/v1/resources/previous-year-questions` — add PYQ (PLACEMENT_COORDINATOR only)
* `PUT /api/v1/resources/previous-year-questions/:id` — update PYQ (PLACEMENT_COORDINATOR only)
* `DELETE /api/v1/resources/previous-year-questions/:id` — delete PYQ (PLACEMENT_COORDINATOR only)
* `POST /api/v1/resources/interview-notes` — add interview note (PLACEMENT_COORDINATOR only)
* `PUT /api/v1/resources/interview-notes/:id` — update interview note (PLACEMENT_COORDINATOR only)
* `DELETE /api/v1/resources/interview-notes/:id` — delete interview note (PLACEMENT_COORDINATOR only)
* `POST /api/v1/resources/cheat-sheets` — add cheat sheet (PLACEMENT_COORDINATOR only)
* `POST /api/v1/resources/cheat-sheets/upload` — upload cheat sheet image to Cloudinary (PLACEMENT_COORDINATOR only)
* `PUT /api/v1/resources/cheat-sheets/:id` — update cheat sheet (PLACEMENT_COORDINATOR only)
* `DELETE /api/v1/resources/cheat-sheets/:id` — delete cheat sheet (PLACEMENT_COORDINATOR only)

---

## 8. Remaining Phases

### Phase 6: Clubs Portal
- Model: `Club` (name, description, category, memberCount, imageUrl, managerId)
- Model: `ClubMembership` (userId, clubId, joinedAt)
- Role: `CLUB_MANAGER` creates and manages clubs
- Frontend: Discovery grid, club detail modal, Join/Leave toggle
- Routes under `/api/v1/clubs`

### Phase 7: Career Tracking
- Model: `JobApplication` (company, role, status, appliedDate, notes, userId)
- Enum: `ApplicationStatus` (APPLIED, SCREENING, INTERVIEW, OFFER, REJECTED)
- Frontend: Kanban board or timeline view, status filter, add/edit modals
- Routes under `/api/v1/career`

### Phase 8: Production Engineering
- Add proper Prisma migrations (replace `db push` with `migrate deploy`)
- Rate limiting (express-rate-limit + Redis)
- Error monitoring (Sentry)
- CI/CD pipeline (GitHub Actions)
- Containerization (Dockerfile + docker-compose.prod.yml)
- Environment secrets management

---

## 9. Key Engineering Rules

1. **Module pattern**: `types.ts → schema.ts → repository.ts → service.ts → controller.ts → routes.ts`
2. **All request bodies** validated with Zod schemas before entering service layer
3. **Ownership guards**: Any user-scoped resource must verify `record.userId === req.user.id` in the service layer
4. **Role guards**: Use `requireRole([...])` middleware on all write operations
5. **Express param typing**: `req.params['id'] as string` — required in Express 5 (typed as `string | string[]`)
6. **Route ordering**: Static routes (e.g. `/upload`) must be declared before parameterized routes (e.g. `/:id`) to avoid swallowing
7. **Cloudinary**: Use `multer({ storage: multer.memoryStorage() })` → convert buffer to base64 → upload; never stream disk files
8. **Never commit** `.env` or `.env.local`
9. **Session**: `queryClient.clear()` on every login/logout to prevent cross-user cache bleed
10. **Build check**: `npx tsc --noEmit` on both backend and frontend before every commit
