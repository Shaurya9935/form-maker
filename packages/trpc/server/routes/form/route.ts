import { formService, formFieldService, formSubmissionService } from "../../services";
import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
  createFormInputModel,
  createFormOutputModel,
  listMyFormsInputModel,
  listMyFormsOutputModel,
  createFieldInputModel,
  createFieldOutputModel,
  updateFieldInputModel,
  updateFieldOutputModel,
  getFieldsInputModel,
  getFieldsOutputModel,
  deleteFieldInputModel,
  deleteFieldOutputModel,
  getFormInputModel,
  getFormOutputModel,
  submitFormInputModel,
  submitFormOutputModel,
  getFormSubmissionsInputModel,
  getFormSubmissionsOutputModel,
} from "./model";

const TAGS = ["Form"];
const getPath = generatePath("/form");

export const formRouter = router({
  getForm: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/getForm"),
        tags: TAGS,
      },
    })
    .input(getFormInputModel)
    .output(getFormOutputModel)
    .query(async ({ input }) => {
      return formService.getFormById({ formId: input.formId });
    }),

  submitForm: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/submitForm"),
        tags: TAGS,
      },
    })
    .input(submitFormInputModel)
    .output(submitFormOutputModel)
    .mutation(async ({ input }) => {
      return formSubmissionService.createSubmission(input);
    }),

  getFormSubmissions: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/getFormSubmissions"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(getFormSubmissionsInputModel)
    .output(getFormSubmissionsOutputModel)
    .query(async ({ input }) => {
      return formSubmissionService.getFormSubmissionsByFormId({
        formId: input.formId,
      });
    }),

  createForm: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/createForm"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(createFormInputModel)
    .output(createFormOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { title, description } = input;

      const { id } = await formService.createForm({
        title,
        description,
        createdBy: ctx.user.id,
      });

      return {
        id,
      };
    }),

  listForms: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/getForms"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(listMyFormsInputModel)
    .output(listMyFormsOutputModel)
    .query(async ({ ctx }) => {
      const forms = await formService.listFormsByUserId({
        userId: ctx.user.id,
      });

      return forms;
    }),

  getFields: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/getFields"),
        tags: TAGS,
      },
    })
    .input(getFieldsInputModel)
    .output(getFieldsOutputModel)
    .query(async ({ input }) => {
      return formFieldService.getFields({ formId: input.formId });
    }),

  createField: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/createField"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(createFieldInputModel)
    .output(createFieldOutputModel)
    .mutation(async ({ input }) => {
      return formFieldService.createField(input);
    }),

  updateField: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/updateField"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(updateFieldInputModel)
    .output(updateFieldOutputModel)
    .mutation(async ({ input }) => {
      return formFieldService.updateField(input);
    }),

  deleteField: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/deleteField"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(deleteFieldInputModel)
    .output(deleteFieldOutputModel)
    .mutation(async ({ input }) => {
      return formFieldService.deleteField(input);
    }),
});