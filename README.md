# CampusOS

<div align="center">

![CampusOS Banner](https://via.placeholder.com/900x200/FFFFFF/000000?text=CampusOS+%E2%80%94+Unified+Student+Growth+Platform)

**Unified campus growth platform for students.**  
Placement prep · Mentor matching · Event hubs · Academic resources · Career tracking

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](#)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](#)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](#)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748.svg)](#)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791.svg)](#)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-13-ff4d2d.svg)](#)

</div>

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Role System](#role-system)
5. [Project Structure](#project-structure)
6. [Getting Started](#getting-started)
7. [Documentation](#documentation)
8. [Development Phases](#development-phases)
9. [Contributing](#contributing)

---

## Overview

**CampusOS** is a full-stack web application that connects the six most critical needs of a college student preparing for careers and campus life — all under one authenticated roof.

Instead of juggling separate tools for tracking interview prep, finding mentors, registering for hackathons, and logging job applications, CampusOS gives students a **single, beautifully unified dashboard** featuring a minimal, modern **light-themed UI** with video backgrounds, glassmorphism components, and smooth micro-animations powered by Framer Motion.

---

## Features

| Module | Description | Status |
|--------|-------------|--------|
| 🔐 **Authentication** | Register, login, refresh tokens (JWT + HTTP-only cookies) | ✅ Live |
| 👤 **User Profiles** | Personal info, skills, college, graduation year, resume | ✅ Live |
| 📚 **Placement Preparation** | DSA Practice Tracker (17 topics), Private Core Subject Notes manager, Resume Link Manager | ✅ Live |
| 👥 **Mentorship** | Find mentors, send session requests, accept/reject flow, LinkedIn connect | ✅ Live |
| 📅 **Events Hub** | Browse/filter announcements, external registration redirect, image uploads via Cloudinary | ✅ Live |
| 📄 **Resources Module** | Shared academic resources (Subject Notes, PYQs, Interview Notes, Cheat Sheets) | ✅ Live |
| 💼 **Career Tracking** | Publish, search, and track available internships, full-time jobs, and freelance opportunities | ✅ Live |

---

## Tech Stack

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js 5
- **Language**: TypeScript (strict mode)
- **ORM**: Prisma 6 with PostgreSQL (Neon)
- **Auth**: JWT (access token 5h + refresh token 7d via HTTP-only cookie)
- **Validation**: Zod
- **Image Storage**: Cloudinary

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion 13
- **State / Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Design System**: Premium light theme — white backgrounds, glassmorphism navbar, black/white video backgrounds.

---

## Role System

CampusOS uses role-based access control (RBAC).

| Role | Description | Constraints |
|------|-------------|-------------|
| `STUDENT` | Default role. Read-only on shared resources. Full access to own private placement data. | — |
| `MENTOR` | Can create a mentor profile and accept/reject session requests. | — |
| `PLACEMENT_COORDINATOR` | Manages the Events Hub (publish/delete events) and the Resources Module (all CRUD). | **Only one allowed system-wide.** |

---

## Getting Started

### Prerequisites
- **Node.js** 20+
- **npm** 10+
- **PostgreSQL** (local install, Docker, or hosted like Neon)

### 1. Clone & Install
```bash
git clone <repo-url>
cd CampusOsProject

# Install Backend
cd backend && npm install

# Install Frontend
cd ../frontend && npm install
```

### 2. Configure Backend (`backend/.env`)
```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/campusos?schema=public"
JWT_SECRET="your-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_ACCESS_EXPIRATION="5h"
JWT_REFRESH_EXPIRATION="7d"
CORS_ORIGIN="http://localhost:3000"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

### 3. Run Migrations & Seed
```bash
cd backend
npx prisma db push
node prisma/seed.js
```

### 4. Configure Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### 5. Start Development Servers
Open two terminal windows:
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

---

## Documentation

Comprehensive documentation has been split into dedicated files within the `docs/` directory:

- [Architecture & Data Flow](./docs/ARCHITECTURE.md)
- [API Reference](./docs/API_REFERENCE.md)
- [Testing Guide (Playwright & Vitest)](./docs/TESTING.md)
- [Deployment (Vercel & Render)](./docs/DEPLOYMENT.md)
- [Security & Auth Flow](./docs/SECURITY.md)

---

## Development Phases

| Phase | Module | Status |
|-------|--------|--------|
| Phase 1 | Foundation (Auth, Profile, Dashboard Layout) | ✅ **Complete** |
| Phase 2 | Placement Prep (DSA Tracker, Private Notes, Resume) | ✅ **Complete** |
| Phase 3 | Mentorship (Mentor Profiles, Session Requests) | ✅ **Complete** |
| Phase 4 | Events Hub (Create, Browse, Filter, Cloudinary Uploads) | ✅ **Complete** |
| Phase 5 | Resources Module (Shared Notes, PYQs, Interview Notes, Cheat Sheets) | ✅ **Complete** |
| Phase 6 | Career Tracking (Opportunities Board, Registrations) | ✅ **Complete** |
| Phase 7 | UI/UX Redesign (Premium Light Theme, Video Backgrounds) | ✅ **Complete** |
| Phase 8 | Production Engineering (Migrations, Tests, CI/CD, Audits) | ✅ **Complete** |

---

## Contributing

1. Fork the repo and create your feature branch from `main`
2. Follow the module structure: `types.ts → schema.ts → repository.ts → service.ts → controller.ts → routes.ts`
3. Validate all request bodies with Zod schemas
4. Ensure tests pass before committing.
