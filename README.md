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
| 📚 **Placement Preparation** | DSA Practice Tracker with categories, problem logs, and accordion lists | ✅ Live |
| 👥 **Mentorship** | Find mentors, send session requests, accept/reject flow, LinkedIn connect | ✅ Live |
| 📅 **Events Hub** | Browse/register for hackathons, contests, seminars | 🔲 Phase 4 |
| 🏙️ **Clubs Portal** | Discover and join campus clubs | 🔲 Phase 5 |
| 📄 **Academic Resources** | Lecture notes, PYQs, roadmaps, cheatsheets | 🔲 Phase 6 |
| 💼 **Career Tracking** | Log job/internship applications with status timelines | 🔲 Phase 7 |

---

## Tech Stack

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js 5
- **Language**: TypeScript (strict mode)
- **Dev runner**: `tsx watch`
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
- **Database**: PostgreSQL 15 (local install or Docker)
- **Cache**: Redis 7 (via Docker, for future phases)
- **Local Dev**: `docker-compose.yml` (optional)

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
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   ├── seed.ts             # DSA Seeding script
│   │   └── clean-db.js         # Transactional database reset helper script
│   └── src/
│       ├── app.ts              # Express app setup
│       ├── server.ts           # HTTP server entrypoint
│       ├── config/prisma.ts    # Prisma client
│       ├── middleware/auth.ts  # JWT + RBAC middleware
│       └── modules/
│           ├── auth/           # JWT register/login/refresh/logout
│           ├── users/          # Profile management
│           ├── dsa/            # ✅ Phase 2 — DSA Tracker
│           ├── mentorship/     # ✅ Phase 3 — Mentorship Module
│           ├── events/         # 🔲 Phase 4
│           ├── clubs/          # 🔲 Phase 5
│           ├── resources/      # 🔲 Phase 6
│           └── career/         # 🔲 Phase 7
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
                ├── layout.tsx              # Sticky Sidebar layout
                ├── page.tsx                # Dashboard overview
                ├── profile/                # Profile edit
                └── placement/
                    ├── page.tsx            # DSA Stats overview
                    └── dsa/                # ✅ Phase 2 — Accordion DSA Tracker
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
JWT_ACCESS_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"
CORS_ORIGIN="http://localhost:3000"
NODE_ENV="development"
```

### 4. Run database migrations

```bash
cd backend
npx prisma db push --force-reset
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

---

## Development Phases

| Phase | Module | Status |
|-------|--------|--------|
| Phase 1 | Foundation (Auth, Profile, Dashboard Layout) | ✅ **Complete** |
| Phase 2 | Placement Prep (DSA Tracker with Accordion UI) | ✅ **Complete** |
| Phase 3 | Mentorship (Mentor Profiles, Session Requests) | ✅ **Complete** |
| Phase 4 | Events Hub (Create, Browse, Register) | 🔲 Next |
| Phase 5 | Clubs Portal (Discover, Join, Manage) | 🔲 Pending |
| Phase 6 | Academic Resources (Upload, Search, Bookmark) | 🔲 Pending |
| Phase 7 | Career Tracking (Applications, Status, Timeline) | 🔲 Pending |

---

## Contributing

1. Fork the repo and create your feature branch from `main`
2. Follow the module structure: `repository.ts → service.ts → controller.ts → routes.ts`
3. Validate all request bodies with Zod schemas
4. Run `npm run build` (backend) and `npx tsc --noEmit` (frontend) before committing
