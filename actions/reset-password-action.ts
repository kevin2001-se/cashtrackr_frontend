'use server'

import { ErrorResponseSchema, ResetPasswordSchema, SuccessSchema } from "@/src/schemas";

type ActionStateType = {
    errors: string[];
    success: string;
}

export async function resetPassword(token: string, prevState: ActionStateType, formData: FormData) {

    const resetPasswordInput = {
        password: formData.get('password'),
        password_confirmation: formData.get('password_confirmation'),
    }

    const resetPassowrd = ResetPasswordSchema.safeParse(resetPasswordInput);

    if (!resetPassowrd.success) {
        return {
            errors: resetPassowrd.error.issues.map(error => error.message),
            success: ''
        }
    }

    const url = `${process.env.API_URL}/auth/reset-password/${token}`;
    const request = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            password: resetPassowrd.data.password,
        })
    })
    
    const json = await request.json();

    if (!request.ok) {
        const error = ErrorResponseSchema.parse(json)

        return {
            errors: [error.error],
            success: ''
        }
    }

    const success = SuccessSchema.parse(json)

    return {
        errors: [],
        success
    }
}