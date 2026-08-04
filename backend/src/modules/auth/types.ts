export interface UserPayload {
  userId: string;
  email: string;
  role: 'STUDENT' | 'MENTOR' | 'CLUB_MANAGER' | 'EVENT_ORGANIZER';
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
