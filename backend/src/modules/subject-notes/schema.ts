import { z } from 'zod';

export const subjectNoteSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  notesLink: z.string().url('Notes link must be a valid URL'),
});
