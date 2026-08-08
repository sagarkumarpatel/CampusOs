# CampusOS — Progress Tracker
> **For AI handoff use.** This document tracks exactly what has been built, what files exist,
> what the current state is, and precisely what needs to be done next.
> Update this file at the end of every phase.

---

## ✅ PHASE 1: Foundation — COMPLETE

### What Was Built

#### Backend — `backend/`
| File | Status | Description |
|------|--------|-------------|
| `package.json` | ✅ Done | Scripts: dev, build, prisma:generate, prisma:migrate |
| `tsconfig.json` | ✅ Done | ES2022, CommonJS, strict mode |
| `.env` | ✅ Done | PORT, DATABASE_URL, JWT keys, CORS_ORIGIN |
| `prisma/schema.prisma` | ✅ Done | User, Profile, RefreshToken models; Role enum |
| `src/server.ts` | ✅ Done | Entry point, loads dotenv, starts Express on PORT |
| `src/app.ts` | ✅ Done | CORS, JSON body parser, cookie-parser, routes, /health endpoint |
| `src/config/prisma.ts` | ✅ Done | PrismaClient singleton export |
| `src/middleware/auth.ts` | ✅ Done | `authenticate()` JWT middleware + `requireRole()` RBAC guard |
| `src/modules/auth/types.ts` | ✅ Done | UserPayload type, Express.Request extension |
| `src/modules/auth/schema.ts` | ✅ Done | `registerSchema` and `loginSchema` Zod validators |
| `src/modules/auth/repository.ts` | ✅ Done | findByEmail, findById, createUser (Prisma transaction), refresh token CRUD |
| `src/modules/auth/service.ts` | ✅ Done | register, login, refresh (with token rotation), logout |
| `src/modules/auth/controller.ts` | ✅ Done | register, login, refresh, logout with HTTP-only cookie handling |
| `src/modules/auth/routes.ts` | ✅ Done | POST /auth/register, /login, /refresh, /logout |
| `src/modules/users/repository.ts` | ✅ Done | getProfile, updateProfile |
| `src/modules/users/service.ts` | ✅ Done | getProfile, updateProfile |
| `src/modules/users/controller.ts` | ✅ Done | GET + PUT /users/profile with Zod validation |
| `src/modules/users/routes.ts` | ✅ Done | GET /users/profile, PUT /users/profile (authenticated) |

#### Frontend — `frontend/`
| File | Status | Description |
|------|--------|-------------|
| Next.js scaffold | ✅ Done | App Router, TypeScript, Tailwind CSS, ESLint |
| `src/lib/api.ts` | ✅ Done | `apiFetch()` with auto 401 → refresh retry + auth-logout event |
| `src/providers/QueryProvider.tsx` | ✅ Done | TanStack React Query client provider wrapper |
| `src/providers/AuthProvider.tsx` | ✅ Done | AuthContext: user, login, logout, register, refreshSession, updateProfileState |
| `src/app/layout.tsx` | ✅ Done | Root layout wrapping QueryProvider + AuthProvider, updated metadata |
| `src/app/page.tsx` | ✅ Done | Landing page with hero, 6 module cards, glassmorphism dark design |
| `src/app/auth/login/page.tsx` | ✅ Done | Login form with Zod + react-hook-form validation |
| `src/app/auth/register/page.tsx` | ✅ Done | Registration form with role select |
| `src/app/dashboard/layout.tsx` | ✅ Done | Sidebar layout with nav links to all 6 modules |
| `src/app/dashboard/page.tsx` | ✅ Done | Dashboard overview with 6 module summary cards |
| `src/app/dashboard/profile/page.tsx` | ✅ Done | Edit profile: name, bio, college, graduation year, skills (comma-separated) |

#### Infrastructure
| File | Status | Description |
|------|--------|-------------|
| `docker-compose.yml` | ✅ Done | PostgreSQL 15 + Redis 7 containers with named volumes |
| `IMPLEMENTATION_PLAN.md` | ✅ Done | Full AI-handoff spec (tech stack, schema, auth flow, phase roadmap) |
| `PROGRESS.md` | ✅ Done | This file |

