import { z } from 'zod';

export const createOpportunitySchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Role is required'),
  jobType: z.enum(['INTERNSHIP', 'FULL_TIME_JOB', 'FREELANCE_OPPORTUNITY']),
  location: z.string().min(1, 'Location is required'),
  stipendPerMonth: z.number().int().nonnegative('Stipend must be a non-negative integer'),
  applicationLink: z.string().url('Application link must be a valid URL'),
  bannerImageUrl: z.string().url('Banner image URL must be a valid URL'),
});

export const updateOpportunitySchema = createOpportunitySchema.partial();
