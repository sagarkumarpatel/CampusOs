import { Request, Response } from 'express';
import { AuthService } from './service';
import { registerSchema, loginSchema, googleAuthSchema } from './schema';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const payload = registerSchema.parse(req.body);
      const result = await authService.register(
        payload.email,
        payload.password,
        payload.firstName,
        payload.lastName
      );

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.status(201).json({
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: (error as any).errors });
      }
      return res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const payload = loginSchema.parse(req.body);
      const result = await authService.login(payload.email, payload.password);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.json({
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: (error as any).errors });
      }
      return res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async googleLogin(req: Request, res: Response) {
    try {
      const payload = googleAuthSchema.parse(req.body);
      const result = await authService.googleLogin(payload.credential);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.json({
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: (error as any).errors });
      }
      return res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const token = req.cookies.refreshToken;
      if (!token) {
        return res.status(401).json({ error: 'Refresh token required' });
      }

      const result = await authService.refresh(token);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        accessToken: result.accessToken,
        user: result.user,
      });
    } catch (error: unknown) {
      return res.status(401).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const token = req.cookies.refreshToken;
      if (token) {
        await authService.logout(token);
      }
      res.clearCookie('refreshToken');
      return res.json({ message: 'Logged out successfully' });
    } catch (error: unknown) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
}
