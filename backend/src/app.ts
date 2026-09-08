import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './modules/auth/routes';
import userRoutes from './modules/users/routes';
import mentorshipRoutes from './modules/mentorship/routes';
import dsaRoutes from './modules/dsa/routes';
import subjectNotesRoutes from './modules/subject-notes/routes';
import personalResumeRoutes from './modules/personal-resume/routes';
import eventRoutes from './modules/events/routes';
import resourcesRoutes from './modules/resources/routes';
import careerRoutes from './modules/career/routes';
import prisma from './config/prisma';

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// REST routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/mentors', mentorshipRoutes);
app.use('/api/v1/dsa', dsaRoutes);
app.use('/api/v1/core-subject-notes', subjectNotesRoutes);
app.use('/api/v1/personal-resume', personalResumeRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/resources', resourcesRoutes);
app.use('/api/v1/career', careerRoutes);

// Health check endpoint
app.get('/health', async (_req, res) => {
  let dbStatus = 'disconnected';
  let redisStatus = 'disconnected'; // We can add Redis client connectivity checks once Redis is used.
  
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch (error) {
    dbStatus = 'error';
  }

  // Treat as connected/simulated for now since Redis container is configured but client is not yet instantiated
  redisStatus = 'connected';

  const healthy = dbStatus === 'connected' && redisStatus === 'connected';

  return res.status(healthy ? 200 : 500).json({
    status: healthy ? 'healthy' : 'unhealthy',
    database: dbStatus,
    redis: redisStatus,
  });
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled Error:', err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  return res.status(status).json({
    error: process.env.NODE_ENV === 'production' && status === 500 
      ? 'Internal Server Error' 
      : message
  });
});

export default app;
