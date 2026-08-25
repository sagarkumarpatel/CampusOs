export interface UserPayload {
  userId: string;
  email: string;
  role: 'STUDENT' | 'MENTOR' | 'PLACEMENT_COORDINATOR';
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
