export interface UserPayload {
  userId: string;
  email: string;
  role: 'STUDENT' | 'MENTOR' | 'CLUB_MANAGER' | 'PLACEMENT_COORDINATOR';
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
