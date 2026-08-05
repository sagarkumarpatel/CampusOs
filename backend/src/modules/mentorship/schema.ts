import { z } from 'zod';

export const createMentorProfileSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  company: z.string().min(1, 'Company is required'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  bio: z.string().optional(),
  linkedinUrl: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  calendlyUrl: z.string().url('Invalid Calendly URL').optional().or(z.literal('')),
  isAvailable: z.boolean().optional(),
});

export const requestMentorshipSchema = z.object({
  message: z.string().min(1, 'Message is required').max(500, 'Message cannot exceed 500 characters'),
});

export const updateRequestStatusSchema = z.object({
  status: z.enum(['ACCEPTED', 'REJECTED', 'CANCELLED']),
});
