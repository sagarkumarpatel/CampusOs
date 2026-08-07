import prisma from '../../config/prisma';
import { Difficulty } from '@prisma/client';

export class DsaRepository {
  /**
   * Returns all categories. The `problems` field is intentionally left empty here;
   * category-level stats are computed in the service using per-user problem data.
   */
  async getCategories() {
    return prisma.dsaCategory.findMany({
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Returns a user's problems for a specific category, including their completion state.
   */
  async getProblemsByCategory(categoryId: string, userId: string) {
    return prisma.dsaProblem.findMany({
      where: { categoryId, userId },
      include: {
        userCompleted: {
          where: { userId },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Returns all problems created by the user, grouped with their completion state.
   */
  async getUserProblems(userId: string) {
    return prisma.dsaProblem.findMany({
      where: { userId },
      include: {
        userCompleted: {
          where: { userId },
        },
      },
    });
  }

  async findProblemById(id: string) {
    return prisma.dsaProblem.findUnique({
      where: { id },
    });
  }

  async createProblem(
    userId: string,
    categoryId: string,
    problemName: string,
    problemLink: string,
    difficulty: Difficulty
  ) {
    return prisma.dsaProblem.create({
      data: {
        userId,
        categoryId,
        problemName,
        problemLink,
        difficulty,
      },
    });
  }

  async updateProblem(
    id: string,
    categoryId: string,
    problemName: string,
    problemLink: string,
    difficulty: Difficulty
  ) {
    return prisma.dsaProblem.update({
      where: { id },
      data: { categoryId, problemName, problemLink, difficulty },
    });
  }

  async deleteProblem(id: string) {
    return prisma.dsaProblem.delete({ where: { id } });
  }

  async updateStatus(userId: string, problemId: string, completed: boolean) {
    return prisma.userDsaProblem.upsert({
      where: { userId_problemId: { userId, problemId } },
      update: { completed },
      create: { userId, problemId, completed },
    });
  }

  async countUserProblems(userId: string) {
    return prisma.dsaProblem.count({ where: { userId } });
  }
}
