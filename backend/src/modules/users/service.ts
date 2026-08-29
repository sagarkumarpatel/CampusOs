import { UserRepository } from './repository';
import prisma from '../../config/prisma';

const userRepository = new UserRepository();

export class UserService {
  async getProfile(userId: string) {
    const profile = await userRepository.getProfile(userId);
    if (!profile) {
      throw new Error('Profile not found');
    }
    return profile;
  }

  async updateProfile(
    userId: string,
    data: {
      firstName?: string;
      lastName?: string;
      avatarUrl?: string;
      bio?: string;
      skills?: string[];
      college?: string;
      graduationYear?: number;
      resumeUrl?: string;
    }
  ) {
    return userRepository.updateProfile(userId, data);
  }

  async findAll() {
    return userRepository.findAll();
  }

  async assignMentorRole(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');
    if (!user.roles.includes('MENTOR')) {
      const updatedRoles = [...user.roles, 'MENTOR'];
      return userRepository.updateRoles(userId, updatedRoles);
    }
    return user;
  }

  async removeMentorRole(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');
    const updatedRoles = user.roles.filter(r => r !== 'MENTOR');
    return userRepository.updateRoles(userId, updatedRoles);
  }

  async updatePassword(userId: string, passwordHash: string) {
    return userRepository.updatePassword(userId, passwordHash);
  }
}
