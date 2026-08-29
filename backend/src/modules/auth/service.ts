import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import { AuthRepository } from './repository';
import { Role } from '@prisma/client';

const authRepository = new AuthRepository();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret';
const JWT_ACCESS_EXPIRATION = process.env.JWT_ACCESS_EXPIRATION || '15m';
const JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION || '7d';

export class AuthService {
  private generateAccessToken(userId: string, email: string, roles: Role[]): string {
    return jwt.sign({ userId, email, roles }, JWT_SECRET, { expiresIn: JWT_ACCESS_EXPIRATION as jwt.SignOptions['expiresIn'] }) as string;
  }

  private generateRefreshToken(userId: string, email: string, roles: Role[]): string {
    return jwt.sign({ userId, email, roles }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRATION as jwt.SignOptions['expiresIn'] }) as string;
  }

  private readonly RESERVED_PC_EMAIL = 'placementcord018@gmail.com';

  async register(email: string, passwordHash: string, firstName: string, lastName: string) {
    if (email.toLowerCase() === this.RESERVED_PC_EMAIL) {
      throw new Error('This email address is reserved and cannot be used for registration.');
    }

    const existingUser = await authRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already exists');
    }


    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(passwordHash, salt);

    const user = await authRepository.createUser(email, hash, firstName, lastName, [Role.STUDENT]);
    
    const accessToken = this.generateAccessToken(user.id, user.email, user.roles);
    const refreshToken = this.generateRefreshToken(user.id, user.email, user.roles);

    // Save refresh token to DB
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await authRepository.createRefreshToken(user.id, refreshToken, expiresAt);

    return {
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles,
        profile: user.profile,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(email: string, passwordHash: string) {
    const user = await authRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Any registered user (Student, Mentor, or Placement Coordinator) can log in with email+password.
    // A randomly-generated passwordHash is set for Google-only users, so bcrypt.compare will simply fail
    // for them — no special case needed.

    const isValid = await bcrypt.compare(passwordHash, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    const accessToken = this.generateAccessToken(user.id, user.email, user.roles);
    const refreshToken = this.generateRefreshToken(user.id, user.email, user.roles);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await authRepository.createRefreshToken(user.id, refreshToken, expiresAt);

    return {
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles,
        profile: user.profile,
      },
      accessToken,
      refreshToken,
    };
  }

  async googleLogin(credential: string) {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new Error('Invalid Google token');
    }

    const email = payload.email;
    const givenName = payload.given_name || 'User';
    const familyName = payload.family_name || '';

    // Block Google sign-in with the reserved Placement Coordinator email.
    // The PC account is password-protected and must not be accessible via Google OAuth.
    if (email.toLowerCase() === this.RESERVED_PC_EMAIL) {
      throw new Error('This account must be accessed using email and password.');
    }

    let user = await authRepository.findByEmail(email);

    if (!user) {
      // New user — create with a random password (they authenticated via Google).
      const randomPassword = crypto.randomBytes(32).toString('hex');
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(randomPassword, salt);
      user = await authRepository.createUser(email, hash, givenName, familyName, [Role.STUDENT]);
    }
    // Existing user found — log them into their existing account regardless of how
    // they originally registered. Roles come from the DB and are never changed here.

    const accessToken = this.generateAccessToken(user.id, user.email, user.roles);
    const refreshToken = this.generateRefreshToken(user.id, user.email, user.roles);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await authRepository.createRefreshToken(user.id, refreshToken, expiresAt);

    return {
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles,
        profile: user.profile,
      },
      accessToken,
      refreshToken,
    };
  }

  async refresh(token: string) {
    const storedToken = await authRepository.findRefreshToken(token);
    if (!storedToken || storedToken.expiresAt < new Date()) {
      if (storedToken) {
        await authRepository.deleteRefreshToken(token);
      }
      throw new Error('Invalid or expired refresh token');
    }

    try {
      const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as any;
      
      // Delete old refresh token (rotation)
      await authRepository.deleteRefreshToken(token);

      const user = storedToken.user;
      const accessToken = this.generateAccessToken(user.id, user.email, user.roles);
      const newRefreshToken = this.generateRefreshToken(user.id, user.email, user.roles);

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      await authRepository.createRefreshToken(user.id, newRefreshToken, expiresAt);

      return {
        accessToken,
        refreshToken: newRefreshToken,
        user: {
          id: user.id,
          email: user.email,
          roles: user.roles,
        },
      };
    } catch (err) {
      await authRepository.deleteRefreshToken(token);
      throw new Error('Invalid refresh token');
    }
  }

  async logout(token: string) {
    await authRepository.deleteRefreshToken(token);
  }
}