#### TypeScript Verification
- ✅ `cd backend && npm run build` — compiles cleanly with zero errors
- ✅ `cd frontend && npx tsc --noEmit` — passes with zero errors

---

## ✅ PHASE 2: Placement Preparation — COMPLETE

> Includes: DSA Practice Tracker (17 topics), Core Subject Notes, and Personal Resume Link Manager.

### What Was Built

#### Backend — `backend/`
| File | Status | Description |
|------|--------|-------------|
| `prisma/schema.prisma` | ✅ Done | Added `Difficulty` enum, `DsaCategory`, `DsaProblem`, `UserDsaProblem`, `SubjectNote`, and `PersonalResume` models. All legacy non-isolated placement tables were completely removed. |
| `prisma/seed.ts` & `seed.js` | ✅ Done | Updated to seed **17 DSA Categories**: Arrays, Binary Search, Linked Lists, Trees, Graphs, Dynamic Programming, Stacks & Queues, Hashing, Sorting & Searching, Bit Manipulation, Recursion & Backtracking, Tries, Segment Tree, Greedy, Two Pointers, Sliding Window, Monotonic Stack. |
| `prisma/clean-db.js` | ✅ Done | Database reset utility script that empties transactional tables and re-seeds all 17 DSA categories. |
| `package.json` | ✅ Done | Configured `db:clean` script shortcut. |
| `src/app.ts` | ✅ Done | Registered `/api/v1/dsa`, `/api/v1/core-subject-notes`, and `/api/v1/personal-resume` routes. |
| `src/modules/dsa/*` | ✅ Done | Types, Zod schemas, Repository, Service, Controller, Routes for the fully user-isolated DSA Practice Tracker. Includes backend ownership validation guards. |
| `src/modules/placement/*` | ✅ Done | Stubbed out legacy routes with clean shell stubs to maintain compilation safety. |
| `src/modules/subject-notes/*` | ✅ Done | Types, Zod schema, Repository, Service, Controller, Routes for Core Subject Notes. Ownership verified per request. |
| `src/modules/personal-resume/*` | ✅ Done | Zod schema, Repository, Service, Controller, Routes for Personal Resume Link Manager. One resume per user; ownership guard on PUT and DELETE. |

#### Frontend — `frontend/`
| File | Status | Description |
|------|--------|-------------|
| `src/app/dashboard/placement/page.tsx` | ✅ Done | Redesigned placement prep dashboard with a **3-column layout**: DSA Practice Tracker card overview (col 1), Core Subject Notes manager (col 2), and Personal Resume Link Manager (col 3). |
| `src/app/dashboard/placement/dsa/page.tsx` | ✅ Done | Redesigned full-width accordion DSA tracker. Topics expand inline to fetch and display their corresponding problem lists. All 17 topic cards default to collapsed on load. |
| `src/app/dashboard/layout.tsx` | ✅ Done | Locked the navigation sidebar to viewport height and anchored bottom actions (settings, sign-out) with independent scroll panels. |
| `src/providers/AuthProvider.tsx` | ✅ Done | Added `queryClient.clear()` during login, registration, and logout events to prevent cross-session cache bleed. |

#### Bug Fixes & Session Persistence Improvements
- **Session Persistence**: Added `credentials: 'include'` to all `fetch()` calls in `api.ts`. Changed `JWT_ACCESS_EXPIRATION` to `5h` in backend.
- **Strict Mode Mount Fix**: Added a promise caching mechanism in `AuthProvider.tsx` to handle React Strict Mode duplicate refresh requests.
- **Next.js IPv4 Proxy Rewrite**: Configured explicit IPv4 `127.0.0.1:5000` rewrite proxy in `next.config.ts` to solve connection refusal errors.

#### TypeScript Verification
- ✅ `cd backend && npm run build` — compiles cleanly with zero errors
- ✅ `cd frontend && npx tsc --noEmit` — passes with zero errors

---

## ✅ PHASE 3: Mentorship — COMPLETE

