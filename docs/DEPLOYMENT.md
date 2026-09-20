# Deployment Guide

CampusOS production architecture is decoupled into three main layers:
1. **Frontend**: Next.js App Router deployed on Vercel.
2. **Backend**: Express API deployed on Render.
3. **Database**: PostgreSQL hosted on Neon.

## 1. Database Setup (Neon)
1. Create a project in [Neon Serverless Postgres](https://neon.tech).
2. Retrieve the pooled connection string (e.g., `postgresql://...`).
3. Set this connection string as the `DATABASE_URL` environment variable on the Backend.

## 2. Backend Deployment (Render)
1. Connect Render to the GitHub repository.
2. Create a **Web Service**.
3. Set the Root Directory to `backend`.
4. Build Command: `npm install && npx prisma generate && npm run build`
5. Start Command: `npm start`
6. Add all production environment variables (PORT, DATABASE_URL, JWT secrets, CLOUDINARY credentials, etc.).
7. Important: Ensure `CORS_ORIGIN` matches the production Vercel frontend URL exactly.
8. On the first deploy, execute the Prisma migration manually in the Render Shell:
   ```bash
   npx prisma migrate deploy
   ```

## 3. Frontend Deployment (Vercel)
1. Import the GitHub repository into Vercel.
2. Set the Root Directory to `frontend`.
3. Framework Preset: Next.js.
4. Set the Environment Variable:
   - `NEXT_PUBLIC_API_URL` to point to the live Render backend URL (e.g., `https://campusos-backend.onrender.com/api/v1`).
5. Deploy.

## 4. Media Storage (Cloudinary)
CampusOS uses Cloudinary to store images (event banners, cheat sheets).
1. Ensure the backend Render service has valid `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.
2. Images are isolated in respective folders (e.g., `campusos/events/`).
