import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { AuthRepository } from './repository';
import { Role } from '@prisma/client';

const authRepository = new AuthRepository();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret';
const JWT_ACCESS_EXPIRATION = process.env.JWT_ACCESS_EXPIRATION || '15m';
const JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION || '7d';

export class AuthService {
  private generateAccessToken(userId: string, email: string, role: Role): string {
    return jwt.sign({ userId, email, role }, JWT_SECRET, { expiresIn: JWT_ACCESS_EXPIRATION as jwt.SignOptions['expiresIn'] }) as string;
  }

  private generateRefreshToken(userId: string, email: string, role: Role): string {
    return jwt.sign({ userId, email, role }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRATION as jwt.SignOptions['expiresIn'] }) as string;
  }

  async register(email: string, passwordHash: string, role: Role, firstName: string, lastName: string) {
    const existingUser = await authRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    if (role === Role.PLACEMENT_COORDINATOR) {
      const coordinatorExists = await authRepository.findPlacementCoordinator();
      if (coordinatorExists) {
        throw new Error('Placement Coordinator already exists in the system');
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(passwordHash, salt);

    const user = await authRepository.createUser(email, hash, role, firstName, lastName);
    
    const accessToken = this.generateAccessToken(user.id, user.email, user.role);
    const refreshToken = this.generateRefreshToken(user.id, user.email, user.role);

    // Save refresh token to DB
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await authRepository.createRefreshToken(user.id, refreshToken, expiresAt);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
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

    const isValid = await bcrypt.compare(passwordHash, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    const accessToken = this.generateAccessToken(user.id, user.email, user.role);
    const refreshToken = this.generateRefreshToken(user.id, user.email, user.role);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await authRepository.createRefreshToken(user.id, refreshToken, expiresAt);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
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
      const accessToken = this.generateAccessToken(user.id, user.email, user.role);
      const newRefreshToken = this.generateRefreshToken(user.id, user.email, user.role);

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      await authRepository.createRefreshToken(user.id, newRefreshToken, expiresAt);

      return {
        accessToken,
        refreshToken: newRefreshToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
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
