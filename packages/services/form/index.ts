import { db, eq, asc } from '@repo/database'
import { formsTable } from '@repo/database/models/form'
import { formFieldsTable } from '@repo/database/models/form-field'
import {
  createFormInput,
  CreateFormInputType,
  listFormsByUserIdInput,
  ListFormsByUserIdInputType,
  getFormByIdInput,
  GetFormByIdInputType,
} from './model'

class FormService {
  public async createForm(payload: CreateFormInputType) {
    const { title, description, createdBy } = await createFormInput.parseAsync(payload)

    const formInsertResult = await db
      .insert(formsTable)
      .values({
        title,
        description,
        createdBy,
      })
      .returning({
        id: formsTable.id,
      })

    if (!formInsertResult || formInsertResult.length === 0 || !formInsertResult[0]?.id) {
      throw new Error('Something went wrong while creating form')
    }

    return { id: formInsertResult[0].id }
  }

  public async listFormsByUserId(payload: ListFormsByUserIdInputType) {
    const { userId } = await listFormsByUserIdInput.parseAsync(payload)

    const forms = await db
      .select({
        id: formsTable.id,
        title: formsTable.title,
        description: formsTable.description,
        createdAt: formsTable.createdAt,
        updatedAt: formsTable.updatedAt,
      })
      .from(formsTable)
      .where(eq(formsTable.createdBy, userId))

    return forms
  }

  public async getFormById(payload: GetFormByIdInputType) {
    const { formId } = await getFormByIdInput.parseAsync(payload)

    const rows = await db
      .select({
        formId: formsTable.id,
        title: formsTable.title,
        description: formsTable.description,
        createdAt: formsTable.createdAt,
        updatedAt: formsTable.updatedAt,
        fieldId: formFieldsTable.id,
        fieldLabel: formFieldsTable.label,
        fieldLabelKey: formFieldsTable.labelKey,
        fieldType: formFieldsTable.type,
        fieldDescription: formFieldsTable.description,
        fieldPlaceholder: formFieldsTable.placeholder,
        fieldIsRequired: formFieldsTable.isRequired,
        fieldIndex: formFieldsTable.index,
      })
      .from(formsTable)
      .leftJoin(formFieldsTable, eq(formsTable.id, formFieldsTable.formId))
      .where(eq(formsTable.id, formId))
      .orderBy(asc(formFieldsTable.index))

    if (!rows || rows.length === 0) {
      return null
    }

    const firstRow = rows[0]!

    const fields = rows
      .filter((row) => row.fieldId !== null)
      .map((row) => ({
        id: row.fieldId!,
        label: row.fieldLabel!,
        labelKey: row.fieldLabelKey!,
        type: row.fieldType!,
        description: row.fieldDescription ?? null,
        placeholder: row.fieldPlaceholder ?? null,
        isRequired: row.fieldIsRequired!,
        index: row.fieldIndex!,
      }))

    return {
      id: firstRow.formId,
      title: firstRow.title,
      description: firstRow.description ?? null,
      createdAt: firstRow.createdAt,
      updatedAt: firstRow.updatedAt,
      fields,
    }
  }
}

export default FormService
