# CampusOS — Complete Implementation Plan
> **This document is the single source of truth for the CampusOS project.**
> It is written for handoff between AI models, developers, and contributors.
> Read this before touching any code.

---

## 1. Project Overview

**CampusOS** is a unified, full-stack web platform for college students. It consolidates six core campus needs into one authenticated ecosystem:

| # | Module | Summary |
|---|--------|---------|
| 1 | **Placement Preparation** | DSA Practice Tracker with categories, user-owned problems, and accordion checklist views |
| 2 | **Mentorship** | Find, request, and manage mentor-student guidance |
| 3 | **Events Hub** | Browse, register, and track hackathons, contests, seminars |
| 4 | **Clubs Portal** | Discover, join, and manage campus clubs |
| 5 | **Academic Resources** | Share, search, and bookmark lecture notes, Subject PYQs, roadmaps |
| 6 | **Career Tracking** | Log job/internship applications with timelines and status |

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
| Cache | Redis (optional, for future phases) |
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
│   │   ├── schema.prisma       # Prisma DB schema (all models)
│   │   ├── seed.js             # Compiled JS database seeds
│   │   ├── seed.ts             # Source TS database seeds (DSA Categories)
│   │   └── clean-db.js         # Transactional database reset helper script
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
│           │   ├── repository.ts   # DB queries (findByEmail, tokens)
│           │   ├── service.ts      # Business logic (register, login, refresh, logout)
│           │   ├── controller.ts   # Request handlers
│           │   └── routes.ts       # POST /auth/register|login|refresh|logout
│           ├── users/
│           │   ├── repository.ts   # getProfile, updateProfile
│           │   ├── service.ts
│           │   ├── controller.ts
│           │   └── routes.ts       # GET /users/profile, PUT /users/profile
│           ├── dsa/                # DSA Tracker Module
│           │   ├── schema.ts       # Zod verification schemas
│           │   ├── repository.ts   # User-isolated queries
│           │   ├── service.ts      # Stats and problem logic
│           │   ├── controller.ts   # Handlers
│           │   └── routes.ts       # REST routing endpoints
│           ├── mentorship/         # Mentorship Module
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
        │   └── api.ts          # apiFetch() with token auto refresh
        ├── providers/
        │   ├── QueryProvider.tsx    # TanStack Query client wrapper
        │   └── AuthProvider.tsx     # Context with cache cleaning
        └── app/
            ├── layout.tsx          # Root layout
            ├── page.tsx            # Landing page
            ├── auth/
            │   ├── login/page.tsx  # Login Form
            │   └── register/page.tsx
            └── dashboard/
                ├── layout.tsx      # Sidebar layout with sticky position
                ├── page.tsx        # Overview Dashboard card
                ├── profile/page.tsx
                └── placement/
                    ├── page.tsx    # Placement Landing (DSA Overview stats)
                    └── dsa/
                        └── page.tsx # Full Width Accordion DSA Tracker
```

---

## 4. Database Schema (Current — Prisma)

Located at `backend/prisma/schema.prisma`

```prisma
enum Role {
  STUDENT
  MENTOR
  CLUB_MANAGER
  EVENT_ORGANIZER
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
  studentRequests MentorshipRequest[]  @relation("StudentRequests")
  dsaProgress     UserDsaProblem[]
  dsaProblems     DsaProblem[]
}

model DsaCategory {
  id          String       @id @default(uuid())
  name        String       @unique
  description String?
  problems    DsaProblem[]
  createdAt   DateTime     @default(now())
}

model DsaProblem {
  id            String            @id @default(uuid())
  userId        String
  user          User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  categoryId    String
  category      DsaCategory       @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  problemName   String
  problemLink   String
  difficulty    Difficulty        @default(MEDIUM)
  userCompleted UserDsaProblem[]
  createdAt     DateTime          @default(now())
}

model UserDsaProblem {
  id        String     @id @default(uuid())
  userId    String
  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  problemId String
  problem   DsaProblem @relation(fields: [problemId], references: [id], onDelete: Cascade)
  completed Boolean    @default(false)
  updatedAt DateTime   @updatedAt
  createdAt DateTime   @default(now())

  @@unique([userId, problemId])
}
```

---

## 5. Authentication Flow

```
REGISTER: POST /api/v1/auth/register
  Body: { email, password, firstName, lastName, role }
  → Hash password, transaction setup User + Profile
  → AccessToken (JWT, 15m) + RefreshToken (JWT, 7d)
  → Set HttpOnly Cookie, return { accessToken }

LOGIN / LOGOUT / SWAP:
  → Clearing QueryClient cache via queryClient.clear() inside AuthProvider
  → Prevents cache bleed across user sessions.
```

---

## 6. API Endpoints

### Authentication
* `POST /api/v1/auth/register` (Public)
* `POST /api/v1/auth/login` (Public)
* `POST /api/v1/auth/refresh` (Cookie check)
* `POST /api/v1/auth/logout` (Auth checks)

### DSA Practice Tracker (Phase 2)
* `GET /api/v1/dsa/dashboard` — user overview metrics
* `GET /api/v1/dsa/categories` — list categories with user counts
* `GET /api/v1/dsa/categories/:id/problems` — get user's problems in category
* `POST /api/v1/dsa/problems` — add a user-owned problem
* `PUT /api/v1/dsa/problems/:id` — modify a user-owned problem (guard active)
* `DELETE /api/v1/dsa/problems/:id` — delete a user-owned problem (guard active)
* `PATCH /api/v1/dsa/problems/:id/status` — toggle completion status (guard active)

### Mentorship (Phase 3)
* `GET /api/v1/mentors` — browse directory list
* `GET /api/v1/mentors/profile` — fetch mentor profile
* `POST /api/v1/mentors/profile` — create profile
* `POST /api/v1/mentors/:mentorId/request` — request guidance session
* `GET /api/v1/mentors/requests` — list bidirectional requests
* `PUT /api/v1/mentors/requests/:requestId` — accept/reject/cancel requests
