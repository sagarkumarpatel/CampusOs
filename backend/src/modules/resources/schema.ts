import { z } from 'zod';

export const createSubjectNoteSchema = z.object({
  subjectName: z.string().min(1, 'Subject name is required'),
  resourceLink: z.string().url('Please enter a valid URL'),
});

export const createPrevYearQuestionSchema = z.object({
  subjectName: z.string().min(1, 'Subject name is required'),
  year: z.number().int().min(1900).max(2100),
  semester: z.number().int().min(1).max(10),
  questionPaperLink: z.string().url('Please enter a valid URL'),
});

export const createInterviewNoteSchema = z.object({
  topicName: z.string().min(1, 'Topic name is required'),
  interviewNotesLink: z.string().url('Please enter a valid URL'),
});

export const createCheatSheetSchema = z.object({
  name: z.string().min(1, 'Cheat sheet name is required'),
  imageUrl: z.string().url('Image URL must be a valid URL'),
});
