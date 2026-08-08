import { z } from 'zod'

export const formSubmissionValueSchema = z.object({
  formFieldId: z.string().uuid('Invalid field ID'),
  value: z.string(),
})

export const createSubmissionInput = z.object({
  formId: z.string().uuid('Invalid form ID'),
  values: z.array(formSubmissionValueSchema),
})

export type CreateSubmissionInputType = z.infer<typeof createSubmissionInput>

export const getFormSubmissionsByFormIdInput = z.object({
  formId: z.string().uuid('Invalid form ID'),
})

export type GetFormSubmissionsByFormIdInputType = z.infer<typeof getFormSubmissionsByFormIdInput>

