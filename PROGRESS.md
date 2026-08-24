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

## ✅ PHASE 4: Events Hub — COMPLETE

### What Was Built

#### Backend — `backend/`
| File | Status | Description |
|------|--------|-------------|
| `prisma/schema.prisma` | ✅ Done | Added `EventCategory` enum and `Event` model; linked relations to User model. |
| `src/config/cloudinary.ts` | ✅ Done | Cloudinary SDK initialized using `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` env vars. Images stored under `campusos/events/` folder. |
| `backend/.env` | ✅ Done | Cloudinary credentials added by user and confirmed valid. |
| `backend/.env.example` | ✅ Done | Template updated with Cloudinary placeholder variables and dashboard URL reference. |
| `src/app.ts` | ✅ Done | Registered `/api/v1/events` endpoint routing. |
| `src/modules/events/*` | ✅ Done | Types, Zod schemas, Repository, Service, Controller, Routes for the Events Hub module. Role-guarded write/delete APIs. Handles image upload buffers to Cloudinary. **Updated in Phase 5 to use `PLACEMENT_COORDINATOR` role.** |

#### Frontend — `frontend/`
| File | Status | Description |
|------|--------|-------------|
| `src/app/dashboard/events/page.tsx` | ✅ Done | Responsive Events Hub view. Tab selectors for Upcoming vs Past Announcements. Search filtering. Category filter buttons. View Details modal overlay. Role check updated to `PLACEMENT_COORDINATOR` in Phase 5. |

#### Cloudinary Verification
- ✅ Credentials configured in `backend/.env`
- ✅ API ping returned `status: ok` — integration confirmed working

#### TypeScript Verification
- ✅ `cd backend && npm run build` — compiles cleanly with zero errors
- ✅ `cd frontend && npx tsc --noEmit` — passes with zero errors

---

## ✅ PHASE 5: Resources Module — COMPLETE

> Role change included: `EVENT_ORGANIZER` replaced by `PLACEMENT_COORDINATOR` system-wide.
> The Placement Coordinator is the sole authority over the Resources Module (and Events Hub).
> Only **one** Placement Coordinator can exist in the system (enforced at registration).

### What Was Built

#### Role System Changes
| File | Change |
|------|--------|
| `prisma/schema.prisma` | `Role` enum: `EVENT_ORGANIZER` → `PLACEMENT_COORDINATOR` |
| `src/modules/auth/schema.ts` | Zod `registerSchema` role enum updated |
| `src/modules/auth/types.ts` | `UserPayload.role` union type updated |
| `src/modules/auth/repository.ts` | Added `findPlacementCoordinator()` method |
| `src/modules/auth/service.ts` | `register()` now rejects a second `PLACEMENT_COORDINATOR` (HTTP 409) |
| `src/modules/events/routes.ts` | `requireRole` updated from `EVENT_ORGANIZER` → `PLACEMENT_COORDINATOR` |
| `src/modules/events/service.ts` | Delete guard updated to `PLACEMENT_COORDINATOR` |
| `frontend/src/providers/AuthProvider.tsx` | `User.role` type updated to include `PLACEMENT_COORDINATOR` |
| `frontend/src/app/auth/register/page.tsx` | Role select option updated to "Placement Coordinator" |
| `frontend/src/app/dashboard/events/page.tsx` | `isEventManager` role check updated to `PLACEMENT_COORDINATOR` |

#### New Database Models (via `npx prisma db push`)
| Model | Fields |
|-------|--------|
| `ResourceCoreSubjectNote` | `id`, `subjectName`, `resourceLink`, `createdAt`, `updatedAt` |
| `ResourcePreviousYearQuestion` | `id`, `subjectName`, `year`, `semester`, `questionPaperLink`, `createdAt`, `updatedAt` |
| `ResourceInterviewNote` | `id`, `topicName`, `interviewNotesLink`, `createdAt`, `updatedAt` |
| `ResourceCheatSheet` | `id`, `name`, `imageUrl` (Cloudinary `secure_url`), `createdAt`, `updatedAt` |

