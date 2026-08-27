# CampusOS

<div align="center">

![CampusOS Banner](https://via.placeholder.com/900x200/0F0F10/FF4D2D?text=CampusOS+%E2%80%94+Unified+Student+Growth+Platform)

**Unified campus growth platform for students.**  
Placement prep · Mentor matching · Event hubs · Academic resources · Career tracking

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](#)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](#)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](#)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748.svg)](#)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791.svg)](#)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-ff4d2d.svg)](#)

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

Instead of juggling separate tools for tracking interview prep, finding mentors, registering for hackathons, and logging job applications, CampusOS gives students a **single, beautifully unified dashboard** with a premium dark-themed UI — glassmorphism cards, coral accents, smooth micro-animations powered by Framer Motion, and a fully responsive layout.

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
| 💼 **Career Tracking** | Publish, search, and track available internships, full-time jobs, and freelance opportunities with student checklist registrations | ✅ Live |

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
- **Styling**: Tailwind CSS v4 (`@theme inline` with semantic CSS variables)
- **Animations**: Framer Motion 11 (staggered reveal, spring transitions, micro-animations)
- **State / Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Design System**: Premium dark theme — matte backgrounds, glassmorphism cards (`backdrop-blur`), coral accent (`#FF4D2D`), responsive sidebar

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
| `PLACEMENT_COORDINATOR` | Manages the Events Hub (publish/delete events) and the Resources Module (all CRUD). | **Only one allowed system-wide.** Second registration attempt returns HTTP 409. |

---

## Project Structure

```
CampusOsProject/
├── docker-compose.yml               # Local Postgres + Redis
├── README.md                        # This file
│
├── backend/
│   ├── .env                         # Environment variables
│   ├── prisma/
│   │   ├── schema.prisma            # Database schema
│   │   ├── seed.ts                  # DSA seeding script (17 categories)
│   │   └── clean-db.js              # Transactional database reset helper
│   └── src/
│       ├── app.ts                   # Express app setup
│       ├── server.ts                # HTTP server entrypoint
│       ├── config/
│       │   ├── prisma.ts            # Prisma client singleton
│       │   └── cloudinary.ts        # Cloudinary SDK singleton
│       ├── middleware/auth.ts        # JWT + RBAC middleware
│       └── modules/
│           ├── auth/                # JWT register/login/refresh/logout
│           ├── users/               # Profile management
│           ├── dsa/                 # DSA Tracker (categories + problems)
│           ├── subject-notes/       # Private Core Subject Notes
│           ├── personal-resume/     # Personal Resume Link Manager
│           ├── mentorship/          # Mentor profiles + session requests
│           ├── events/              # Events Hub + Cloudinary uploads
│           ├── resources/           # Shared Resources Module
│           └── career/              # Career Tracking (opportunities + registrations)
│
└── frontend/
    └── src/
        ├── app/
        │   ├── globals.css                    # Semantic CSS variables + dark theme tokens
        │   ├── layout.tsx                     # Root layout
        │   ├── page.tsx                       # / Landing page
        │   ├── auth/
        │   │   ├── login/                     # Login page
        │   │   └── register/                  # Registration (all roles)
        │   └── dashboard/
        │       ├── layout.tsx                 # Sidebar navigation layout
        │       ├── page.tsx                   # Dashboard overview hub
        │       ├── profile/                   # Profile edit page
        │       ├── placement/
        │       │   ├── page.tsx               # 3-col: DSA card, Subject Notes, Resume
        │       │   ├── dsa/                   # Accordion DSA Tracker (17 topics)
        │       │   └── [categoryId]/          # Category-level problem view
        │       ├── mentorship/
        │       │   ├── page.tsx               # Mentor directory + request modal
        │       │   └── requests/              # Bidirectional request dashboard
        │       ├── events/                    # Events Hub (publish/filter/register)
        │       ├── resources/                 # Shared Resources (4 types)
        │       └── career/                    # Career Tracking board
        ├── lib/
        │   └── api.ts                         # Centralized API client (auto token refresh)
        └── providers/
            ├── AuthProvider.tsx               # Auth context + token management
            └── QueryProvider.tsx              # TanStack Query client provider
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

> The seed script creates **17 DSA categories** (Arrays, Strings, Linked Lists, Trees, Graphs, etc.) that power the DSA Tracker accordion.

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

### 7. Install frontend dependencies

```bash
cd frontend
npm install
```

### 8. Start the frontend dev server

```bash
cd frontend
npm run dev
# → Running at http://localhost:3000
```

### 9. Open in browser

Navigate to **http://localhost:3000** to see the landing page.

> **Tip:** Register a user as `Placement Coordinator` (only one allowed system-wide) to unlock
> the Events Hub publish button and full Resources Module management UI.

---

## API Reference

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/v1/auth/register` | ❌ | Create account (roles: STUDENT, MENTOR, PLACEMENT_COORDINATOR) |
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
| `GET` | `/api/v1/dsa/dashboard` | ✅ Bearer | Overview stats (total, solved, remaining, by difficulty) |
| `GET` | `/api/v1/dsa/categories` | ✅ Bearer | List all 17 categories with user progress counts |
| `GET` | `/api/v1/dsa/categories/:id/problems` | ✅ Bearer | Problems in a specific category |
| `POST` | `/api/v1/dsa/problems` | ✅ Bearer | Add a problem |
| `PUT` | `/api/v1/dsa/problems/:id` | ✅ Bearer | Modify a problem |
| `DELETE` | `/api/v1/dsa/problems/:id` | ✅ Bearer | Delete a problem |
| `PATCH` | `/api/v1/dsa/problems/:id/status` | ✅ Bearer | Toggle solved/unsolved |

### Private Core Subject Notes

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

### Mentorship

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/mentors` | ✅ Bearer | List all mentor profiles |
| `GET` | `/api/v1/mentors/profile` | ✅ Bearer | Get own mentor profile |
| `POST` | `/api/v1/mentors/profile` | ✅ Bearer | Create or update mentor profile |
| `POST` | `/api/v1/mentors/:mentorId/request` | ✅ Bearer | Send mentorship request |
| `GET` | `/api/v1/mentors/requests` | ✅ Bearer | Get all requests (sent + received) |
| `PUT` | `/api/v1/mentors/requests/:requestId` | ✅ Bearer | Accept / Reject / Cancel request |

### Events Hub

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/events` | ✅ Bearer | All events |
| `GET` | `/api/v1/events/upcoming` | ✅ Bearer | Upcoming events |
| `GET` | `/api/v1/events/past` | ✅ Bearer | Past events |
| `GET` | `/api/v1/events/:id` | ✅ Bearer | Single event detail |
| `POST` | `/api/v1/events` | 🔒 Coordinator | Publish new event |
| `DELETE` | `/api/v1/events/:id` | 🔒 Coordinator | Delete event |
| `POST` | `/api/v1/events/upload` | 🔒 Coordinator | Upload banner image to Cloudinary |

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
| `POST` | `/api/v1/resources/cheat-sheets/upload` | 🔒 Coordinator | Upload cheat sheet image to Cloudinary |
| `PUT` | `/api/v1/resources/cheat-sheets/:id` | 🔒 Coordinator | Update cheat sheet |
| `DELETE` | `/api/v1/resources/cheat-sheets/:id` | 🔒 Coordinator | Delete cheat sheet |

### Career Tracking

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/career` | ✅ Bearer | List all opportunities |
| `POST` | `/api/v1/career` | 🔒 Coordinator | Publish a new opportunity |
| `PUT` | `/api/v1/career/:id` | 🔒 Coordinator | Update an opportunity |
| `DELETE` | `/api/v1/career/:id` | 🔒 Coordinator | Delete an opportunity |
| `POST` | `/api/v1/career/:id/register` | ✅ Bearer | Student registers interest |
| `DELETE` | `/api/v1/career/:id/register` | ✅ Bearer | Student withdraws registration |

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
| Phase 6 | Career Tracking (Opportunities Board, Registrations) | ✅ **Complete** |
| Phase 7 | UI/UX Redesign (Premium Dark Theme, Glassmorphism, Framer Motion Animations) | ✅ **Complete** |
| Phase 8 | Production Engineering (Migrations, Rate Limiting, CI/CD) | 🔲 Pending |

---

## Contributing

1. Fork the repo and create your feature branch from `main`
2. Follow the module structure: `types.ts → schema.ts → repository.ts → service.ts → controller.ts → routes.ts`
3. Validate all request bodies with Zod schemas
4. Use `requireRole(['PLACEMENT_COORDINATOR'])` for any coordinator-restricted route
5. Run `npx tsc --noEmit` (backend) and `npm run build` (frontend) before committing
6. Static route paths (e.g. `/upload`) must be declared **before** parameterized paths (e.g. `/:id`) in Express
7. For UI changes: use semantic CSS variables (`--accent-coral`, `--surface`, `--border`, etc.) — never hardcode colors

> **Note**: Documentation verified up-to-date with current implementation state as of August 2026.
