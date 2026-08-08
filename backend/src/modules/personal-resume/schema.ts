import { z } from 'zod';

export const resumeSchema = z.object({
  resumeLink: z
    .string()
    .min(1, 'Resume link is required')
    .url('Resume link must be a valid URL'),
});
