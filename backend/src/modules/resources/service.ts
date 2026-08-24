import { ResourcesRepository } from './repository';
import {
  CreateSubjectNoteInput,
  CreatePrevYearQuestionInput,
  CreateInterviewNoteInput,
  CreateCheatSheetInput,
} from './types';
import {
  createSubjectNoteSchema,
  createPrevYearQuestionSchema,
  createInterviewNoteSchema,
  createCheatSheetSchema,
} from './schema';

export class ResourcesService {
  private repository = new ResourcesRepository();

  async getAllResources() {
    const [subjectNotes, previousYearQuestions, interviewNotes, cheatSheets] = await Promise.all([
      this.repository.getAllSubjectNotes(),
      this.repository.getAllPrevYearQuestions(),
      this.repository.getAllInterviewNotes(),
      this.repository.getAllCheatSheets(),
    ]);

    return {
      subjectNotes,
      previousYearQuestions,
      interviewNotes,
      cheatSheets,
    };
  }

  // Core Subject Notes
  async createSubjectNote(data: CreateSubjectNoteInput) {
    createSubjectNoteSchema.parse(data);
    return this.repository.createSubjectNote(data);
  }

  async updateSubjectNote(id: string, data: Partial<CreateSubjectNoteInput>) {
    const existing = await this.repository.findSubjectNoteById(id);
    if (!existing) throw new Error('Subject note resource not found');
    return this.repository.updateSubjectNote(id, data);
  }

  async deleteSubjectNote(id: string) {
    const existing = await this.repository.findSubjectNoteById(id);
    if (!existing) throw new Error('Subject note resource not found');
    return this.repository.deleteSubjectNote(id);
  }

  // Previous Year Questions
  async createPrevYearQuestion(data: CreatePrevYearQuestionInput) {
    createPrevYearQuestionSchema.parse(data);
    return this.repository.createPrevYearQuestion(data);
  }

  async updatePrevYearQuestion(id: string, data: Partial<CreatePrevYearQuestionInput>) {
    const existing = await this.repository.findPrevYearQuestionById(id);
    if (!existing) throw new Error('Previous year question resource not found');
    return this.repository.updatePrevYearQuestion(id, data);
  }

  async deletePrevYearQuestion(id: string) {
    const existing = await this.repository.findPrevYearQuestionById(id);
    if (!existing) throw new Error('Previous year question resource not found');
    return this.repository.deletePrevYearQuestion(id);
  }

  // Interview Notes
  async createInterviewNote(data: CreateInterviewNoteInput) {
    createInterviewNoteSchema.parse(data);
    return this.repository.createInterviewNote(data);
  }

  async updateInterviewNote(id: string, data: Partial<CreateInterviewNoteInput>) {
    const existing = await this.repository.findInterviewNoteById(id);
    if (!existing) throw new Error('Interview note resource not found');
    return this.repository.updateInterviewNote(id, data);
  }

  async deleteInterviewNote(id: string) {
    const existing = await this.repository.findInterviewNoteById(id);
    if (!existing) throw new Error('Interview note resource not found');
    return this.repository.deleteInterviewNote(id);
  }

  // Cheat Sheets
  async createCheatSheet(data: CreateCheatSheetInput) {
    createCheatSheetSchema.parse(data);
    return this.repository.createCheatSheet(data);
  }

  async updateCheatSheet(id: string, data: Partial<CreateCheatSheetInput>) {
    const existing = await this.repository.findCheatSheetById(id);
    if (!existing) throw new Error('Cheat sheet resource not found');
    return this.repository.updateCheatSheet(id, data);
  }

  async deleteCheatSheet(id: string) {
    const existing = await this.repository.findCheatSheetById(id);
    if (!existing) throw new Error('Cheat sheet resource not found');
    return this.repository.deleteCheatSheet(id);
  }
}
