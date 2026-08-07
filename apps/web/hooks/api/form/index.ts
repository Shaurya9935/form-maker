import { trpc } from "~/trpc/client";

export const useCreateForm = () => {
    const utils = trpc.useUtils()

    const {
        mutateAsync: createFormAsync,
        mutate: createForm,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    } = trpc.form.createForm.useMutation({
        onSuccess: async () => {
            await utils.form.invalidate()
        }
    });

    return {
        createForm,
        createFormAsync,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    }
}

export const useGetForms = () => {
    const { data: forms, error, isFetched, isFetching, isLoading, status } = trpc.form.listForms.useQuery()

    return {
        forms,
        error,
        isFetched,
        isFetching,
        isLoading,
        status
    }
}

export const useGetForm = (formId: string) => {
    const { data: form, error, isFetched, isFetching, isLoading, status } = trpc.form.getForm.useQuery(
        { formId },
        { enabled: !!formId }
    )

    return {
        form,
        error,
        isFetched,
        isFetching,
        isLoading,
        status
    }
}

export const useCreateField = () => {
    const utils = trpc.useUtils()

    const {
        mutateAsync: createFieldAsync,
        mutate: createField,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    } = trpc.form.createField.useMutation({
        onSuccess: async () => {
            await Promise.all([
                utils.form.getFields.invalidate(),
                utils.form.getForm.invalidate()
            ])
        }
    });

    return {
        createField,
        createFieldAsync,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    }
}

export const useUpdateField = () => {
    const utils = trpc.useUtils()

    const {
        mutateAsync: updateFieldAsync,
        mutate: updateField,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    } = trpc.form.updateField.useMutation({
        onSuccess: async () => {
            await Promise.all([
                utils.form.getFields.invalidate(),
                utils.form.getForm.invalidate()
            ])
        }
    });

    return {
        updateField,
        updateFieldAsync,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    }
}

export const useGetFields = (formId: string) => {
    const { data: fields, error, isFetched, isFetching, isLoading, status } = trpc.form.getFields.useQuery(
        { formId },
        { enabled: !!formId }
    )

    return {
        fields,
        error,
        isFetched,
        isFetching,
        isLoading,
        status
    }
}

export const useDeleteField = () => {
    const utils = trpc.useUtils()

    const {
        mutateAsync: deleteFieldAsync,
        mutate: deleteField,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    } = trpc.form.deleteField.useMutation({
        onSuccess: async () => {
            await Promise.all([
                utils.form.getFields.invalidate(),
                utils.form.getForm.invalidate()
            ])
        }
    });

    return {
        deleteField,
        deleteFieldAsync,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    }
}