#### Backend — `backend/src/modules/resources/`
| File | Status | Description |
|------|--------|-------------|
| `types.ts` | ✅ Done | Input type interfaces for all four resource types |
| `schema.ts` | ✅ Done | Zod validation schemas for create and update operations |
| `repository.ts` | ✅ Done | Prisma CRUD operations (findMany, create, update, delete) for all four resource types |
| `service.ts` | ✅ Done | Business logic, validation via Zod, delegates to repository |
| `controller.ts` | ✅ Done | HTTP handlers with `req.params['id'] as string` cast; Cloudinary image upload via buffer → base64 |
| `routes.ts` | ✅ Done | `GET /` (all auth), write routes (`POST`, `PUT`, `DELETE`) restricted to `PLACEMENT_COORDINATOR`; `/cheat-sheets/upload` declared before `/:id` to avoid param shadowing |

Registered in `src/app.ts` under `/api/v1/resources`.

#### API Endpoints Added
| Method | Path | Access |
|--------|------|--------|
| `GET` | `/api/v1/resources` | All authenticated users |
| `POST` | `/api/v1/resources/subject-notes` | `PLACEMENT_COORDINATOR` only |
| `PUT` | `/api/v1/resources/subject-notes/:id` | `PLACEMENT_COORDINATOR` only |
| `DELETE` | `/api/v1/resources/subject-notes/:id` | `PLACEMENT_COORDINATOR` only |
| `POST` | `/api/v1/resources/previous-year-questions` | `PLACEMENT_COORDINATOR` only |
| `PUT` | `/api/v1/resources/previous-year-questions/:id` | `PLACEMENT_COORDINATOR` only |
| `DELETE` | `/api/v1/resources/previous-year-questions/:id` | `PLACEMENT_COORDINATOR` only |
| `POST` | `/api/v1/resources/interview-notes` | `PLACEMENT_COORDINATOR` only |
| `PUT` | `/api/v1/resources/interview-notes/:id` | `PLACEMENT_COORDINATOR` only |
| `DELETE` | `/api/v1/resources/interview-notes/:id` | `PLACEMENT_COORDINATOR` only |
| `POST` | `/api/v1/resources/cheat-sheets` | `PLACEMENT_COORDINATOR` only |
| `POST` | `/api/v1/resources/cheat-sheets/upload` | `PLACEMENT_COORDINATOR` only (Cloudinary) |
| `PUT` | `/api/v1/resources/cheat-sheets/:id` | `PLACEMENT_COORDINATOR` only |
| `DELETE` | `/api/v1/resources/cheat-sheets/:id` | `PLACEMENT_COORDINATOR` only |

#### Frontend — `frontend/`
| File | Status | Description |
|------|--------|-------------|
| `src/app/dashboard/resources/page.tsx` | ✅ Done | Four-section Resources dashboard: Core Subject Notes, Previous Year Questions, Interview Notes, Cheat Sheets. Role-aware: Add/Edit/Delete visible only to `PLACEMENT_COORDINATOR`; all other users see read-only cards. Responsive grid (1→2→3 columns). Single reusable Add/Edit modal per section. Delete confirmation dialog. Cheat Sheet image upload → Cloudinary → preview. All data via TanStack Query with cache invalidation. |

#### TypeScript Verification
- ✅ `npx tsc --noEmit` (backend) — zero errors after `req.params['id'] as string` cast applied
- ✅ Backend health check: `{ status: "healthy", database: "connected" }`

---

## 🔲 NEXT STEP: Phase 6 — Clubs Portal
See `IMPLEMENTATION_PLAN.md` for full spec.

## 🔲 Phase 7: Career Tracking — PENDING
See `IMPLEMENTATION_PLAN.md` for full spec.

## 🔲 Phase 8: Production Engineering — PENDING
See `IMPLEMENTATION_PLAN.md` for full spec.

---

## Known Issues / Gotchas

| Issue | Status | Notes |
|-------|--------|-------|
| Docker Desktop required for Postgres | ⚠️ Open | If Docker not available, use `railway.app` or `supabase.com` for hosted PostgreSQL. Update `DATABASE_URL` in `.env` accordingly |
| Redis container in docker-compose.yml is defined but not yet used in code | ℹ️ Info | Will be used in a future phase for session caching or rate limiting |
| `frontend/.env.local` not yet created | ⚠️ Open | Must create this file with `NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1` before running frontend |
| Prisma migration not yet run | ⚠️ Open | `npx prisma migrate dev --name init` must be run after Postgres is running |
| Only one `PLACEMENT_COORDINATOR` allowed | ℹ️ Info | Enforced in `AuthService.register`. Second registration attempt returns HTTP 409 Conflict. |
| Express `req.params` typing | ℹ️ Info | In Express v5, `req.params[key]` is `string \| string[]`. Must cast with `as string` before passing to service methods expecting `string`. |
