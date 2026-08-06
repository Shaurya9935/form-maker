import { z } from 'zod';
import {
  createFieldInput,
  updateFieldInput,
  getFieldsInput,
  deleteFieldInput,
} from '@repo/services/form-field/model';

export const createFormInputModel = z.object({
  title: z.string().min(1, 'Title is required').max(55, 'Title cannot exceed 55 characters'),
  description: z.string().max(300, 'Description cannot exceed 300 characters').optional(),
});

export const createFormOutputModel = z.object({
  id: z.string().describe('id of the created form'),
});

export const listMyFormsInputModel = z.undefined();

export const listMyFormsOutputModel = z.array(
  z.object({
    id: z.string().describe('ID of the form'),
    title: z.string().describe('Title of the form'),
    description: z.string().optional().nullable().describe('Description of the form'),
    createdAt: z.date().optional().nullable().describe('Creation timestamp'),
    updatedAt: z.date().optional().nullable().describe('Last updated timestamp'),
  })
);

// Form Field Models

const fieldTypeEnum = z.enum(['TEXT', 'NUMBER', 'EMAIL', 'YES_NO', 'PASSWORD'])

const formFieldObject = z.object({
    id: z.string().describe('ID of the field'),
    label: z.string().describe('Display label'),
    labelKey: z.string().describe('Immutable slug key'),
    type: fieldTypeEnum,
    description: z.string().nullable().optional(),
    placeholder: z.string().nullable().optional(),
    isRequired: z.boolean(),
    index: z.string().describe('Fractional index for ordering'),
})

export const createFieldInputModel = z.object({
    formId: z.string().uuid().describe('UUID of the form'),
    label: z.string().max(100).describe('Display label for the field'),
    type: fieldTypeEnum.describe('Type of the field'),
    description: z.string().optional(),
    placeholder: z.string().optional(),
    isRequired: z.boolean().optional().default(false),
})

export const createFieldOutputModel = z.object({
    id: z.string(),
    labelKey: z.string(),
    index: z.string(),
})

export const updateFieldInputModel = z.object({
    fieldId: z.string().uuid().describe('UUID of the field to update'),
    label: z.string().max(100).optional(),
    type: fieldTypeEnum.optional(),
    description: z.string().nullable().optional(),
    placeholder: z.string().nullable().optional(),
    isRequired: z.boolean().optional(),
})

export const updateFieldOutputModel = z.object({
    id: z.string(),
})

export const deleteFieldInputModel = z.object({
    fieldId: z.string().uuid().describe('UUID of the field to delete'),
})

export const deleteFieldOutputModel = z.object({
    id: z.string(),
})

export const getFieldsInputModel = z.object({
    formId: z.string().uuid().describe('UUID of the form'),
})

export const getFieldsOutputModel = z.array(formFieldObject)

export const getFormInputModel = z.object({
    formId: z.string().uuid().describe('UUID of the form'),
})

export const getFormOutputModel = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable().optional(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
    fields: z.array(formFieldObject),
}).nullable()
