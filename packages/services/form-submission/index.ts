import { db } from '@repo/database'
import { formSubmissionTable } from '@repo/database/models/form-submission'
import { createSubmissionInput, CreateSubmissionInputType } from './model'

class FormSubmissionService {
  public async createSubmission(payload: CreateSubmissionInputType) {
    const { formId, values } = await createSubmissionInput.parseAsync(payload)

    const result = await db
      .insert(formSubmissionTable)
      .values({
        formId,
        values,
      })
      .returning({
        id: formSubmissionTable.id,
      })

    if (!result || result.length === 0 || !result[0]?.id) {
      throw new Error('Something went wrong while submitting form')
    }

    return { id: result[0].id }
  }
}

export default FormSubmissionService
