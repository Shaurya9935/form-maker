import { z } from 'zod';

export const createFormInputModel = z.object({
  title: z.string().min(1, 'Title is required').max(55, 'Title cannot exceed 55 characters'),
  description: z.string().max(300, 'Description cannot exceed 300 characters').optional(),
});

export const createFormOutputModel = z.object({
  id: z.string().describe('id of the created form'),
});
