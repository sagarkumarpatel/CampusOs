import { DsaRepository } from './repository';
import { Difficulty } from '@prisma/client';

const repository = new DsaRepository();

export class DsaService {
  async getDsaDashboard(userId: string) {
    // Only count THIS user's problems
    const userProblems = await repository.getUserProblems(userId);

    const completedItems = userProblems.filter((p) => p.userCompleted[0]?.completed === true);
    const totalProblems = userProblems.length;
    const solvedProblems = completedItems.length;
    const remainingProblems = Math.max(0, totalProblems - solvedProblems);

    const easySolved = completedItems.filter((p) => p.difficulty === Difficulty.EASY).length;
    const mediumSolved = completedItems.filter((p) => p.difficulty === Difficulty.MEDIUM).length;
    const hardSolved = completedItems.filter((p) => p.difficulty === Difficulty.HARD).length;

    const progressPercent = totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0;

    return {
      totalProblems,
      solvedProblems,
      remainingProblems,
      easySolved,
      mediumSolved,
      hardSolved,
      progressPercent,
    };
  }

  async getCategoriesList(userId: string) {
    const categories = await repository.getCategories();
    // Only this user's problems
    const userProblems = await repository.getUserProblems(userId);

    // Group by categoryId
    const byCategory = new Map<string, typeof userProblems>();
    for (const p of userProblems) {
      if (!byCategory.has(p.categoryId)) byCategory.set(p.categoryId, []);
      byCategory.get(p.categoryId)!.push(p);
    }

    return categories.map((cat) => {
      const catProblems = byCategory.get(cat.id) ?? [];
      const totalProblems = catProblems.length;
      const solvedProblems = catProblems.filter((p) => p.userCompleted[0]?.completed === true).length;
      const remainingProblems = Math.max(0, totalProblems - solvedProblems);

      const easySolved = catProblems.filter(
        (p) => p.difficulty === Difficulty.EASY && p.userCompleted[0]?.completed === true
      ).length;
      const mediumSolved = catProblems.filter(
        (p) => p.difficulty === Difficulty.MEDIUM && p.userCompleted[0]?.completed === true
      ).length;
      const hardSolved = catProblems.filter(
        (p) => p.difficulty === Difficulty.HARD && p.userCompleted[0]?.completed === true
      ).length;

      const easyCount = catProblems.filter((p) => p.difficulty === Difficulty.EASY).length;
      const mediumCount = catProblems.filter((p) => p.difficulty === Difficulty.MEDIUM).length;
      const hardCount = catProblems.filter((p) => p.difficulty === Difficulty.HARD).length;

      const progressPercent = totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0;

      return {
        id: cat.id,
        name: cat.name,
        description: cat.description,
        totalProblems,
        solvedProblems,
        remainingProblems,
        easySolved,
        mediumSolved,
        hardSolved,
        easyCount,
        mediumCount,
        hardCount,
        progressPercent,
      };
    });
  }

  async getCategoryProblems(categoryId: string, userId: string) {
    // Scoped to this user's problems in this category
    const problems = await repository.getProblemsByCategory(categoryId, userId);
    return problems.map((prob) => {
      const statusEntry = prob.userCompleted[0];
      return {
        id: prob.id,
        problemName: prob.problemName,
        problemLink: prob.problemLink,
        difficulty: prob.difficulty,
        completed: statusEntry ? statusEntry.completed : false,
      };
    });
  }

  async addProblem(
    userId: string,
    categoryId: string,
    problemName: string,
    problemLink: string,
    difficulty: Difficulty
  ) {
    return repository.createProblem(userId, categoryId, problemName, problemLink, difficulty);
  }

  async updateProblem(
    id: string,
    userId: string,
    categoryId: string,
    problemName: string,
    problemLink: string,
    difficulty: Difficulty
  ) {
    const problem = await repository.findProblemById(id);
    if (!problem) throw new Error('Problem not found');
    // Ownership guard: only the creator can edit
    if (problem.userId !== userId) throw new Error('Forbidden');
    return repository.updateProblem(id, categoryId, problemName, problemLink, difficulty);
  }

  async deleteProblem(id: string, userId: string) {
    const problem = await repository.findProblemById(id);
    if (!problem) throw new Error('Problem not found');
    // Ownership guard: only the creator can delete
    if (problem.userId !== userId) throw new Error('Forbidden');
    return repository.deleteProblem(id);
  }

  async updateProblemStatus(userId: string, problemId: string, completed: boolean) {
    const problem = await repository.findProblemById(problemId);
    if (!problem) throw new Error('Problem not found');
    // Only allow status updates on problems the user owns
    if (problem.userId !== userId) throw new Error('Forbidden');
    return repository.updateStatus(userId, problemId, completed);
  }
}
