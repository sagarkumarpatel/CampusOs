import { SubjectNotesRepository } from './repository';

const repository = new SubjectNotesRepository();

export class SubjectNotesService {
  async getNotes(userId: string) {
    return repository.getNotesByUser(userId);
  }

  async addOrUpdateNote(userId: string, subject: string, notesLink: string) {
    return repository.upsertNote(userId, subject, notesLink);
  }

  async updateNote(id: string, userId: string, subject: string, notesLink: string) {
    const note = await repository.findNoteById(id);
    if (!note) {
      throw new Error('Note not found');
    }
    // Verify ownership
    if (note.userId !== userId) {
      throw new Error('Forbidden');
    }
    return repository.updateNote(id, subject, notesLink);
  }

  async deleteNote(id: string, userId: string) {
    const note = await repository.findNoteById(id);
    if (!note) {
      throw new Error('Note not found');
    }
    // Verify ownership
    if (note.userId !== userId) {
      throw new Error('Forbidden');
    }
    return repository.deleteNote(id);
  }
}
