# Security Guidelines

## Authentication & Authorization

CampusOS uses a robust JSON Web Token (JWT) architecture.

1. **Dual Token System**: 
   - Short-lived Access Tokens (5h) are returned to the frontend and passed in the `Authorization` header.
   - Long-lived Refresh Tokens (7d) are set as `HTTPOnly`, `Secure`, `SameSite` cookies.
2. **Protection**: Access tokens are vulnerable to XSS but mitigate risk through their short lifespan. Refresh tokens are immune to XSS (due to `HTTPOnly`) and mitigate CSRF (due to `SameSite` policies).
3. **Role-Based Access Control (RBAC)**: All destructive actions (POST, PUT, DELETE) on shared resources require the `PLACEMENT_COORDINATOR` role. This is enforced securely on the backend via middleware.

## Data Validation

- **Zod Schemas**: Every incoming API request body, query, and parameter is strictly typed and validated using Zod schemas before hitting business logic.
- **Prisma SQL Injection Protection**: Prisma ORM uses parameterized queries exclusively, eliminating traditional SQL injection vulnerabilities.

## CORS & Environment Security

- The backend is configured to accept requests only from the specific `CORS_ORIGIN` defined in `.env`.
- Secrets (`JWT_SECRET`, database URLs, Cloudinary keys) are strictly managed via environment variables and never committed to version control.

## Rate Limiting

(Pending implementation in future scalability updates) Currently, the system relies on standard infrastructure-level DDoS protections provided by Render and Vercel.
