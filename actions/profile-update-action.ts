'use server'

import getToken from "@/src/auth/token";
import { ErrorResponseSchema, SuccessSchema, UpdateProfileSchema } from "@/src/schemas";

type ActionStateType = {
    errors: string[];
    success: string;
}

export async function updateProfile(prevState: ActionStateType, formData: FormData) {

    const updateProfile = UpdateProfileSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email')
    })

    if (!updateProfile.success) {
        return {
            errors: updateProfile.error.issues.map(issue => issue.message),
            success: ''
        }
    }
            
    const token = getToken();

    const url = `${process.env.API_URL}/auth/user`;
    const request = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            name: updateProfile.data.name,
            email: updateProfile.data.email,
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
    console.log(success);

    return {
        errors: [],
        success
    }
}