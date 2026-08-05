import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './modules/auth/routes';
import userRoutes from './modules/users/routes';
import placementRoutes from './modules/placement/routes';
import mentorshipRoutes from './modules/mentorship/routes';
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
app.use('/api/v1/placement', placementRoutes);
app.use('/api/v1/mentors', mentorshipRoutes);

// Health check endpoint
app.get('/health', async (req, res) => {
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

export default app;
