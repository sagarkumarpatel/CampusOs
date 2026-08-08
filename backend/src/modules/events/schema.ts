import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  bannerImageUrl: z.string().url('Banner image must be a valid URL'),
  category: z.enum(['HACKATHON', 'WORKSHOP', 'TECHNICAL_EVENT', 'CODING_CONTEST']),
  organizer: z.string().min(1, 'Organizer is required'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Date must be a valid date string',
  }),
  startTime: z.string().min(1, 'Start Time is required'),
  endTime: z.string().min(1, 'End Time is required'),
  location: z.string().min(1, 'Location is required'),
  registrationDeadline: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Registration Deadline must be a valid date string',
  }),
  maximumParticipants: z.preprocess(
    (val) => Number(val),
    z.number().positive('Maximum Participants must be a valid positive number')
  ),
  registrationLink: z.string().url('Registration Link must be a valid URL'),
});
