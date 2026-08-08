import { PersonalResumeRepository } from './repository';

const repository = new PersonalResumeRepository();

export class PersonalResumeService {
  async getResume(userId: string) {
    return repository.findByUserId(userId);
  }

  async createResume(userId: string, resumeLink: string) {
    // Prevent duplicate — one resume per user
    const existing = await repository.findByUserId(userId);
    if (existing) {
      throw new Error('Resume already exists. Use PUT to update it.');
    }
    return repository.create(userId, resumeLink);
  }

  async updateResume(id: string, userId: string, resumeLink: string) {
    const resume = await repository.findById(id);
    if (!resume) {
      throw new Error('Resume not found');
    }
    // Ownership guard
    if (resume.userId !== userId) {
      throw new Error('Forbidden');
    }
    return repository.update(id, resumeLink);
  }

  async deleteResume(id: string, userId: string) {
    const resume = await repository.findById(id);
    if (!resume) {
      throw new Error('Resume not found');
    }
    // Ownership guard
    if (resume.userId !== userId) {
      throw new Error('Forbidden');
    }
    return repository.delete(id);
  }
}
