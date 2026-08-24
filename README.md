# CampusOS

<div align="center">

![CampusOS Banner](https://via.placeholder.com/900x200/1e1b4b/a5b4fc?text=CampusOS+%E2%80%94+Unified+Student+Growth+Platform)

**Unified campus growth platform for students.**  
Placement prep · Mentor matching · Event hubs · Academic resources · Clubs · Career tracking

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
4. [Role System](#role-system)
5. [Project Structure](#project-structure)
6. [Getting Started](#getting-started)
7. [API Reference](#api-reference)
8. [Development Phases](#development-phases)
9. [Contributing](#contributing)

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
| 📚 **Placement Preparation** | DSA Practice Tracker (17 topics with accordion UI), Private Core Subject Notes manager, and Personal Resume Link Manager | ✅ Live |
| 👥 **Mentorship** | Find mentors, send session requests, accept/reject flow, LinkedIn connect | ✅ Live |
| 📅 **Events Hub** | Browse/filter announcements, external registration redirect, image uploads via Cloudinary | ✅ Live |
| 📄 **Resources Module** | Shared academic resources — Subject Notes, Previous Year Questions, Interview Notes, Cheat Sheets — managed by Placement Coordinator, viewable by all students | ✅ Live |
| 🏙️ **Clubs Portal** | Discover and join campus clubs | 🔲 Phase 6 |
| 💼 **Career Tracking** | Log job/internship applications with status timelines | 🔲 Phase 7 |

---

## Tech Stack

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js 5
- **Language**: TypeScript (strict mode)
- **Dev runner**: `tsx watch`
- **ORM**: Prisma 6 with PostgreSQL
- **Auth**: JWT (access token 5h + refresh token 7d via HTTP-only cookie)
- **Validation**: Zod
- **Password Hashing**: bcryptjs
- **Image Storage**: Cloudinary
  - `campusos/events/` — event banner uploads
  - `campusos/resources/` — cheat sheet image uploads

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **State / Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

### Infrastructure
- **Database**: PostgreSQL 15 (local install or Docker)
- **Cache**: Redis 7 (via Docker, for future phases)
- **Local Dev**: `docker-compose.yml` (optional)

---

## Role System

CampusOS uses role-based access control (RBAC) enforced on both the frontend and backend.

| Role | Description | Constraints |
|------|-------------|-------------|
| `STUDENT` | Default role. Read-only on shared resources. Full access to own private placement data. | — |
| `MENTOR` | Can create a mentor profile and accept/reject session requests. | — |
| `CLUB_MANAGER` | Will manage clubs in Phase 6. | — |
| `PLACEMENT_COORDINATOR` | Manages the Events Hub (publish/delete events) and the Resources Module (all CRUD). Replaces the old `EVENT_ORGANIZER` role. | **Only one allowed system-wide.** Second registration attempt returns HTTP 409. |

---

## Project Structure

```
CampusOsProject/
├── docker-compose.yml          # Local Postgres + Redis
├── IMPLEMENTATION_PLAN.md      # Full technical specification (for AI handoff)
├── PROGRESS.md                 # What's done, what's next (for AI handoff)
├── README.md                   # This file
│
├── backend/
│   ├── .env                    # Environment variables
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   ├── seed.ts             # DSA Seeding script
│   │   └── clean-db.js         # Transactional database reset helper script
│   └── src/
│       ├── app.ts              # Express app setup
│       ├── server.ts           # HTTP server entrypoint
│       ├── config/
│       │   ├── prisma.ts       # Prisma client
│       │   └── cloudinary.ts   # Cloudinary SDK singleton
│       ├── middleware/auth.ts  # JWT + RBAC middleware
│       └── modules/
│           ├── auth/           # JWT register/login/refresh/logout + coordinator guard
│           ├── users/          # Profile management
│           ├── dsa/            # ✅ Phase 2 — DSA Tracker
│           ├── subject-notes/  # ✅ Phase 2 — Private Core Subject Notes
│           ├── personal-resume/ # ✅ Phase 2 — Personal Resume Link Manager
│           ├── mentorship/     # ✅ Phase 3 — Mentorship Module
│           ├── events/         # ✅ Phase 4 — Events Hub
│           ├── resources/      # ✅ Phase 5 — Shared Resources Module
│           ├── clubs/          # 🔲 Phase 6
│           └── career/         # 🔲 Phase 7
│
└── frontend/
    └── src/
        ├── lib/api.ts          # API client with auto token refresh
        ├── providers/          # QueryProvider, AuthProvider
        └── app/
            ├── page.tsx                    # / Landing page
            ├── auth/login/                 # Login
            ├── auth/register/              # Registration (all roles)
            └── dashboard/
                ├── layout.tsx              # Sidebar layout (7 nav items)
                ├── page.tsx                # Dashboard overview
                ├── profile/                # Profile edit
                ├── placement/
                │   ├── page.tsx            # 3-col: DSA card, Subject Notes, Personal Resume
                │   └── dsa/                # ✅ Accordion DSA Tracker (17 topics)
                ├── mentorship/
                │   ├── page.tsx            # ✅ Mentor directory + request modal
                │   └── requests/           # ✅ Bidirectional request dashboard
                ├── events/                 # ✅ Events Hub (publish/delete for Coordinator)
                └── resources/              # ✅ Shared Resources (CRUD for Coordinator)
```

---

## Getting Started

### Prerequisites

- **Node.js** 20+
- **npm** 10+
- **PostgreSQL** (local install) or Docker Desktop

### 1. Clone the repository

```bash
git clone <repo-url>
cd CampusOsProject
```

### 2. Start local database

```bash
# Option A — Docker
docker compose up -d postgres

# Option B — Local PostgreSQL
# Create a database named 'campusos' and update backend/.env
```

### 3. Configure backend environment

Create/edit `backend/.env`:

```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/campusos?schema=public"
JWT_SECRET="your-strong-random-access-secret"
JWT_REFRESH_SECRET="your-strong-random-refresh-secret"
JWT_ACCESS_EXPIRATION="5h"
JWT_REFRESH_EXPIRATION="7d"
CORS_ORIGIN="http://localhost:3000"
NODE_ENV="development"

# Cloudinary — required for Events Hub banners AND Resources Cheat Sheet uploads
# Get these from https://cloudinary.com/console
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

### 4. Run database migrations and seed

```bash
cd backend
npx prisma db push
node prisma/seed.js
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

> **Tip:** Register a user as `Placement Coordinator` (only one allowed) to unlock
> the Events Hub publish button and the full Resources Module management UI.

---

## API Reference

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/v1/auth/register` | ❌ | Create account (roles: STUDENT, MENTOR, CLUB_MANAGER, PLACEMENT_COORDINATOR) |
| `POST` | `/api/v1/auth/login` | ❌ | Login |
| `POST` | `/api/v1/auth/refresh` | ❌ (cookie) | Rotate refresh token |
| `POST` | `/api/v1/auth/logout` | ❌ (cookie) | Logout |

### User Profile

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/users/profile` | ✅ Bearer | Get own profile |
| `PUT` | `/api/v1/users/profile` | ✅ Bearer | Update own profile |

### DSA Practice Tracker

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/dsa/dashboard` | ✅ Bearer | Overview stats |
| `GET` | `/api/v1/dsa/categories` | ✅ Bearer | List categories & user counts |
| `GET` | `/api/v1/dsa/categories/:id/problems` | ✅ Bearer | Problems in category |
| `POST` | `/api/v1/dsa/problems` | ✅ Bearer | Add a problem |
| `PUT` | `/api/v1/dsa/problems/:id` | ✅ Bearer | Modify a problem |
| `DELETE` | `/api/v1/dsa/problems/:id` | ✅ Bearer | Delete a problem |
| `PATCH` | `/api/v1/dsa/problems/:id/status` | ✅ Bearer | Toggle status |

### Mentorship

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/mentors` | ✅ Bearer | List all mentor profiles |
| `GET` | `/api/v1/mentors/profile` | ✅ Bearer | Get own mentor profile |
| `POST` | `/api/v1/mentors/profile` | ✅ Bearer | Create or update mentor profile |
| `POST` | `/api/v1/mentors/:mentorId/request` | ✅ Bearer | Send mentorship request |
| `GET` | `/api/v1/mentors/requests` | ✅ Bearer | Get requests |
| `PUT` | `/api/v1/mentors/requests/:requestId` | ✅ Bearer | Accept / Reject / Cancel request |

### Private Core Subject Notes (Placement Prep)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/core-subject-notes` | ✅ Bearer | List own subject notes |
| `POST` | `/api/v1/core-subject-notes` | ✅ Bearer | Add a subject note |
| `PUT` | `/api/v1/core-subject-notes/:id` | ✅ Bearer | Update a subject note |
| `DELETE` | `/api/v1/core-subject-notes/:id` | ✅ Bearer | Delete a subject note |

### Personal Resume

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/personal-resume` | ✅ Bearer | Get saved resume link |
| `POST` | `/api/v1/personal-resume` | ✅ Bearer | Save a resume link (one per user) |
| `PUT` | `/api/v1/personal-resume/:id` | ✅ Bearer | Update resume link |
| `DELETE` | `/api/v1/personal-resume/:id` | ✅ Bearer | Remove saved resume link |

### Events Hub

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/events` | ✅ Bearer | All events |
| `GET` | `/api/v1/events/upcoming` | ✅ Bearer | Upcoming events |
| `GET` | `/api/v1/events/past` | ✅ Bearer | Past events |
| `GET` | `/api/v1/events/:id` | ✅ Bearer | Single event |
| `POST` | `/api/v1/events` | 🔒 Coordinator | Publish new event |
| `DELETE` | `/api/v1/events/:id` | 🔒 Coordinator | Delete event |
| `POST` | `/api/v1/events/upload` | 🔒 Coordinator | Upload banner to Cloudinary |

### Resources Module

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/resources` | ✅ Bearer | Get all resources (all 4 types) |
| `POST` | `/api/v1/resources/subject-notes` | 🔒 Coordinator | Add subject note |
| `PUT` | `/api/v1/resources/subject-notes/:id` | 🔒 Coordinator | Update subject note |
| `DELETE` | `/api/v1/resources/subject-notes/:id` | 🔒 Coordinator | Delete subject note |
| `POST` | `/api/v1/resources/previous-year-questions` | 🔒 Coordinator | Add PYQ |
| `PUT` | `/api/v1/resources/previous-year-questions/:id` | 🔒 Coordinator | Update PYQ |
| `DELETE` | `/api/v1/resources/previous-year-questions/:id` | 🔒 Coordinator | Delete PYQ |
| `POST` | `/api/v1/resources/interview-notes` | 🔒 Coordinator | Add interview note |
| `PUT` | `/api/v1/resources/interview-notes/:id` | 🔒 Coordinator | Update interview note |
| `DELETE` | `/api/v1/resources/interview-notes/:id` | 🔒 Coordinator | Delete interview note |
| `POST` | `/api/v1/resources/cheat-sheets` | 🔒 Coordinator | Add cheat sheet |
| `POST` | `/api/v1/resources/cheat-sheets/upload` | 🔒 Coordinator | Upload image to Cloudinary |
| `PUT` | `/api/v1/resources/cheat-sheets/:id` | 🔒 Coordinator | Update cheat sheet |
| `DELETE` | `/api/v1/resources/cheat-sheets/:id` | 🔒 Coordinator | Delete cheat sheet |

> 🔒 **Coordinator** = `PLACEMENT_COORDINATOR` role required. Only one coordinator may exist in the system.

---

## Development Phases

| Phase | Module | Status |
|-------|--------|--------|
| Phase 1 | Foundation (Auth, Profile, Dashboard Layout) | ✅ **Complete** |
| Phase 2 | Placement Prep (DSA Tracker, Private Notes, Resume) | ✅ **Complete** |
| Phase 3 | Mentorship (Mentor Profiles, Session Requests) | ✅ **Complete** |
| Phase 4 | Events Hub (Create, Browse, Filter, Cloudinary Uploads) | ✅ **Complete** |
| Phase 5 | Resources Module (Shared Notes, PYQs, Interview Notes, Cheat Sheets) + Placement Coordinator Role | ✅ **Complete** |
| Phase 6 | Clubs Portal (Discover, Join, Manage) | 🔲 Next |
| Phase 7 | Career Tracking (Applications, Status, Timeline) | 🔲 Pending |
| Phase 8 | Production Engineering (Migrations, Rate Limiting, CI/CD) | 🔲 Pending |

---

## Contributing

1. Fork the repo and create your feature branch from `main`
2. Follow the module structure: `types.ts → schema.ts → repository.ts → service.ts → controller.ts → routes.ts`
3. Validate all request bodies with Zod schemas
4. Use `requireRole(['PLACEMENT_COORDINATOR'])` for any coordinator-restricted route
5. Run `npx tsc --noEmit` (backend) and `npx tsc --noEmit` (frontend) before committing
6. Static route paths (e.g. `/upload`) must be declared **before** parameterized paths (e.g. `/:id`) in Express
