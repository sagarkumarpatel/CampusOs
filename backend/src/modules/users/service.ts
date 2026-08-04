import { UserRepository } from './repository';

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
}
