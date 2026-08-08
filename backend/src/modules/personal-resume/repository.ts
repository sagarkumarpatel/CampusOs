import prisma from '../../config/prisma';

export class PersonalResumeRepository {
  async findByUserId(userId: string) {
    return prisma.personalResume.findUnique({
      where: { userId },
    });
  }

  async findById(id: string) {
    return prisma.personalResume.findUnique({
      where: { id },
    });
  }

  async create(userId: string, resumeLink: string) {
    return prisma.personalResume.create({
      data: { userId, resumeLink },
    });
  }

  async update(id: string, resumeLink: string) {
    return prisma.personalResume.update({
      where: { id },
      data: { resumeLink },
    });
  }

  async delete(id: string) {
    return prisma.personalResume.delete({
      where: { id },
    });
  }
}
