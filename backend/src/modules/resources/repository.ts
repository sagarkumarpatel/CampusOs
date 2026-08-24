import prisma from '../../config/prisma';
import {
  CreateSubjectNoteInput,
  CreatePrevYearQuestionInput,
  CreateInterviewNoteInput,
  CreateCheatSheetInput,
} from './types';

export class ResourcesRepository {
  // Core Subject Notes
  async getAllSubjectNotes() {
    return prisma.resourceCoreSubjectNote.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findSubjectNoteById(id: string) {
    return prisma.resourceCoreSubjectNote.findUnique({
      where: { id },
    });
  }

  async createSubjectNote(data: CreateSubjectNoteInput) {
    return prisma.resourceCoreSubjectNote.create({
      data,
    });
  }

  async updateSubjectNote(id: string, data: Partial<CreateSubjectNoteInput>) {
    return prisma.resourceCoreSubjectNote.update({
      where: { id },
      data,
    });
  }

  async deleteSubjectNote(id: string) {
    return prisma.resourceCoreSubjectNote.delete({
      where: { id },
    });
  }

  // Previous Year Questions
  async getAllPrevYearQuestions() {
    return prisma.resourcePreviousYearQuestion.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPrevYearQuestionById(id: string) {
    return prisma.resourcePreviousYearQuestion.findUnique({
      where: { id },
    });
  }

  async createPrevYearQuestion(data: CreatePrevYearQuestionInput) {
    return prisma.resourcePreviousYearQuestion.create({
      data,
    });
  }

  async updatePrevYearQuestion(id: string, data: Partial<CreatePrevYearQuestionInput>) {
    return prisma.resourcePreviousYearQuestion.update({
      where: { id },
      data,
    });
  }

  async deletePrevYearQuestion(id: string) {
    return prisma.resourcePreviousYearQuestion.delete({
      where: { id },
    });
  }

  // Interview Notes
  async getAllInterviewNotes() {
    return prisma.resourceInterviewNote.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findInterviewNoteById(id: string) {
    return prisma.resourceInterviewNote.findUnique({
      where: { id },
    });
  }

  async createInterviewNote(data: CreateInterviewNoteInput) {
    return prisma.resourceInterviewNote.create({
      data,
    });
  }

  async updateInterviewNote(id: string, data: Partial<CreateInterviewNoteInput>) {
    return prisma.resourceInterviewNote.update({
      where: { id },
      data,
    });
  }

  async deleteInterviewNote(id: string) {
    return prisma.resourceInterviewNote.delete({
      where: { id },
    });
  }

  // Cheat Sheets
  async getAllCheatSheets() {
    return prisma.resourceCheatSheet.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findCheatSheetById(id: string) {
    return prisma.resourceCheatSheet.findUnique({
      where: { id },
    });
  }

  async createCheatSheet(data: CreateCheatSheetInput) {
    return prisma.resourceCheatSheet.create({
      data,
    });
  }

  async updateCheatSheet(id: string, data: Partial<CreateCheatSheetInput>) {
    return prisma.resourceCheatSheet.update({
      where: { id },
      data,
    });
  }

  async deleteCheatSheet(id: string) {
    return prisma.resourceCheatSheet.delete({
      where: { id },
    });
  }
}
