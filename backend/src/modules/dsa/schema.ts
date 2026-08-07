import { z } from 'zod';

export const problemSchema = z.object({
  problemName: z.string().min(1, 'Problem name is required'),
  problemLink: z.string().url('Problem link must be a valid URL'),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  categoryId: z.string().uuid('Category ID must be a valid UUID'),
});

export const statusSchema = z.object({
  completed: z.boolean(),
});
