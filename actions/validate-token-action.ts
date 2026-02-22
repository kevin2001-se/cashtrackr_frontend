'use server'

import { ErrorResponseSchema, SuccessSchema, TokenSchemma } from "@/src/schemas";

type ActionStateType = {
    errors: string[];
    success: string;
}

export async function validateToken(token: string, prevState: ActionStateType) {
    
    const resetPasswordToken = TokenSchemma.safeParse(token);

    if (!resetPasswordToken.success) {
        return {
            errors: resetPasswordToken.error.issues.map(error => error.message),
            success: ''
        }
    }

    const url = `${process.env.API_URL}/auth/validate-token`;
    const request = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: resetPasswordToken.data,
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