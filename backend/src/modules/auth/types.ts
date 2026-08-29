export interface UserPayload {
  userId: string;
  email: string;
  roles: ('STUDENT' | 'MENTOR' | 'PLACEMENT_COORDINATOR')[];
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
