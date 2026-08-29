import dotenv from 'dotenv';
dotenv.config();

import app from './app';

import { seedPlacementCoordinator } from './modules/auth/seed';

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  await seedPlacementCoordinator();
});
