import prisma from '../../config/prisma';

export class SubjectNotesRepository {
  async getNotesByUser(userId: string) {
    return prisma.coreSubjectNote.findMany({
      where: { userId },
      orderBy: { subject: 'asc' },
    });
  }

  async findNoteById(id: string) {
    return prisma.coreSubjectNote.findUnique({
      where: { id },
    });
  }

  async findNoteByUserAndSubject(userId: string, subject: string) {
    return prisma.coreSubjectNote.findUnique({
      where: {
        userId_subject: { userId, subject }
      }
    });
  }

  async upsertNote(userId: string, subject: string, notesLink: string) {
    return prisma.coreSubjectNote.upsert({
      where: {
        userId_subject: { userId, subject }
      },
      update: { notesLink },
      create: { userId, subject, notesLink }
    });
  }

  async updateNote(id: string, subject: string, notesLink: string) {
    return prisma.coreSubjectNote.update({
      where: { id },
      data: { subject, notesLink }
    });
  }

  async deleteNote(id: string) {
    return prisma.coreSubjectNote.delete({
      where: { id }
    });
  }
}
