import { db, eq, desc } from '@repo/database'
import { formSubmissionTable } from '@repo/database/models/form-submission'
import {
  createSubmissionInput,
  CreateSubmissionInputType,
  getFormSubmissionsByFormIdInput,
  GetFormSubmissionsByFormIdInputType,
} from './model'

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

  public async getFormSubmissionsByFormId(payload: GetFormSubmissionsByFormIdInputType) {
    const { formId } = await getFormSubmissionsByFormIdInput.parseAsync(payload)

    const submissions = await db
      .select({
        id: formSubmissionTable.id,
        formId: formSubmissionTable.formId,
        values: formSubmissionTable.values,
        createdAt: formSubmissionTable.createdAt,
        updatedAt: formSubmissionTable.updatedAt,
      })
      .from(formSubmissionTable)
      .where(eq(formSubmissionTable.formId, formId))
      .orderBy(desc(formSubmissionTable.createdAt))

    return submissions
  }
}

export default FormSubmissionService
