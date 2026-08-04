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

## 🔲 NEXT STEP: Phase 2 — Placement Preparation

### What To Build

**Goal**: Allow students to track their DSA and CS exam preparation by category (e.g., Arrays, Trees, DBMS, OS) and topic.

---

### Step 1 — Extend Prisma Schema

Add these 3 models to `backend/prisma/schema.prisma`:

```prisma
enum Difficulty {
  EASY
  MEDIUM
  HARD
}

enum TopicStatus {
  NOT_STARTED
  IN_PROGRESS
  COMPLETED
}

model PreparationCategory {
  id          String               @id @default(uuid())
  name        String
  description String?
  icon        String?
  color       String?
  topics      PreparationTopic[]
  createdAt   DateTime             @default(now())
}

model PreparationTopic {
  id           String                   @id @default(uuid())
  title        String
  categoryId   String
  category     PreparationCategory      @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  difficulty   Difficulty               @default(MEDIUM)
  resourceUrl  String?
  progress     PreparationProgress[]
  createdAt    DateTime                 @default(now())
}

model PreparationProgress {
  id        String      @id @default(uuid())
  userId    String
  user      User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  topicId   String
  topic     PreparationTopic @relation(fields: [topicId], references: [id], onDelete: Cascade)
  status    TopicStatus @default(NOT_STARTED)
  notes     String?
  updatedAt DateTime    @updatedAt
  createdAt DateTime    @default(now())

  @@unique([userId, topicId])
}
```

Also add `@@relation` back-reference on `User`:
```prisma
preparationProgress PreparationProgress[]
```

Then run: `cd backend && npx prisma migrate dev --name add-placement-module`

---

### Step 2 — Create Backend Placement Module

Create these files inside `backend/src/modules/placement/`:

**`types.ts`**
```ts
export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';
export type StatusType = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
```

**`repository.ts`**
- `getAllCategories()` — Prisma query for all categories with topic count
- `getTopicsByCategory(categoryId: string)` — topics list for a category
- `getUserProgress(userId: string)` — all progress records for a user
- `upsertProgress(userId, topicId, status, notes?)` — create or update progress (Prisma upsert)

**`service.ts`**
- Wraps repository methods
- `getCategoryOverview(userId)` — returns categories with per-topic completion stats

**`controller.ts`**
- `getCategories(req, res)` — GET /placement/categories
- `getTopics(req, res)` — GET /placement/categories/:categoryId/topics
- `getMyProgress(req, res)` — GET /placement/progress
- `updateProgress(req, res)` — PUT /placement/progress/:topicId

**`schema.ts`** — Zod schema for PUT progress body
**`routes.ts`** — Mount all 4 routes with `authenticate` middleware

Register module in `src/app.ts`:
```ts
import placementRoutes from './modules/placement/routes';
app.use('/api/v1/placement', placementRoutes);
```

---

### Step 3 — Seed Initial Categories + Topics

Create `backend/prisma/seed.ts`:
```ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Arrays & Strings', icon: '📦', color: '#6366f1' },
    { name: 'Linked Lists', icon: '🔗', color: '#8b5cf6' },
    { name: 'Trees & Graphs', icon: '🌲', color: '#10b981' },
    { name: 'Dynamic Programming', icon: '🧩', color: '#f59e0b' },
    { name: 'Operating Systems', icon: '🖥️', color: '#3b82f6' },
    { name: 'DBMS', icon: '🗃️', color: '#ef4444' },
    { name: 'Computer Networks', icon: '🌐', color: '#06b6d4' },
    { name: 'System Design', icon: '🏗️', color: '#ec4899' },
  ];

  for (const cat of categories) {
    await prisma.preparationCategory.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }
  console.log('Seeded categories');
}

main().catch(console.error).finally(() => prisma.$disconnect());
```

Add to `package.json`:
```json
"prisma": { "seed": "ts-node prisma/seed.ts" }
```
Run: `npx prisma db seed`

---

### Step 4 — Frontend Placement Pages

Create `frontend/src/app/dashboard/placement/`:

**`page.tsx`** — Category overview grid
- Fetches `GET /api/v1/placement/categories`
- Shows cards per category with animated circular progress ring
- Each card links to `/dashboard/placement/[categoryId]`

**`[categoryId]/page.tsx`** — Topic detail view
- Fetches topics for the category
- Lists topics with Difficulty badge (Easy/Medium/Hard)
- Each topic has a three-state toggle: NOT_STARTED → IN_PROGRESS → COMPLETED
- PUT to `/api/v1/placement/progress/:topicId` on toggle click
- Shows notes textarea on expand (optional)

---

### Files To Create for Phase 2 (Summary)

```
backend/prisma/seed.ts                           [NEW]
backend/src/modules/placement/types.ts           [NEW]
backend/src/modules/placement/schema.ts          [NEW]
backend/src/modules/placement/repository.ts      [NEW]
backend/src/modules/placement/service.ts         [NEW]
backend/src/modules/placement/controller.ts      [NEW]
backend/src/modules/placement/routes.ts          [NEW]
backend/prisma/schema.prisma                     [MODIFY — add 3 models + enums]
backend/src/app.ts                               [MODIFY — register placement route]

frontend/src/app/dashboard/placement/page.tsx                [NEW]
frontend/src/app/dashboard/placement/[categoryId]/page.tsx   [NEW]
```

### Commands To Run at Start of Phase 2
```bash
# 1. Add models to schema.prisma
# 2. Run migration
cd backend && npx prisma migrate dev --name add-placement-module

# 3. Generate fresh client
npx prisma generate

# 4. Seed categories
npx prisma db seed

# 5. Start dev servers
npm run dev           # in backend/
npm run dev           # in frontend/ (separate terminal)
```

---

## 🔲 Phase 3: Mentorship — PENDING
See `IMPLEMENTATION_PLAN.md` Section 7 for full spec.

## 🔲 Phase 4: Events — PENDING
See `IMPLEMENTATION_PLAN.md` Section 7 for full spec.

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