### What Was Built

#### Backend — `backend/`
| File | Status | Description |
|------|--------|-------------|
| `prisma/schema.prisma` | ✅ Done | Added `RequestStatus` enum, `MentorProfile`, and `MentorshipRequest` models; linked back-relations to the `User` model. |
| `src/app.ts` | ✅ Done | Registered `/api/v1/mentors` routing endpoints. |
| `src/modules/mentorship/types.ts` | ✅ Done | Declared `RequestStatus` type contracts. |
| `src/modules/mentorship/schema.ts` | ✅ Done | Zod schemas for `createMentorProfileSchema`, `requestMentorshipSchema`, and `updateRequestStatusSchema`. |
| `src/modules/mentorship/repository.ts` | ✅ Done | Database queries for fetching all mentors (no availability filter), single profiles, pending duplicate checks, request creation, status transitions, and student/mentor request list views. |
| `src/modules/mentorship/service.ts` | ✅ Done | Self-mentorship prevention, duplicate-pending check; formats mentor and request listings for API response. |
| `src/modules/mentorship/controller.ts` | ✅ Done | Handlers for profile setup, request session, accept/reject/cancel, and request listings. Fixed HTTP `201` status on request creation. |
| `src/modules/mentorship/routes.ts` | ✅ Done | `GET /mentors`, `GET /mentors/profile`, `POST /mentors/profile`, `POST /mentors/:id/request`, `GET /mentors/requests`, `PUT /mentors/requests/:id` (all authenticated). |

#### Frontend — `frontend/`
| File | Status | Description |
|------|--------|-------------|
| `src/app/dashboard/mentorship/page.tsx` | ✅ Done | Full mentor discovery directory with: skill-aware search (matches name/company/title/skills), dropdown skill filter, **YOU** badge on own card, disabled own-card request button, **"My Requests →"** nav button, and redesigned request modal with 3-step how-it-works guide, live character counter, and 20-char minimum enforcement. |
| `src/app/dashboard/mentorship/requests/page.tsx` | ✅ Done | Bidirectional request dashboard rewritten with clear status banners: ACCEPTED shows a prominent "Connect on LinkedIn" button + optional Calendly booking link; REJECTED shows closure message with redirect to browse more mentors; PENDING shows cancel option. |

#### Bug Fixes & Improvements (Phase 3 post-implementation)
| Fix | File | Description |
|-----|------|-------------|
| Mentor visibility | `repository.ts` | Removed `where: { isAvailable: true }` — all registered mentors now show regardless of availability flag |
| Own profile hidden | `service.ts` | Removed `.filter(m => m.userId !== userId)` — users can now see their own mentor card in the directory |
| Search didn't match skills | `page.tsx` | Added `m.skills.some(s => s.toLowerCase().includes(q))` to the filter — typing a skill in the search bar now filters mentors |
| Wrong HTTP status | `controller.ts` | Fixed `res.status(211)` → `res.status(201)` on mentorship request creation |
| No self-indicator on card | `page.tsx` | Added **YOU** pill badge and replaced "Request Session" with "Your Profile" on own cards |

#### TypeScript Verification
- ✅ `cd backend && npm run build` — compiles cleanly with zero errors
- ✅ `cd frontend && npx tsc --noEmit` — passes with zero errors

---

## 🔲 NEXT STEP: Phase 4 — Events Hub

### What To Build

**Goal**: Allow students to browse and register for campus events like hackathons, coding contests, seminars, and workshops.

---

### Step 1 — Extend Database Schema

Add these models and enums to `backend/prisma/schema.prisma`:

