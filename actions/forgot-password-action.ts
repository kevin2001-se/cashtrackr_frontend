'use server'

import { ErrorResponseSchema, ForgotPasswordSchema, SuccessSchema } from "@/src/schemas";

type ActionStateType = {
    errors: string[];
    success: string;
}

export async function forgotPassword(prevState: ActionStateType, formData: FormData) {
    
    const forgotPassoword = ForgotPasswordSchema.safeParse({
        email: formData.get('email')
    })

    if (!forgotPassoword.success) {
        return {
            errors: forgotPassoword.error.issues.map(error => error.message),
            success: ''
        }
    }

    const url = `${process.env.API_URL}/auth/forgot-password`;
    const request = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: forgotPassoword.data.email
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
        success: success
    }
}