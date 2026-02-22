'use server'

import { ErrorResponseSchema, RegisterSchema, SuccessSchema } from "@/src/schemas";

type ActionSteteType = {
    errors: string[];
    success: string;
}

export async function register(prevState: ActionSteteType, formData: FormData) {
    const registerData = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        password_confirmation: formData.get('password_confirmation')
    } 

    // Validar
    const register = RegisterSchema.safeParse(registerData)

    // Enviar errores
    if (!register.success) {
        const errors = register.error.issues.map(error => error.message);
        return {
            errors,
            success: '' // Retornamos el valor inicial del state
        }
    }

    // Registrar el usuario
    const url = `${process.env.API_URL}/auth/create-account`;
    const request = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: register.data.name,
            email: register.data.email,
            password: register.data.password,
        })
    })

    const json = await request.json();

    if (request.status === 409 || request.status === 500) {
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