```prisma
enum EventType {
  HACKATHON
  CONTEST
  SEMINAR
  WORKSHOP
}

model Event {
  id                   String              @id @default(uuid())
  title                String
  description          String
  type                 EventType           @default(HACKATHON)
  startDate            DateTime
  endDate              DateTime
  venue                String?
  registrationDeadline DateTime
  maxAttendees         Int?
  organizerId          String
  organizer            User                @relation("OrganizedEvents", fields: [organizerId], references: [id], onDelete: Cascade)
  coverImageUrl        String?
  registrations        EventRegistration[]
  createdAt            DateTime            @default(now())
  updatedAt            DateTime            @updatedAt
}

model EventRegistration {
  id           String   @id @default(uuid())
  userId       String
  user         User     @relation("UserRegistrations", fields: [userId], references: [id], onDelete: Cascade)
  eventId      String
  event        Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  registeredAt DateTime @default(now())

  @@unique([userId, eventId])
}
```

Also, update the `User` model to include back-relations:
```prisma
organizedEvents   Event[]             @relation("OrganizedEvents")
eventRegistrations EventRegistration[] @relation("UserRegistrations")
```

Then run: `cd backend && npx prisma migrate dev --name add-events-module`

---

### Step 2 — Create Backend Events Module

Create the directory `backend/src/modules/events/` and define:

**`schema.ts`**
- Zod schema for creating an event (validates title, type, dates, registrationDeadline, etc.)

**`repository.ts`**
- `getEvents()`: list all future events (with registration counts)
- `createEvent(organizerId, data)`: insert event
- `registerForEvent(userId, eventId)`: insert registration
- `cancelRegistration(userId, eventId)`: delete registration
- `getRegistrationsByUser(userId)`: list events registered by a user

**`service.ts`**
- Enforce business rules (preventing registration after deadline, checking max attendee limits)

- Handlers for fetching events, creating events (requires role EVENT_ORGANIZER), registering, and cancelling.

**`routes.ts`**
- Mount routes with `authenticate` and conditional `requireRole('EVENT_ORGANIZER')` middleware.

Register routes in `app.ts`.

---

### Step 3 — Frontend Events Hub Pages

Create `frontend/src/app/dashboard/events/`:

**`page.tsx`** — Event feed
- Browse available events, filter by `EventType`, and show register/cancel action buttons.
- Display cards with start dates, types, registrations counts, and deadline warnings.
- For `EVENT_ORGANIZER` users, show a floating "Create Event" action button opening a form modal.

**`[eventId]/page.tsx`** — Event details page
- Deep-dive view of description, exact schedule dates, venue location, organizer contact, and custom confirmation notices.

---

### Files To Create for Phase 4 (Summary)

```
backend/src/modules/events/schema.ts              [NEW]
backend/src/modules/events/repository.ts          [NEW]
backend/src/modules/events/service.ts             [NEW]
backend/src/modules/events/controller.ts          [NEW]
backend/src/modules/events/routes.ts              [NEW]
backend/prisma/schema.prisma                     [MODIFY — add models + enums]
backend/src/app.ts                               [MODIFY — register events routes]

frontend/src/app/dashboard/events/page.tsx                   [NEW]
frontend/src/app/dashboard/events/[eventId]/page.tsx         [NEW]
```

---

## 🔲 Phase 5: Clubs — PENDING
See `IMPLEMENTATION_PLAN.md` Section 7 for full spec.

## 🔲 Phase 6: Academic Resources — PENDING
See `IMPLEMENTATION_PLAN.md` Section 7 for full spec.

## 🔲 Phase 7: Career Tracking — PENDING
See `IMPLEMENTATION_PLAN.md` Section 7 for full spec.

## 🔲 Phase 8: Production Engineering — PENDING
See `IMPLEMENTATION_PLAN.md` Section 7 for full spec.

---

## Known Issues / Gotchas

| Issue | Status | Notes |
|-------|--------|-------|
| Docker Desktop required for Postgres | ⚠️ Open | If Docker not available, use `railway.app` or `supabase.com` for hosted PostgreSQL. Update `DATABASE_URL` in `.env` accordingly |
| Redis container in docker-compose.yml is defined but not yet used in code | ℹ️ Info | Will be used in Phase 3+ for session caching or rate limiting |
| `frontend/.env.local` not yet created | ⚠️ Open | Must create this file with `NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1` before running frontend |
| Prisma migration not yet run | ⚠️ Open | `npx prisma migrate dev --name init` must be run after Postgres is running |
