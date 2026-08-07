import { z } from 'zod'

export const createFormInput = z.object({
  title: z.string().min(1, 'Title is required').max(55, 'Title cannot exceed 55 characters'),
  description: z.string().max(300, 'Description cannot exceed 300 characters').optional(),
  createdBy: z.string().uuid('Invalid user ID'),
})

export type CreateFormInputType = z.infer<typeof createFormInput>

export const listFormsByUserIdInput = z.object({
  userId: z.string().uuid('Invalid user ID'),
})

export type ListFormsByUserIdInputType = z.infer<typeof listFormsByUserIdInput>

export const getFormByIdInput = z.object({
  formId: z.string().uuid('Invalid form ID'),
})

export type GetFormByIdInputType = z.infer<typeof getFormByIdInput>


