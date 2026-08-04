# CampusOS

<div align="center">

![CampusOS Banner](https://via.placeholder.com/900x200/1e1b4b/a5b4fc?text=CampusOS+%E2%80%94+Unified+Student+Growth+Platform)

**Unified campus growth platform for students.**  
Placement prep · Mentor matching · Event hubs · Clubs · Academic resources · Career tracking

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](#)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](#)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](#)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748.svg)](#)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791.svg)](#)

</div>

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Getting Started](#getting-started)
6. [API Reference](#api-reference)
7. [Development Phases](#development-phases)
8. [Contributing](#contributing)

---

## Overview

**CampusOS** is a full-stack web application that connects the six most critical needs of a college student preparing for careers and campus life — all under one authenticated roof.

Instead of juggling separate tools for tracking interview prep, finding mentors, registering for hackathons, and logging job applications, CampusOS gives students a single, beautifully unified dashboard.

---

## Features

| Module | Description | Status |
|--------|-------------|--------|
| 🔐 **Authentication** | Register, login, refresh tokens (JWT + HTTP-only cookies) | ✅ Live |
| 👤 **User Profiles** | Personal info, skills, college, graduation year, resume | ✅ Live |
| 📚 **Placement Preparation** | Topic-wise DSA + CS progress tracker by categories | 🔲 Phase 2 |
| 👥 **Mentorship** | Find mentors, send requests, manage sessions | 🔲 Phase 3 |
| 📅 **Events Hub** | Browse/register for hackathons, contests, seminars | 🔲 Phase 4 |
| 🏛️ **Clubs Portal** | Discover and join campus clubs | 🔲 Phase 5 |
| 📄 **Academic Resources** | Lecture notes, PYQs, roadmaps, cheat sheets | 🔲 Phase 6 |
| 💼 **Career Tracking** | Log job/internship applications with status timelines | 🔲 Phase 7 |

---

## Tech Stack

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js 5
- **Language**: TypeScript (strict mode)
- **ORM**: Prisma 6 with PostgreSQL
- **Auth**: JWT (access token 15m + refresh token 7d via HTTP-only cookie)
- **Validation**: Zod
- **Password Hashing**: bcryptjs

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **State / Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

### Infrastructure
- **Database**: PostgreSQL 15 (via Docker locally)
- **Cache**: Redis 7 (via Docker, used in future phases)
- **Local Dev**: `docker-compose.yml`

---

## Project Structure

```
CampusOsProject/
├── docker-compose.yml          # Local Postgres + Redis
├── IMPLEMENTATION_PLAN.md      # Full technical specification + phase specs (for AI handoff)
├── PROGRESS.md                 # What's done, what's next (for AI handoff)
├── README.md                   # This file
│
├── backend/
│   ├── .env                    # Environment variables
│   ├── prisma/schema.prisma    # Database schema
│   └── src/
│       ├── app.ts              # Express app setup
│       ├── server.ts           # HTTP server entrypoint
│       ├── config/prisma.ts    # Prisma client
│       ├── middleware/auth.ts  # JWT + RBAC middleware
│       └── modules/
│           ├── auth/           # Registration, login, token refresh
│           ├── users/          # Profile management
│           ├── placement/      # [Phase 2]
│           ├── mentorship/     # [Phase 3]
│           ├── events/         # [Phase 4]
│           ├── clubs/          # [Phase 5]
│           ├── resources/      # [Phase 6]
│           └── career/         # [Phase 7]
│
└── frontend/
    └── src/
        ├── lib/api.ts          # API client with auto token refresh
        ├── providers/          # QueryProvider, AuthProvider
        └── app/
            ├── page.tsx                    # / Landing page
            ├── auth/login/                 # Login
            ├── auth/register/              # Registration
            └── dashboard/
                ├── layout.tsx              # Sidebar layout
                ├── page.tsx                # Dashboard overview
                ├── profile/               # Profile edit
                ├── placement/             # [Phase 2]
                ├── mentorship/            # [Phase 3]
                ├── events/                # [Phase 4]
                ├── clubs/                 # [Phase 5]
                ├── resources/             # [Phase 6]
                └── career/                # [Phase 7]
```

---

## Getting Started

### Prerequisites

- **Node.js** 20+
- **npm** 10+
- **Docker Desktop** (for local Postgres/Redis)

### 1. Clone the repository

```bash
git clone <repo-url>
cd CampusOsProject
```

### 2. Start local database

```bash
docker compose up -d postgres
```

> If Docker is not available, create a free database at [railway.app](https://railway.app) or [supabase.com](https://supabase.com) and paste the connection string in `.env`.

### 3. Configure backend environment

Create/edit `backend/.env`:

```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/campusos?schema=public"
JWT_SECRET="your-strong-random-access-secret"
JWT_REFRESH_SECRET="your-strong-random-refresh-secret"
JWT_ACCESS_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"
CORS_ORIGIN="http://localhost:3000"
NODE_ENV="development"
```

### 4. Run database migrations

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Start the backend server

```bash
cd backend
npm run dev
# → Running at http://localhost:5000
```

### 6. Configure frontend environment

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### 7. Start the frontend dev server

```bash
cd frontend
npm run dev
# → Running at http://localhost:3000
```

### 8. Open in browser

Navigate to **http://localhost:3000** to see the landing page.

---

## API Reference

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/v1/auth/register` | ❌ | Create account |
| `POST` | `/api/v1/auth/login` | ❌ | Login |
| `POST` | `/api/v1/auth/refresh` | ❌ (cookie) | Rotate refresh token |
| `POST` | `/api/v1/auth/logout` | ❌ (cookie) | Logout |

### User Profile

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/users/profile` | ✅ Bearer | Get own profile |
| `PUT` | `/api/v1/users/profile` | ✅ Bearer | Update own profile |

### System

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/health` | ❌ | DB connectivity check |

---

## Development Phases

| Phase | Module | Status |
|-------|--------|--------|
| Phase 1 | Foundation (Auth, Profile, Dashboard Layout) | ✅ **Complete** |
| Phase 2 | Placement Preparation (Categories, Topics, Progress) | 🔲 Next |
| Phase 3 | Mentorship (Mentor Profiles, Requests, Sessions) | 🔲 Pending |
| Phase 4 | Events Hub (Create, Browse, Register) | 🔲 Pending |
| Phase 5 | Clubs Portal (Discover, Join, Manage) | 🔲 Pending |
| Phase 6 | Academic Resources (Upload, Search, Bookmark) | 🔲 Pending |
| Phase 7 | Career Tracking (Applications, Status, Timeline) | 🔲 Pending |
| Phase 8 | Production Engineering (Docker, CI/CD, Logging) | 🔲 Pending |

> See **[IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)** for the complete technical specification and schema designs for each phase.
> See **[PROGRESS.md](./PROGRESS.md)** for completed work and next steps with exact commands.

---

## User Roles

| Role | Access |
|------|--------|
| `STUDENT` | Placement prep, events registration, clubs, resources, career tracking |
| `MENTOR` | Manage mentorship profile, accept/reject student requests |
| `CLUB_MANAGER` | Create and manage clubs |
| `EVENT_ORGANIZER` | Create and manage events |

---

## Contributing

1. Fork the repo and create your feature branch from `main`
2. Follow the module structure: `repository.ts → service.ts → controller.ts → routes.ts`
3. Validate all request bodies with Zod schemas
4. Never use raw SQL — use Prisma queries
5. Run `npm run build` (backend) and `npx tsc --noEmit` (frontend) before committing

---

## License

MIT License — see [LICENSE](LICENSE) for details.
