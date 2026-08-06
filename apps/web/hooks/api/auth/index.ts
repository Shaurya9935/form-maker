import { trpc } from "~/trpc/client";

export const useSignup = () => {
    const {
        mutateAsync: createUserWithEmailAndPasswordAsync, 
        mutate:createUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status

    } = trpc.auth.createUserWithEmailAndPassword.useMutation();
    return{
        createUserWithEmailAndPassword,
        createUserWithEmailAndPasswordAsync,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    }
}

export const useSignIn = () => {
    const {
        mutateAsync: signInUserWithEmailAndPasswordAsync, 
        mutate:signInUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status

    } = trpc.auth.signInUserWithEmailAndPassword.useMutation();
    return{
        signInUserWithEmailAndPassword,
        signInUserWithEmailAndPasswordAsync,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    }
}