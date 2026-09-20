# Architecture & Data Flow

## Overview
CampusOS follows a traditional client-server modular monolith architecture:
- **Client**: Next.js 16 (App Router) with TanStack Query.
- **Server**: Node.js / Express API serving RESTful endpoints.
- **Database**: PostgreSQL (Neon) managed via Prisma ORM.

## Module Structure
The backend is organized into domain-driven modules inside `src/modules/`:
- `auth`: JWT issuance and validation.
- `users`: Profile management.
- `dsa`: Practice tracker and categories.
- `subject-notes`: Private notes for students.
- `personal-resume`: Link management.
- `mentorship`: Mentor discovery and requests.
- `events`: System-wide announcements.
- `resources`: Shared study materials.
- `career`: Job and internship tracking.

Each module implements the following layers:
- `types.ts`: Interface definitions.
- `schema.ts`: Zod validation.
- `repository.ts`: Database access (Prisma).
- `service.ts`: Business logic.
- `controller.ts`: HTTP request/response handling.
- `routes.ts`: Express route bindings.

## Authentication Flow
1. User submits credentials to `/api/v1/auth/login`.
2. Server validates and issues two tokens:
   - **Access Token (5h)**: Returned in JSON payload, kept in memory by Next.js.
   - **Refresh Token (7d)**: Set as an HTTP-only secure cookie.
3. Next.js includes the Access Token in the `Authorization: Bearer` header of every API request.
4. If a request returns `401 Unauthorized`, the `api.ts` Axios interceptor automatically calls `/api/v1/auth/refresh`, obtains a new Access Token using the HTTP-only cookie, and retries the original request seamlessly.

## Role-Based Access Control (RBAC)
- Checked at the route level using the `requireRole(['ROLE'])` middleware.
- Extracts user role from the validated JWT access token.
